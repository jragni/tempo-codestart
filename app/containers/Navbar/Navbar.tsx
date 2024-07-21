/**
 * Navbar
 */

import Link from "next/link";

import { auth } from "@/auth";

import LoginButton from "./AuthButton";
import { handleUserPostAuth } from "./actions";

export default async function Navbar() {
  const session = await auth();

  if (session) {
    await handleUserPostAuth(session);
  }

  return (
    <nav
      className="
        bg-neutral
        fixed
        navbar
        top-0
        w-full
        z-50
      "
    >
      <div className="flex-1">
        <Link
          className="btn btn-ghost text-xl text-neurtral-content"
          href='/'
        >
          Tempo
        </Link>
      </div>
      <form className="flex-none">
        <LoginButton session={session} />
      </form>
    </nav>
  );
}