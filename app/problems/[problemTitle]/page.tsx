/**
 * Problems Page
 *
 * // TODO redirect if problem not found
 */
import { Sidebar, Workspace } from "@containers"
import { auth } from '@/auth';
import { getProblemByTitle } from "@/app/api/problems/handlers";
import { convertSlugToProblemTitle } from "../helpers";
import { redirect } from "next/navigation";
import { Problem } from "@/app/containers/Workspace/definitions";

interface PageProps {
  params?: { problemTitle: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProblemsPage({ params }: PageProps) {
  const { problemTitle } = params ?? { problemTitle: ''};

  const session = await auth();
  // TODO create a fetch for userProblems
  // TODO create a fetchh for Sidebar problems
  // TODO create favorites button for sidebar

  const title = convertSlugToProblemTitle(problemTitle)
  const problem = await getProblemByTitle(title) as Problem;
  console.log(problem)

  if(!problem) redirect('/not-found');

  return (
  <>
    <Sidebar />
    <Workspace problem={problem} />
  </>
  )
}