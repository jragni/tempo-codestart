"use server"
import { signIn, signOut } from "@/auth";


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
