/**
 * Sidebar server component
 */

import { User } from '@/app/definitions';

import { getProblems } from '@/app/api/problems/handlers';

import ClientSidebar from './ClientSidebar';
import { Problem } from '../Workspace/definitions';
interface SidebarProps {
  user?: User | null;
}

export default async function Sidebar({ user }: SidebarProps) {
  const problems = await getProblems() as Problem[];

  console.log('probleems: ', problems);
  return <ClientSidebar problems={problems} user={user} />;
}