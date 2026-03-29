# Code Execution Engine — Web Worker Design

**Date:** 2026-03-29
**Status:** Approved
**Replaces:** Piston API (`https://emkc.org/api/v2/piston/execute`)

## Problem

Engineer Man's Piston public API has been removed. The app's code submission flow
(`handleSubmitCode` in `app/containers/Workspace/helpers.ts`) is broken — users
cannot execute code.

## Decision

Replace the Piston API call with a client-side Web Worker that executes
JavaScript in the browser. No new infrastructure, no external dependencies.

**Note on dynamic code execution:** This design intentionally uses `new Function()`
to evaluate user-submitted code. This is the core purpose of the application — it
is a code execution sandbox. The Web Worker isolation ensures the executed code
cannot access the DOM, window, or main thread state. This is the same trust model
as the previous Piston API approach, but running client-side.

## Constraints

- JavaScript only (no other languages needed)
- Deployed on Vercel (serverless — no Docker, no persistent processes)
- 5-second execution timeout (problems are simple algorithm challenges)
- Must return the same output shape so Workspace.tsx changes are minimal

---

## New Files

### 1. `public/workers/code-runner.js`

The Web Worker that executes user code in an isolated thread.

```js
// public/workers/code-runner.js
//
// This file runs in a Web Worker context — it has NO access to the DOM,
// window, document, or any browser APIs. It only communicates via
// postMessage/onmessage. That's what makes it a safe sandbox.

// Listen for code execution requests from the main thread
self.onmessage = function (event) {
  const { code } = event.data;

  // --- Step 1: Capture console.log output ---
  // Users expect console.log("hello") to appear in the console panel.
  // We override console.log to collect all output into an array,
  // then join it into a single string at the end.
  const logs = [];
  const originalConsole = console.log;
  console.log = function (...args) {
    // Convert each argument to a string, just like Node.js does.
    // Objects get JSON-stringified so users see {key: "value"}
    // instead of [object Object].
    logs.push(
      args
        .map(function (arg) {
          if (typeof arg === "object" && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(" ")
    );
  };

  // --- Step 1.5: Lock down dangerous globals ---
  // Web Workers have access to fetch, XMLHttpRequest, WebSocket, etc.
  // We disable these before running user code to prevent:
  //   - Outbound network requests (data exfiltration, SSRF)
  //   - Loading external scripts via importScripts()
  //   - Opening persistent connections via WebSocket/EventSource
  self.fetch = undefined;
  self.XMLHttpRequest = undefined;
  self.importScripts = undefined;
  self.WebSocket = undefined;
  self.EventSource = undefined;

  // --- Step 2: Execute the code ---
  // We use new Function() instead of eval() because:
  //   - eval() executes in the current scope (can access `logs`, etc.)
  //   - new Function() creates a function with its own scope — the user's code
  //     can only see globals, not our local variables
  //
  // This is intentional dynamic code execution — it's the core purpose of
  // this app (a coding challenge platform). The Web Worker isolation ensures
  // user code cannot access the DOM or main thread.
  //
  // The try/catch ensures syntax errors and runtime errors are caught
  // and returned as a message instead of crashing the Worker.
  try {
    const fn = new Function(code);
    fn();

    // --- Step 3: Send results back ---
    self.postMessage({
      output: logs.join("\n"),
      error: null,
    });
  } catch (err) {
    self.postMessage({
      output: logs.join("\n"), // include any logs that ran before the error
      error: err.toString(),
    });
  }
};
```

**How it works step by step:**

1. Main thread calls `worker.postMessage({ code: "console.log(2+2)" })`
2. Worker's `onmessage` fires, receives the code string
3. `console.log` is replaced with our capturing version
4. `new Function(code)()` executes the user's code — any `console.log` calls
   push into the `logs` array
5. Worker calls `self.postMessage({ output: "4", error: null })` back to main thread
6. If the code throws, the catch block sends back whatever logs were collected
   plus the error message

---

### 2. `app/containers/Workspace/executeCode.ts`

The main-thread module that manages the Worker lifecycle.

```ts
// app/containers/Workspace/executeCode.ts
//
// This module is the bridge between the Workspace UI and the Web Worker.
// It handles three concerns:
//   1. Spawning a fresh Worker for each execution
//   2. Enforcing the 5-second timeout
//   3. Cleaning up the Worker after execution (success, error, or timeout)

// Shape of the result — matches what the Worker posts back.
// We keep output and error separate so the UI can display them differently.
interface ExecutionResult {
  output: string;
  error: string | null;
}

const TIMEOUT_MS = 5000;

export const executeCode = (code: string): Promise<ExecutionResult> => {
  return new Promise((resolve) => {
    // --- Create a fresh Worker ---
    // We create a new Worker per execution rather than reusing one because:
    //   1. If the previous run hit an infinite loop and was terminated,
    //      a terminated Worker can't be reused
    //   2. A fresh Worker guarantees no state leaks between runs
    //   3. Worker creation is cheap (~1ms) — not worth optimizing
    const worker = new Worker("/workers/code-runner.js");

    // --- Set up the timeout ---
    // If the user wrote an infinite loop like `while(true) {}`,
    // the Worker will never post a message back. We terminate it
    // after 5 seconds and resolve with a timeout error.
    const timeout = setTimeout(() => {
      worker.terminate();
      resolve({
        output: "",
        error: "Execution timed out (5s limit)",
      });
    }, TIMEOUT_MS);

    // --- Handle successful execution ---
    // The Worker posts { output, error } when it finishes.
    // We clear the timeout, terminate the Worker, and resolve.
    worker.onmessage = (event: MessageEvent<ExecutionResult>) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve(event.data);
    };

    // --- Handle Worker-level errors ---
    // This catches errors that happen outside the user's code,
    // like a syntax error in the Worker file itself.
    worker.onerror = (event: ErrorEvent) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve({
        output: "",
        error: event.message || "An unexpected error occurred",
      });
    };

    // --- Send the code to the Worker ---
    worker.postMessage({ code });
  });
};
```

**Lifecycle for a successful run:**

```
executeCode("console.log(42)")
  |
  +-- new Worker("/workers/code-runner.js")
  +-- setTimeout(terminate, 5000)         <- safety net
  +-- worker.postMessage({ code })        <- send code to Worker
  |
  |  ... Worker executes, ~2ms ...
  |
  +-- worker.onmessage fires
  |   +-- clearTimeout                    <- cancel the safety net
  |   +-- worker.terminate()              <- dispose the Worker
  |   +-- resolve({ output: "42", error: null })
  |
  +-- Promise resolves -> Workspace gets the result
```

**Lifecycle for an infinite loop:**

```
executeCode("while(true) {}")
  |
  +-- new Worker(...)
  +-- setTimeout(terminate, 5000)
  +-- worker.postMessage({ code })
  |
  |  ... 5 seconds pass, no message ...
  |
  +-- timeout fires
  |   +-- worker.terminate()              <- kills the infinite loop
  |   +-- resolve({ output: "", error: "Execution timed out (5s limit)" })
  |
  +-- Promise resolves -> Workspace shows timeout error
```

---

## Modified Files

### 3. `app/containers/Workspace/helpers.ts`

**Before (Piston API):**

```ts
export const handleSubmitCode = async (code: string) => {
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    // ... Piston config
  });
  const respData = await response.json();
  return respData;
};
```

**After (Web Worker):**

```ts
import { executeCode } from "./executeCode";

export const handleSubmitCode = async (code: string) => {
  const result = await executeCode(code);
  // Return in the same shape the Workspace expects:
  // Workspace reads response.run.output — we match that structure
  // so only this file changes, not the component.
  return {
    run: {
      output: result.error
        ? `${result.output}\n${result.error}`.trim()
        : result.output,
    },
  };
};
```

**What changed:** The entire Piston fetch is replaced with a single `executeCode()`
call. The return value is wrapped to match the `{ run: { output } }` shape that
`Workspace.tsx` already expects. This means zero changes to the component.

### 4. `app/containers/Workspace/Workspace.tsx`

**No changes required.** The `handleSubmit` function already reads
`response.run.output`, and the new `handleSubmitCode` returns that same shape.

---

## Summary of Changes

| File | Action | Lines Changed |
|------|--------|---------------|
| `public/workers/code-runner.js` | Create | ~45 |
| `app/containers/Workspace/executeCode.ts` | Create | ~35 |
| `app/containers/Workspace/helpers.ts` | Modify | ~15 (replace handleSubmitCode) |
| `app/containers/Workspace/Workspace.tsx` | None | 0 |

## Security Notes

- Web Workers have no DOM access, no `window`, no `document` — user code
  cannot manipulate the page
- `new Function()` scoping prevents access to Worker internals (this is
  intentional dynamic execution — it's the core purpose of a code sandbox app)
- Workers run on the same origin but in a separate thread — they cannot
  block the UI
- The 5-second terminate is a hard kill — no way for user code to prevent it
- `fetch`, `XMLHttpRequest`, `importScripts`, `WebSocket`, and `EventSource`
  are disabled before user code runs — prevents network access, external
  script loading, and same-origin API abuse
