/**
 * Problems Page
 */
import { Workspace } from "@containers"


interface PageProps {
  params?: { problemTitle: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}
const initFiles = {
    "index.js": {
      code: `console.log("Hello, World!");`
    },
    "index.test.js": {
      code: `
test('myFunction should log a message', () => {
  const consoleLogSpy = jest.spyOn(console, 'log');
  expect(consoleLogSpy).toHaveBeenCalledWith("Hello, World!");
  consoleLogSpy.mockRestore(); // Clean up the spy after the test
});`,
  }
}

export default async function ProblemsPage({ params }: PageProps) {
  const { problemTitle } = params ?? {};
  console.log('problemTitle', problemTitle) // TODO 

  return (<Workspace />)
}