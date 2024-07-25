
export interface User {
  email: string;
  name: string;
  image?: string;
  isAdmin?: boolean;
}
export interface UserProblem {
  email: string;
  problemId: string;
  problemTitle?: string;
  userCode?: string;
  userFavorite?: boolean;
  isSolved?: boolean;
}