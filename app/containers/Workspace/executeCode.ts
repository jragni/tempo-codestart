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
