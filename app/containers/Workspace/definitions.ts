/**
 * workspace definitions
 */
import { Extension } from '@uiw/react-codemirror';
import { User, UserProblem } from '@/app/definitions';

export interface Problem {
  description: string;
  id: string;
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
  isSolved: boolean;
  problemId: string;
  userCode: string;
}

export interface WorkspaceProps {
  isLoggedIn: boolean;
  nextProblemSlug: string;
  problem: Problem;
  user?: User;
  userProblem?: UserProblem;
}
