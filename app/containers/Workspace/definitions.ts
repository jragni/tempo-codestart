/**
 * workspace definitions
 */
import { Extension } from '@uiw/react-codemirror';
import { User } from '@/app/definitions';

export interface Problem {
  description: string;
  id?: number | string;
  slug: string;
  starterCode: string;
  testCode: string;
  title: string;
  topic?: string;
}

export interface Theme {
  label: string;
  theme: Extension;
}

export interface UpdateUserCode {
  email: string;
  problemTitle: string;
  userCode: string;
}

export interface WorkspaceProps {
  isLoggedIn: boolean;
  problem: Problem;
  user: User;
}
