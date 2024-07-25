/**
 * Problems Page
 *
 */
import { Workspace } from "@containers"
import { auth } from '@/auth';
import { getProblemBySlug } from "@/app/api/problems/handlers";
import { redirect } from "next/navigation";
import { Problem } from "@/app/containers/Workspace/definitions";
import { getUser } from "@/app/api/users/handlers";
import { createUserProblem, getUserProblem } from "@/app/api/userproblems/handlers";
import { User } from "@/app/definitions";

interface PageProps {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProblemsPage({ params }: PageProps) {
  const { slug } = params ?? { slug: ''};

  const session = await auth() as { user: { email: string } };

  const problem = await getProblemBySlug(slug) as Problem;

  const user = await getUser(session.user.email) as User;
  const userProblem = await getUserProblem(user.email, problem.title)
  if (session && session.user) {

    if(!userProblem) {
      await createUserProblem({
        email: user.email,
        problemTitle: problem.title,
        userCode: '',
        userFavorite: false,
        isSolved: false
      })
    } else {
    // If user has attempted this problem before, use their code
      problem.starterCode = userProblem?.starterCode || problem.starterCode;
    }

  }

  if(!problem) redirect('/not-found');

  return (
  <>
    <Workspace isLoggedIn={!!session} problem={problem} user={user} />
  </>
  )
}