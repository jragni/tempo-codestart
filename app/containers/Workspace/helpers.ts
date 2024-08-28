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

  const respData = await response.json();

  return respData;
};

export const handleRunTests = async (testCode: string, codeValue: string) => {
  try {
    new Function('expect', 'jest', 'describe', 'it', testCode.split('${codeValue}').join(codeValue))(
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

