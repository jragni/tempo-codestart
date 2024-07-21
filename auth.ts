import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  redirectProxyUrl: process.env.NEXTAUTH_URL,
  providers: [GitHub, Google,],
});