/**
 * Workspace
 *
 */
"use client"

import { useState, useEffect, useCallback } from 'react';
import { EditorView  } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { GrPowerReset } from "react-icons/gr";
import { javascript } from '@codemirror/lang-javascript';

import { Console, Select } from "@components";

import { fontSizes, themeDictionary } from "./constants";
import { handleSubmitCode } from "./helpers";
import { WorkspaceProps } from './definitions';

export default function Workspace({
  isLoggedIn,
  problem: {
    description,
    starterCode,
    title,
  }
}: WorkspaceProps) {
  const [codeValue, setCodeValue] = useState<string>(starterCode);
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
    let response = await handleSubmitCode(codeValue);
    // TODO on submit, we want to save code to db
    // TODO add solution
    setLogs([ ...response.run.output.split('\n')]);

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
    </div>
  );
}