/**
 * workspace definitions
 */
import { Extension } from '@uiw/react-codemirror';

export interface Problem {
  description: string;
  starterCode: string;
  testCode: string;
  title: string;
}

export interface WorkspaceProps {
  problem: Problem;
}

export interface Theme {
  label: string;
  theme: Extension;
}