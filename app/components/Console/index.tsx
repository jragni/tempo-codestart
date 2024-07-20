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
  logs: string[];
}

export default function Console({
  fontSize,
  logs=[],
}: ConsoleProps) {
  const logRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if(logRef && logRef.current) {
      logRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs]);

  return (
    <div
      className="
        bg-primary-content
        flex
        flex-col
        border-none
        h-full
        overflow-auto
        resize-none
        rounded-none
        text-primary
        textarea
        w-full
      "
    >
      {logs.length === 0
        ? <p style={{ fontSize }}>Press `Submit` to run code...</p>
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