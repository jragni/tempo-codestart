/**
 * workspace definitions
 */
import { Extension } from '@uiw/react-codemirror';

export interface Problem {
  description: string;
  id?: number | string;
  slug: string;
  starterCode: string;
  testCode: string;
  title: string;
  topic?: string;
}

export interface WorkspaceProps {
  isLoggedIn: boolean;
  problem: Problem;
}

export interface Theme {
  label: string;
  theme: Extension;
}