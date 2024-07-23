"use server"
import { Session } from "next-auth";
import { signIn, signOut } from "@/auth";
import { createUser, getUser } from "app/api/users/handlers";
import { camelCaseData } from "@/utils/globalHelpers";


/**
 * handleSignIn
 * @param provider -- name of provider
 * "github" | "google"
 */
export async function handleSignIn(provider: string) {
  "use server";
  await signIn(provider);
};

export async function handleSignOut() {
  "use server";
  await signOut();
};

export async function handleUserPostAuth(session: Session) {
  // !NOTE this shouldn't be possible
  const email = session.user?.email || '';
  let user = await getUser(email);
  if (!user) {
    // create user
    user = await createUser({
      email: session?.user?.email ?? '',
      name: session?.user?.name ?? '',
      image: session?.user?.image ?? '',
      isAdmin: false
    });
  }
  return camelCaseData(user);
}