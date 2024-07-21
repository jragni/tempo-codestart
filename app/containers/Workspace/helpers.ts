const test = `
test('myFunction should log a message', () => {
const consoleLogSpy = jest.spyOn(console, 'log');
  expect(consoleLogSpy).toHaveBeenCalledWith("Hello, World!");
  consoleLogSpy.mockRestore(); // Clean up the spy after the test
});`;

// TODO add python

export const handleSubmitCode = async (code: string) => {
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "language": "javascript",
      "version": "18.15.0",
      "aliases": [
          "node-javascript",
          "node-js",
          "javascript",
          "js"
      ],
      "runtime": "node",
      "files": [
      {
        "name": "index.js",
        "content": code,
      },
    ],
    "compile_memory_limit": -1,
    "run_memory_limit": -1,
    })
  })
  return await response.json()
};