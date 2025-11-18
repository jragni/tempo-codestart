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
    new Function('expect', 'jest', 'describe', 'it', testCode.split('${codeValue}').join(codeValue))(
      expect,
      jest,
      describe,
      it,
    );
    const testResultsArray = await run();

    // Process all test results
    const results: TestResult[] = testResultsArray.map((result: any) => ({
      status: result.status,
      testName: result.name || 'Test case',
      error: result.errors?.[0]?.message || (result.status === 'fail' ? 'Test assertion failed' : undefined)
    }));

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

