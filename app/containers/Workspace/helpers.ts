// @ts-ignore: has no exported member
import { jest, describe, it, expect, run } from 'jest-lite';
import { updateUserProblemCode } from "@/app/api/userproblems/handlers";
import { UpdateUserCode } from "./definitions";

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
  try {
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
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const respData = await response.json();
    return respData;
  } catch (error) {
    console.error('Code execution error:', error);
    return {
      run: {
        output: `Error executing code: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      }
    };
  }
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

export const handleRunTests = async (testCode: string, codeValue: string): Promise<TestResultsSummary> => {
  try {
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

    // Filter to only get results from THIS run (matching our timestamp)
    const currentRunResults = allResults.filter((result: any) => {
      // Check if any part of the test path includes our timestamp
      return result.testPath && result.testPath.some((name: string) =>
        String(name).includes(`_${timestamp}`)
      );
    });

    // Process test results and clean up display names
    const results: TestResult[] = currentRunResults.map((result: any) => {
      // Get the last part of test path (the actual test name)
      const testName = result.testPath?.[result.testPath.length - 1] || 'Test case';
      // Remove timestamp suffix for clean display
      const cleanName = String(testName).replace(/_\d+$/, '');

      return {
        status: result.status,
        testName: cleanName,
        error: result.errors?.[0] || (result.status === 'fail' ? 'Test assertion failed' : undefined)
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

