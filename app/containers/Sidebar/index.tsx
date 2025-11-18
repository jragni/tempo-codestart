/**
 * Sidebar server component
 */

import { User, UserProblem } from '@/app/definitions';
import { sql } from '@vercel/postgres';

import { getProblems } from '@/app/api/problems/handlers';
import { camelCaseData } from '@/utils/globalHelpers';

import ClientSidebar from './ClientSidebar';
import { Problem } from '../Workspace/definitions';
interface SidebarProps {
  user?: User | null;
}

export default async function Sidebar({ user }: SidebarProps) {
  const problems = await getProblems() as Problem[];

  let userProblems: UserProblem[] = [];

  if (user) {
    try {
      const result = await sql`
        SELECT * FROM user_problem
        WHERE user_email = ${user.email}
      `;
      userProblems = result.rows.map((row) => camelCaseData(row)) as UserProblem[];
    } catch (error) {
      console.error('Failed to fetch user problems:', error);
    }
  }

  return <ClientSidebar problems={problems} user={user} userProblems={userProblems} />;
}