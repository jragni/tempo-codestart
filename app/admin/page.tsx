/**
 * admin page
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminPage as Admin }from '@containers';

import { getUser } from "../api/users/handlers";
import { getProblems } from "../api/problems/handlers";
import { Problem } from "../containers/Workspace/definitions";

export default async function AdminPage() {
  const session = await auth();
  let email = session?.user?.email || "";

  if (!session || !session.user || !email) redirect("/not-found");

  const user = await getUser(email);
  const problems = await getProblems() as Problem[] || [];

  if (!user?.isAdmin) {
    // redirect to
    redirect("/not-found");
  }

  return (
    <Admin problems={problems} />
  );
}
