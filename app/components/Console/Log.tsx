/**
 * Log
 *
 * @description
 * Displays the console messages
 */
import React from 'react';

interface LogProps {
  fontSize?: string;
  log?: string;
}

const Log = React.forwardRef<HTMLParagraphElement, LogProps>(({ fontSize, log = ''}, ref) => {
  return (
    <p
      ref={ref}
      className={`
        ${log.includes('Error:') ? 'text-error' : ''}
      `}
      style={{ fontSize }}
    >
      {log}
    </p>
  );
});

export default Log;