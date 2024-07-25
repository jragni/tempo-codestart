"use server"
import { signIn, signOut, auth } from "@/auth";

/**
 * handleSignIn
 * @param provider -- name of provider
 * "github" | "google"
 */
export async function handleSignIn(provider: string, redirectTo: string) {
  "use server";
  await signIn(provider, { redirectTo });
}

export async function handleSignOut() {
  "use server";
  await signOut();
}
