/**
 * Workspace
 *
 */
"use client"
import 'react-toastify/dist/ReactToastify.css';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { EditorView  } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { GrPowerReset } from "react-icons/gr";
import { javascript } from '@codemirror/lang-javascript';
// @ts-ignore: has no exported member
import { jest, describe, it, expect, run } from 'jest-lite';
import { RxTrackNext } from "react-icons/rx";
import { toast, ToastContainer } from 'react-toastify';

import { Console, Select } from "@components";

import { fontSizes, themeDictionary, toastOptions } from "./constants";
import {
  handleSubmitCode,
  handleUpdateUserCode,
} from "./helpers";
import { WorkspaceProps } from './definitions';

export default function Workspace({
  isLoggedIn,
  nextProblemSlug,
  problem: {
    description,
    id: problemId,
    slug,
    starterCode,
    testCode,
    title,
  },
  user,
  userProblem,
}: WorkspaceProps) {
  const [codeValue, setCodeValue] = useState<string>(userProblem && userProblem.userCode ? userProblem.userCode : starterCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState<string>('14px');
  const [selectedTheme, setSelectedTheme] = useState<string>('vscodeDark');

  const fontSizeOptions = fontSizes.map((fontSize) => ({ label: fontSize, value: fontSize }));
  const themeOptions = Object.entries(themeDictionary).map(([key, { label }]) => ({ label, value: key }));

  const { theme } = themeDictionary[selectedTheme]

  const handleReset = () => {
    setCodeValue(starterCode);
    setLogs([])
  }

  const handleSubmit = useCallback(async () => {
    // Set last viewed problem in local storage
    localStorage.setItem('last_viewed_problem_slug', slug);

    let response = await handleSubmitCode(codeValue);
    setLogs([ ...response.run.output.split('\n')]);

    // Run test runner
    new Function('expect', 'jest', 'describe', 'it', testCode.split('${codeValue}').join(codeValue))(
      expect,
      jest,
      describe,
      it,
    );
    const testResultsArray = await run();
    console.log(testResultsArray);
    const { status } = testResultsArray.at(-1);

    if (status === 'fail') {
      toast.error('Incorrect, try again!', toastOptions);
    }
    console.log('nextProblemSlug: ', nextProblemSlug);
    if (status === 'pass') {
      toast.success(
        <p>
          All test cases passed!
          <Link className='btn btn-xs btn-ghost' href={`/problems/${nextProblemSlug}`}>
            <RxTrackNext size={16} />
            Next Problem
          </Link>
        </p>,
        toastOptions
      );
    }

    if (user) {
      await handleUpdateUserCode({
        email: user.email,
        isSolved: status === 'pass',
        problemId,
        userCode: codeValue,
      });
    }

  }, [codeValue]);

  return (
    <div className="flex flex-wrap w-full font-bold bg-base-300">
      {/* Problem section */}
      <div className="min-w-[325px] p-4 max-w-[30%] mb-4">
        <h3 className="text-3xl mb-10">{title}</h3>
        <p className='text-sm md:text-lg whitespace-pre-line overflow-y-auto'>
          {description.split('\\n').join('\n\n')}
        </p>
      </div>
      {/* Code Section */}
      <div className="grow max-h-[100dvh-64px]">
        <div className="w-full flex align-center">
          <Select
            className="rounded-none select-sm select-accent text-accent"
            onChange={(e) => setSelectedTheme(e.target.value)}
            options={themeOptions}
            style={{ fontSize }}
            value={selectedTheme}
          />
          <Select
            className="rounded-none select-sm select-accent text-accent"
            onChange={(e) => setFontSize(e.target.value)}
            options={fontSizeOptions}
            style={{ fontSize }}
            value={fontSize}
          />
        </div>
        <div
          className='[&_.cm-theme]:h-[calc(50vh-64px)]'
          style={{fontSize}}
        >
          <CodeMirror
            key={`${fontSize}`}
            value={codeValue}
            theme={theme}
            extensions={[
              javascript(),
              EditorView.lineWrapping,
            ]}
            basicSetup={{
              autocompletion: true,
              foldGutter: true,
            }}
            height="100%"
            width="100%"
            onChange={(editor) => setCodeValue(editor)}
          />
        </div>
        <div className='max-h-[50%] flex align-center'>
          <button
            className="btn btn-primary btn-sm rounded-none"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn btn-secondary btn-sm rounded-none"
            onClick={() => setLogs([])}
          >
            Clear Console
          </button>
          <button
            className="btn btn-warning btn-sm rounded-none"
            onClick={handleReset}
          >
            <GrPowerReset size={16} />
          </button>
        </div>
        <Console fontSize={fontSize} isLoggedIn={isLoggedIn} logs={logs} />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}