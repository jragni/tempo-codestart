/**
 * Workspace
 *
 */
"use client"

import { useState, useEffect, useCallback } from 'react';
import { EditorView  } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { Console, Select } from "@components";

import { fontSizes, themeDictionary } from "./constants";
import { handleSubmitCode } from "./helpers";
import { WorkspaceProps } from './definitions';

export default function Workspace({
  problem: {
    description,
    starterCode='',
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

  const handleSubmit = useCallback(async () => {
    let response = await handleSubmitCode(codeValue);
    // TODO on submit, we want to save code to db
    console.log(response)
    setLogs([ ...response.run.output.split('\n')]);
  }, [codeValue]);

  return (
    <div className="flex flex-wrap w-full font-bold bg-base-300">
      {/* Problem section */}
      <div className="min-w-[325px] p-4 max-w-[50%]">
        {/* TODO swap for actual */}
        <h3 className="text-3xl mb-10">{title}</h3>
        <p className='whitespace-pre-wrap'>{description}</p>
      </div>
      {/* Code Section */}
      <div className="grow max-h-[100dvh-64px]">
        <div className="w-full">
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
        <div className='max-h-[50%]'>
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
            Clear
          </button>
        </div>
        <Console fontSize={fontSize} logs={logs} />
      </div>
    </div>
  );
}