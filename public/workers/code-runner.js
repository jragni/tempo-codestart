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
