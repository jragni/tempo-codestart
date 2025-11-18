/**
 * TestResults Component
 *
 * @description
 * Displays individual test case results with pass/fail indicators
 */
"use client";

import { useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { TestResultsSummary } from '@/app/containers/Workspace/helpers';

interface TestResultsProps {
  testResults: TestResultsSummary | null;
  fontSize?: string;
}

export default function TestResults({ testResults, fontSize = '14px' }: TestResultsProps) {
  const summary = useMemo(() => {
    if (!testResults) return null;

    const percentPassed = testResults.totalTests > 0
      ? Math.round((testResults.passedTests / testResults.totalTests) * 100)
      : 0;

    return {
      ...testResults,
      percentPassed
    };
  }, [testResults]);

  if (!summary) {
    return (
      <div
        className="p-6 text-center text-base-content/60"
        style={{ fontSize }}
      >
        <p>Run your code to see test results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4" style={{ fontSize }}>
      {/* Summary Header */}
      <div className={`card shadow-lg ${
        summary.status === 'pass'
          ? 'bg-gradient-to-br from-success/10 to-success/5 border border-success/30'
          : 'bg-gradient-to-br from-error/10 to-error/5 border border-error/30'
      }`}>
        <div className="card-body p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {summary.status === 'pass' ? (
                <FaCheckCircle className="text-success text-2xl" />
              ) : (
                <FaTimesCircle className="text-error text-2xl" />
              )}
              <div>
                <h3 className="font-bold text-lg">
                  {summary.status === 'pass' ? 'All Tests Passed!' : 'Some Tests Failed'}
                </h3>
                <p className="text-sm text-base-content/70">
                  {summary.passedTests} / {summary.totalTests} tests passing
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                summary.status === 'pass' ? 'text-success' : 'text-error'
              }`}>
                {summary.percentPassed}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-base-300/50 rounded-full h-2 shadow-inner">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                summary.status === 'pass'
                  ? 'bg-gradient-to-r from-success to-success'
                  : 'bg-gradient-to-r from-warning to-error'
              }`}
              style={{ width: `${summary.percentPassed}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Individual Test Results */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-base-content/80 mb-2">
          Test Cases ({summary.totalTests})
        </h4>
        {summary.results.map((result, index) => (
          <div
            key={`test-${index}`}
            className={`card border-l-4 transition-all duration-200 hover:shadow-md ${
              result.status === 'pass'
                ? 'border-l-success bg-success/5 hover:bg-success/10'
                : 'border-l-error bg-error/5 hover:bg-error/10'
            }`}
          >
            <div className="card-body p-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {result.status === 'pass' ? (
                    <FaCheckCircle className="text-success text-lg" />
                  ) : (
                    <FaTimesCircle className="text-error text-lg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs badge badge-ghost">
                      Test #{index + 1}
                    </span>
                    <span className={`font-medium ${
                      result.status === 'pass' ? 'text-success' : 'text-error'
                    }`}>
                      {result.testName}
                    </span>
                  </div>
                  {result.error && (
                    <div className="mt-2 p-2 rounded bg-base-300/50 border border-error/20">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="text-warning text-sm flex-shrink-0 mt-0.5" />
                        <pre className="text-xs text-error font-mono overflow-x-auto whitespace-pre-wrap break-words">
                          {result.error}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className={`badge badge-sm ${
                    result.status === 'pass' ? 'badge-success' : 'badge-error'
                  }`}>
                    {result.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
