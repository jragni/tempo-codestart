/**
 * Workspace
 *
 * TODO - fix wrapping of code editor with long strings
 * TODO - fix testing console log issue
 */
"use client";
import "react-toastify/dist/ReactToastify.css";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { EditorView } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";
import { GrPowerReset } from "react-icons/gr";
import { javascript } from "@codemirror/lang-javascript";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";

import { Console, Select } from "@components";

import { fontSizes, themeDictionary, toastOptions } from "./constants";
import {
  handleRunTests,
  handleSubmitCode,
  handleUpdateUserCode,
} from "./helpers";
import { WorkspaceProps } from "./definitions";

export default function Workspace({
  isLoggedIn,
  nextProblemSlug,
  prevProblemSlug,
  problem: { description, id: problemId, slug, starterCode, testCode, title },
  user,
  userProblem,
}: WorkspaceProps) {
  const [codeValue, setCodeValue] = useState<string>(
    userProblem && userProblem.userCode ? userProblem.userCode : starterCode
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState<string>("14px");
  const [selectedTheme, setSelectedTheme] = useState<string>("vscodeDark");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fontSizeOptions = fontSizes.map((fontSize) => ({
    label: fontSize,
    value: fontSize,
  }));
  const themeOptions = Object.entries(themeDictionary).map(
    ([key, { label }]) => ({ label, value: key })
  );

  const { theme } = themeDictionary[selectedTheme];

  const handleReset = () => {
    setCodeValue(starterCode);
    setLogs([]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Set last viewed problem in local storage
      localStorage.setItem("last_viewed_problem_slug", slug);

      let response = await handleSubmitCode(codeValue);
      setLogs([...response.run.output.split("\n")]);

      // Run test runner
      const status = await handleRunTests(testCode, codeValue);

      if (status === "fail") {
        toast.error("Incorrect, try again!", toastOptions);
      }
      if (status === "pass") {
        toast.success(
          <p>
            All test cases passed!
            <Link
              className="btn btn-xs btn-ghost"
              href={`/problems/${nextProblemSlug}`}
            >
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
          isSolved: status === "pass",
          problemId,
          userCode: codeValue,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      // Ctrl/Cmd + R to reset (prevent browser refresh)
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [codeValue, slug]); // Dependencies needed for handlers

  return (
    <div className="flex flex-wrap w-full font-bold bg-base-300 animate-fade-in">
      {/* Problem section */}
      <div className="w-full sm:w-full md:w-[45%] lg:w-[35%] xl:max-w-[30%] p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <h3 className="text-white text-2xl md:text-3xl flex-1">{title}</h3>
          <div className="flex gap-2">
            {prevProblemSlug && (
              <Link
                href={`/problems/${prevProblemSlug}`}
                className="btn btn-ghost btn-sm btn-circle hover:scale-110"
                aria-label="Previous problem"
              >
                <RxTrackPrevious size={20} />
              </Link>
            )}
            {nextProblemSlug && (
              <Link
                href={`/problems/${nextProblemSlug}`}
                className="btn btn-ghost btn-sm btn-circle hover:scale-110"
                aria-label="Next problem"
              >
                <RxTrackNext size={20} />
              </Link>
            )}
          </div>
        </div>
        <p className="text-white text-sm md:text-base lg:text-lg whitespace-pre-line overflow-y-auto max-h-[40vh] md:max-h-[calc(100vh-200px)] pr-2">
          {description.split("\\n").join("\n\n")}
        </p>
        <div className="mt-6 p-3 bg-base-200 rounded-lg text-xs md:text-sm text-base-content">
          <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
          <p>• <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">Enter</kbd> - Submit code</p>
          <p>• <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">R</kbd> - Reset code</p>
        </div>
      </div>
      {/* Code Section */}
      <div className="w-full md:flex-1 md:grow">
        <div className="w-full flex align-center flex-wrap gap-2 p-2 md:flex-nowrap md:gap-0">
          <Select
            className="rounded-none select-sm select-accent text-accent flex-1 md:flex-initial"
            onChange={(e) => setSelectedTheme(e.target.value)}
            options={themeOptions}
            style={{ fontSize }}
            value={selectedTheme}
          />
          <Select
            className="rounded-none select-sm select-accent text-accent flex-1 md:flex-initial"
            onChange={(e) => setFontSize(e.target.value)}
            options={fontSizeOptions}
            style={{ fontSize }}
            value={fontSize}
          />
        </div>
        <div className="[&_.cm-theme]:h-[40vh] md:[&_.cm-theme]:h-[45vh] lg:[&_.cm-theme]:h-[50vh] overflow-auto" style={{ fontSize }}>
          <CodeMirror
            key={`${fontSize}`}
            value={codeValue}
            theme={theme}
            extensions={[javascript(), EditorView.lineWrapping]}
            basicSetup={{
              autocompletion: true,
              foldGutter: true,
            }}
            height="100%"
            width="100%"
            onChange={(editor) => setCodeValue(editor)}
          />
        </div>
        <div className="flex align-center flex-wrap md:flex-nowrap gap-1">
          <button
            className="btn btn-primary btn-sm rounded-none flex-1 md:flex-initial hover:scale-105 active:scale-95"
            onClick={handleSubmit}
            disabled={isSubmitting}
            aria-label="Submit code for testing"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Running...
              </>
            ) : (
              "Submit"
            )}
          </button>
          <button
            className="btn btn-secondary btn-sm rounded-none flex-1 md:flex-initial hover:scale-105 active:scale-95"
            onClick={() => setLogs([])}
            aria-label="Clear console output"
          >
            Clear Console
          </button>
          <button
            className="btn btn-warning btn-sm rounded-none hover:scale-105 active:scale-95"
            onClick={handleReset}
            aria-label="Reset code to starter"
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
