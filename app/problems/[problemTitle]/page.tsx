/**
 * Problems Page
 */

import { Workspace } from "@containers"

export default function ProblemsPage({ params }) {
  const { problemTitle } = params;

  const files = {
    "index.js": {
      code: `console.log("Hello, World!");`
    },
    "index.test.js": {
      code: `
test('myFunction should log a message', () => {
  const consoleLogSpy = jest.spyOn(console, 'log');
  expect(consoleLogSpy).toHaveBeenCalledWith('Hello, World!');
  consoleLogSpy.mockRestore(); // Clean up the spy after the test
});`,
      readOnly: true,
      hidden: true,
    }
  }

  return (
    <div className="flex flex-col justify-between w-full font-bold bg-base-300">
      <div className="p-4">
        <h3 className="text-3xl mb-10">Your First Problem</h3>
        <p className="font-thin">Welcome to Tempo! for your first problem console</p>
      </div>
      <Workspace files={files} />
    </div>
  )
}