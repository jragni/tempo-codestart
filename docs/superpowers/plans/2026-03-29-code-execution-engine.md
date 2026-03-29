# Code Execution Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dead Piston API with a client-side Web Worker that executes user JavaScript in a sandboxed browser thread.

**Architecture:** A static Web Worker file (`public/workers/code-runner.js`) receives code via `postMessage`, executes it in an isolated thread, captures `console.log` output, and posts results back. A TypeScript module (`executeCode.ts`) manages Worker lifecycle and enforces a 5-second timeout. The existing `handleSubmitCode` wrapper is updated to call `executeCode` and return the same `{ run: { output } }` shape so `Workspace.tsx` requires zero changes.

**Security note:** This app is a code execution sandbox by design. Dynamic code execution within the Web Worker is intentional — the Worker provides DOM isolation, network APIs are disabled, and a hard timeout prevents resource exhaustion.

**Tech Stack:** Web Workers API, TypeScript, Next.js (static file serving via `public/`)

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `public/workers/code-runner.js` | Create | Sandboxed code execution — receives code, captures output, returns results |
| `app/containers/Workspace/executeCode.ts` | Create | Worker lifecycle — spawn, timeout, cleanup, promise interface |
| `app/containers/Workspace/helpers.ts` | Modify | Replace Piston fetch with `executeCode` call, preserve return shape |

---

### Task 1: Create the Web Worker

**Files:**
- Create: `public/workers/code-runner.js`

- [ ] **Step 1: Create the workers directory and worker file**

Create `public/workers/code-runner.js` with the following content. This file intentionally
uses dynamic code execution — it is the core sandbox of a coding challenge platform.
The Worker thread provides isolation: no DOM, no window, and we additionally disable
network APIs before running user code.

```js
// public/workers/code-runner.js
self.onmessage = function (event) {
  var code = event.data.code;

  // Capture console.log output
  var logs = [];
  console.log = function () {
    var args = Array.prototype.slice.call(arguments);
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

  // Lock down dangerous globals before executing user code
  self.fetch = undefined;
  self.XMLHttpRequest = undefined;
  self.importScripts = undefined;
  self.WebSocket = undefined;
  self.EventSource = undefined;

  // Execute user code in isolated Worker scope and return results.
  // Uses Function constructor for scope isolation (user code cannot
  // access Worker-local variables like `logs`).
  try {
    var fn = Function(code);
    fn();
    self.postMessage({
      output: logs.join("\n"),
      error: null,
    });
  } catch (err) {
    self.postMessage({
      output: logs.join("\n"),
      error: err.toString(),
    });
  }
};
```

- [ ] **Step 2: Verify the file is served by Next.js**

Run: `ls public/workers/code-runner.js`
Expected: File exists at that path. Next.js serves anything in `public/` at the root URL, so this will be available at `/workers/code-runner.js`.

- [ ] **Step 3: Commit**

```bash
git add public/workers/code-runner.js
git commit -m "feat: add Web Worker for sandboxed code execution"
```

---

### Task 2: Create the executeCode module

**Files:**
- Create: `app/containers/Workspace/executeCode.ts`

- [ ] **Step 1: Create the executeCode module**

```ts
// app/containers/Workspace/executeCode.ts

interface ExecutionResult {
  output: string;
  error: string | null;
}

const TIMEOUT_MS = 5000;

export const executeCode = (code: string): Promise<ExecutionResult> => {
  return new Promise((resolve) => {
    const worker = new Worker("/workers/code-runner.js");

    const timeout = setTimeout(() => {
      worker.terminate();
      resolve({
        output: "",
        error: "Execution timed out (5s limit)",
      });
    }, TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<ExecutionResult>) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve(event.data);
    };

    worker.onerror = (event: ErrorEvent) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve({
        output: "",
        error: event.message || "An unexpected error occurred",
      });
    };

    worker.postMessage({ code });
  });
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit app/containers/Workspace/executeCode.ts 2>&1 || echo "check for errors above"`
Expected: No type errors. If there are path resolution issues from the isolated check, that's fine — the full build in Task 3 will confirm.

- [ ] **Step 3: Commit**

```bash
git add app/containers/Workspace/executeCode.ts
git commit -m "feat: add executeCode module for Worker lifecycle management"
```

---

### Task 3: Replace Piston API in helpers.ts

**Files:**
- Modify: `app/containers/Workspace/helpers.ts`

- [ ] **Step 1: Replace handleSubmitCode**

The current `handleSubmitCode` function (lines 16-47 of `helpers.ts`) fetches from the Piston API. Replace the entire function body while keeping the same function signature and adding the import.

The full file after modification should be:

```ts
// @ts-ignore: has no exported member
import { jest, describe, it, expect, run } from 'jest-lite';
import { updateUserProblemCode } from "@/app/api/userproblems/handlers";
import { UpdateUserCode } from "./definitions";
import { executeCode } from "./executeCode";

export const handleUpdateUserCode = async ({
  email,
  isSolved,
  problemId,
  userCode,
}: UpdateUserCode) => {
  const response = await updateUserProblemCode({ email, isSolved, problemId, userCode });
  return response;
}

export const handleSubmitCode = async (code: string) => {
  const result = await executeCode(code);
  return {
    run: {
      output: result.error
        ? `${result.output}\n${result.error}`.trim()
        : result.output,
    },
  };
};

export const handleRunTests = async (testCode: string, codeValue: string) => {
  try {
    // This existing code uses Function constructor intentionally —
    // it's the test runner for a coding challenge platform.
    Function('expect', 'jest', 'describe', 'it', testCode.split('${codeValue}').join(codeValue))(
      expect,
      jest,
      describe,
      it,
    );
    const testResultsArray = await run();
    const { status } = testResultsArray.pop();
    return status;
  } catch {
    return 'fail';
  }
}
```

- [ ] **Step 2: Run the full Next.js build to verify everything compiles**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds with no errors related to `handleSubmitCode`, `executeCode`, or the Workspace.

- [ ] **Step 3: Commit**

```bash
git add app/containers/Workspace/helpers.ts
git commit -m "feat: replace Piston API with Web Worker code execution"
```

---

### Task 4: Manual Smoke Test

No code changes — this is a verification task.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Test successful execution**

Navigate to any problem page. Type `console.log("hello world")` in the editor and click Submit.
Expected: "hello world" appears in the console panel below the editor.

- [ ] **Step 3: Test error handling**

Type `undefinedVariable + 1` and click Submit.
Expected: An error message like "ReferenceError: undefinedVariable is not defined" appears in the console.

- [ ] **Step 4: Test timeout**

Type `while(true) {}` and click Submit.
Expected: After ~5 seconds, "Execution timed out (5s limit)" appears in the console. The page should remain responsive throughout.

- [ ] **Step 5: Test multi-line output**

Type:
```js
console.log("line 1")
console.log("line 2")
console.log({ key: "value" })
```
Click Submit.
Expected: Three lines appear in the console:
```
line 1
line 2
{"key":"value"}
```

- [ ] **Step 6: Test that test runner still works**

Submit a correct solution to any problem.
Expected: Toast shows "All test cases passed!" — confirming `handleRunTests` is unaffected.
