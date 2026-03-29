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

export interface TestResult {
  status: 'pass' | 'fail';
  testName?: string;
  error?: string;
}

export interface TestResultsSummary {
  status: 'pass' | 'fail';
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

// Track the number of test results we've already processed
let previousResultCount = 0;

export const handleRunTests = async (testCode: string, codeValue: string): Promise<TestResultsSummary> => {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Tests can only run in browser environment');
    }

    // Dynamic import of jest-lite (browser-only)
    // @ts-ignore: has no exported member
    const { jest, describe, it, expect, run } = await import('jest-lite');

    // Create unique timestamp for this test run
    const timestamp = Date.now();

    // Make test names unique by appending timestamp
    // Pattern: describe('Name', ...) -> describe('Name_timestamp', ...)
    const uniqueTestCode = testCode
      .replace(/describe\s*\(\s*(['"`])(.+?)\1\s*,/g, (match, quote, name) => {
        return 'describe(' + quote + name + '_' + timestamp + quote + ',';
      })
      .replace(/it\s*\(\s*(['"`])(.+?)\1\s*,/g, (match, quote, name) => {
        return 'it(' + quote + name + '_' + timestamp + quote + ',';
      });

    // Execute test code with unique names
    new Function('expect', 'jest', 'describe', 'it', uniqueTestCode.split('${codeValue}').join(codeValue))(
      expect,
      jest,
      describe,
      it,
    );

    // Run all tests and get ALL results (includes previous runs)
    const allResults = await run();

    // Get only the NEW results from this run (after previousResultCount)
    const currentRunResults = allResults.slice(previousResultCount);

    // Update the counter for next run
    previousResultCount = allResults.length;

    // Process test results and clean up display names
    const results: TestResult[] = currentRunResults.map((result: any) => {
      // Get the last part of test path (the actual test name)
      const testName = result.testPath?.[result.testPath.length - 1] || 'Test case';
      // Remove timestamp suffix for clean display
      const cleanName = String(testName).replace(/_\d+$/, '');

      return {
        status: result.status,
        testName: cleanName,
        // Only include error if test actually failed
        error: result.status === 'fail' ? (result.errors?.[0] || 'Test assertion failed') : undefined
      };
    });

    const passedTests = results.filter(r => r.status === 'pass').length;
    const failedTests = results.filter(r => r.status === 'fail').length;
    const overallStatus = failedTests === 0 ? 'pass' : 'fail';

    return {
      status: overallStatus,
      results,
      totalTests: results.length,
      passedTests,
      failedTests
    };
  } catch (error) {
    return {
      status: 'fail',
      results: [{
        status: 'fail',
        testName: 'Test execution',
        error: error instanceof Error ? error.message : 'Unknown test execution error'
      }],
      totalTests: 1,
      passedTests: 0,
      failedTests: 1
    };
  }
}

