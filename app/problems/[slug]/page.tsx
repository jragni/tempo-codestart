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
import { User, UserProblem } from "@/app/definitions";

interface PageProps {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProblemsPage({ params }: PageProps) {
  const { slug } = params ?? { slug: ''};
  let user;
  let userProblem;

  const session = await auth() as { user: { email: string } };

  const problem = await getProblemBySlug(slug) as Problem;
  if(!problem) redirect('/not-found');

  if (session && session.user) {
    user = await getUser(session.user.email) as User;
    userProblem = await getUserProblem(user.email, problem.id) as UserProblem
    if(!userProblem) {
      await createUserProblem({
        email: user.email,
        problemId: problem.id,
        userCode: '',
        userFavorite: false,
        isSolved: false
      })
    }

  }


  return (
  <>
    <Workspace isLoggedIn={!!session} problem={problem} user={user} userProblem={userProblem} />
  </>
  )
}