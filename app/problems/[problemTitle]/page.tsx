/**
 * Problems Page
 */
import { Sidebar, Workspace } from "@containers"

interface PageProps {
  params?: { problemTitle: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}
const problem = {
  description: 'Welcome to Tempo! for your first problem console log "Hello, World!"\n\n In order to run the code, press the submit button. This will also save your progress',
  starterCode: `console.log("Hello, World!");`,
  testCode: `
test('myFunction should log a message', () => {
  const consoleLogSpy = jest.spyOn(console, 'log');
  expect(consoleLogSpy).toHaveBeenCalledWith("Hello, World!");
  consoleLogSpy.mockRestore(); // Clean up the spy after the test
});`,
  title: 'Your First Problem'
};

export default async function ProblemsPage({ params }: PageProps) {
  const { problemTitle } = params ?? {};

  return (
  <>
    <Sidebar />
    <Workspace problem={problem} />
  </>
  )
}