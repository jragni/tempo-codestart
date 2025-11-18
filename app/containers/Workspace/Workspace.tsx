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

import { Console, Select, TestResults } from "@components";

import { fontSizes, themeDictionary, toastOptions } from "./constants";
import {
  handleRunTests,
  handleSubmitCode,
  handleUpdateUserCode,
  TestResultsSummary,
} from "./helpers";
import { WorkspaceProps } from "./definitions";

export default function Workspace({
  isLoggedIn,
  nextProblemSlug,
  prevProblemSlug,
  problem: { description, difficulty, id: problemId, slug, starterCode, testCode, title, topic },
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResultsSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');

  const fontSizeOptions = fontSizes.map((fontSize) => ({
    label: fontSize,
    value: fontSize,
  }));
  const themeOptions = Object.entries(themeDictionary).map(
    ([key, { label }]) => ({ label, value: key })
  );

  const { theme } = themeDictionary[selectedTheme];

  // Get difficulty badge color
  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'Easy':
        return 'badge-success';
      case 'Medium':
        return 'badge-warning';
      case 'Hard':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

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

      // Check if response contains error
      if (response.run && response.run.output) {
        setLogs([...response.run.output.split("\n")]);

        // Check if output contains error messages
        if (response.run.output.includes('Error executing code')) {
          toast.error("Failed to execute code. Please check your syntax and try again.", toastOptions);
          return;
        }
      } else {
        setLogs(["Unexpected response format. Please try again."]);
        toast.error("Something went wrong. Please try again.", toastOptions);
        return;
      }

      // Run test runner
      const results = await handleRunTests(testCode, codeValue);
      setTestResults(results);
      setActiveTab('tests'); // Switch to tests tab to show results

      if (results.status === "fail") {
        toast.error(
          `${results.failedTests} of ${results.totalTests} tests failed. Check the test results!`,
          toastOptions
        );
      }
      if (results.status === "pass") {
        toast.success(
          <p>
            All {results.totalTests} test cases passed!
            {nextProblemSlug && (
              <Link
                className="btn btn-xs btn-ghost"
                href={`/problems/${nextProblemSlug}`}
              >
                <RxTrackNext size={16} />
                Next Problem
              </Link>
            )}
          </p>,
          toastOptions
        );
      }

      if (user) {
        try {
          await handleUpdateUserCode({
            email: user.email,
            isSolved: results.status === "pass",
            problemId,
            userCode: codeValue,
          });
        } catch (error) {
          console.error('Failed to save progress:', error);
          toast.warning("Code ran successfully but couldn't save progress.", toastOptions);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("An unexpected error occurred. Please try again.", toastOptions);
      setLogs([`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`]);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Auto-save functionality
  const autoSaveCode = useCallback(async (code: string) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await handleUpdateUserCode({
        email: user.email,
        isSolved: userProblem?.isSolved || false,
        problemId,
        userCode: code,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [user, problemId, userProblem?.isSolved]);

  // Debounced auto-save (saves 2 seconds after user stops typing)
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      if (codeValue !== (userProblem?.userCode || starterCode)) {
        autoSaveCode(codeValue);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [codeValue, user, autoSaveCode, userProblem?.userCode, starterCode]);

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
      // Ctrl/Cmd + S to manually save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (user) {
          autoSaveCode(codeValue);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [codeValue, slug, user, autoSaveCode]); // Dependencies needed for handlers

  return (
    <div className="flex flex-wrap w-full font-bold bg-base-300 animate-fade-in">
      {/* Problem section */}
      <div className="w-full sm:w-full md:w-[45%] lg:w-[35%] xl:max-w-[30%] p-4 md:p-6">
        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li>
              <Link href="/" className="text-primary hover:text-primary-focus">
                Home
              </Link>
            </li>
            {topic && (
              <li className="text-base-content">
                {topic}
              </li>
            )}
            <li className="text-base-content font-semibold">{title}</li>
          </ul>
        </div>
        <div className="flex items-start justify-between mb-6 md:mb-10 gap-3">
          <div className="flex-1">
            <h3 className="text-white text-2xl md:text-3xl mb-2">{title}</h3>
            <div className="flex gap-2 flex-wrap">
              {difficulty && (
                <span className={`badge ${getDifficultyColor(difficulty)} badge-sm md:badge-md`}>
                  {difficulty}
                </span>
              )}
              {userProblem?.isSolved && (
                <span className="badge badge-success badge-sm md:badge-md gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Solved
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
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
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold">Keyboard Shortcuts:</p>
            {user && (
              <span className="text-xs flex items-center gap-1">
                {isSaving && (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    <span>Saving...</span>
                  </>
                )}
                {!isSaving && lastSaved && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-3 h-3 stroke-success">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-success">Saved</span>
                  </>
                )}
              </span>
            )}
          </div>
          <p>• <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">Enter</kbd> - Submit code</p>
          <p>• <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">R</kbd> - Reset code</p>
          {user && (
            <p>• <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">S</kbd> - Save draft</p>
          )}
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
        {/* Tabbed Output Section */}
        <div className="bg-base-200">
          {/* Tab Headers */}
          <div className="tabs tabs-boxed bg-base-300 rounded-none">
            <button
              className={`tab tab-sm md:tab-md ${activeTab === 'console' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('console')}
              aria-label="Show console output"
            >
              Console
              {logs.length > 0 && (
                <span className="badge badge-sm badge-primary ml-2">{logs.length}</span>
              )}
            </button>
            <button
              className={`tab tab-sm md:tab-md ${activeTab === 'tests' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('tests')}
              aria-label="Show test results"
            >
              Test Results
              {testResults && (
                <span className={`badge badge-sm ml-2 ${
                  testResults.status === 'pass' ? 'badge-success' : 'badge-error'
                }`}>
                  {testResults.passedTests}/{testResults.totalTests}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[35vh] md:min-h-[40vh] lg:min-h-[45vh] max-h-[50vh] overflow-auto">
            {activeTab === 'console' ? (
              <Console fontSize={fontSize} isLoggedIn={isLoggedIn} logs={logs} />
            ) : (
              <TestResults testResults={testResults} fontSize={fontSize} />
            )}
          </div>
        </div>
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
