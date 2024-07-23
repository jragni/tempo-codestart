/**
 * admin page
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminPage as Admin }from '@containers';

import { getUser } from "../api/users/handlers";

export default async function AdminPage() {
  const session = await auth();
  let email = session?.user?.email || "";

  if (!session || !session.user || !email) redirect("/not-found");

  const user = await getUser(email);
  console.log(user);

  if (!user.isAdmin) {
    // redirect to
    redirect("/not-found");
  }

  return (
    <Admin />
  );
}
