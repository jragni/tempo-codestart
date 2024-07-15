/**
 * Workspace
 *
 * Note: in order for sandpack to rebuild on change, we need SandpackPreview
 * to be rendered in the DOM. This is why it is rendered in a hidden div.
 */
"use client"

import { useState } from 'react';

import { Sandpack } from "@codesandbox/sandpack-react";

import { Select } from "@components";

import { fontSizes, themeDictionary } from "./constants";

export default function Workspace() {
  // const [codeValue, setCodeValue] = useState<string>('');
  const [fontSize, setFontSize] = useState<string>('14px');

  const [selectedTheme, setSelectedTheme] = useState<string>('dracula');
  const theme = themeDictionary[selectedTheme].value;
  const themeOptions = Object.entries(themeDictionary).map(([themeKey, { label }]) => ({ label, value: themeKey }));
  const fontSizeOptions = fontSizes.map((fontSize) => ({ label: fontSize, value: fontSize }));

  return (
    <div>
      <div className="pt-1">
        <Select
          className="select-sm"
          onChange={(e) => setSelectedTheme(e.target.value)}
          options={themeOptions}
          value={selectedTheme}
        />
        <Select
          className="select-sm"
          onChange={(e) => setFontSize(e.target.value)}
          options={fontSizeOptions}
          value={fontSize}
        />
      </div>
      <Sandpack
        template="vanilla"
        theme={{
          ...theme,
          font: {
            ...theme.font,
            size: fontSize
          },
        }}
        options={{
          autoReload: false,
          autorun: false,
          layout: 'tests',
          showInlineErrors: true,
          showLineNumbers: true,
          showConsole: true,
        }}
      />
    </div>
  );
}