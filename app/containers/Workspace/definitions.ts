/**
 * workspace definitions
 */
import { Extension } from '@uiw/react-codemirror';
import { User, UserProblem } from '@/app/definitions';

export interface Problem {
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  id: string;
  slug: string;
  solution?: string;
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
  nextProblemSlug: string | null;
  prevProblemSlug?: string | null;
  problem: Problem;
  user?: User;
  userProblem?: UserProblem;
}
