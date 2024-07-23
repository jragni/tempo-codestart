/**
 * Navbar
 */

import Link from "next/link";

import { auth } from "@/auth";

import LoginButton from "./AuthButton";
import { handleUserPostAuth } from "./actions";

export default async function Navbar() {
  const session = await auth();
  let user;
  if (session) {
    // NOTE: the user from session is not the same as the user from the database
    user = await handleUserPostAuth(session);
  }

	const showAdminLink = user && user.isAdmin;

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
        <Link className="btn btn-ghost text-xl text-neurtral-content" href="/">
          Tempo
        </Link>
      </div>
      <div>
        {showAdminLink && <Link className="btn btn-base-200" href="/admin">Admin</Link>}
        <form className="flex-none">
          <LoginButton session={session} />
        </form>
      </div>
    </nav>
  );
}
