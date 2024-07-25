/**
 * Console
 *
 * @description
 * Displays code run by Codemirror.
 */
"use client"

import { useEffect, useRef } from 'react';
import Log from './Log';
interface ConsoleProps {
  fontSize?: string;
  isLoggedIn: boolean;
  logs: string[];
}

export default function Console({
  fontSize,
  isLoggedIn,
  logs=[],
}: ConsoleProps) {
  const logRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if(logRef && logRef.current) {
      logRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs]);

  const preSubmitText = isLoggedIn
    ? 'Press `Submit` to run code...'
    : 'Press `Submit` to run code. Log in to save your progress...';

  return (
    <div
      className="
        bg-primary-content
        flex
        flex-col
        border-none
        h-[50dvh]
        overflow-auto
        resize-none
        rounded-none
        text-primary
        textarea
        w-full
      "
    >
      {logs.length === 0
        ? <p style={{ fontSize }}>{preSubmitText}</p>
        : logs.map((log, idx) => {
          const ref = idx === logs.length - 1 ? logRef : null;
          const key = `log-${log}-${idx}`;
          return (
            <Log
              ref={ref}
              key={key}
              fontSize={fontSize}
              log={log}
            />
          );
        })
      }
    </div>
  );
}