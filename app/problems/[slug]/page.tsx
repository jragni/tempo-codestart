/**
 * Problems Page
 *
 */
import { Workspace } from "@containers"
import { auth } from '@/auth';
import { getProblemBySlug } from "@/app/api/problems/handlers";
import { redirect } from "next/navigation";
import { Problem } from "@/app/containers/Workspace/definitions";

interface PageProps {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProblemsPage({ params }: PageProps) {
  const { slug } = params ?? { slug: ''};

  const session = await auth();

  const problem = await getProblemBySlug(slug) as Problem;

  if(!problem) redirect('/not-found');

  return (
  <>
    <Workspace isLoggedIn={!!session} problem={problem} />
  </>
  )
}