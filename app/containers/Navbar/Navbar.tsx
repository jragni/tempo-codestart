/**
 * Navbar
 */

import Link from "next/link";

import LoginButton from "./AuthButton";
import { User } from "@/app/definitions";
interface NavbarProps {
  user: User | null;
};

export default async function Navbar({ user }: NavbarProps) {
	// TODO  add redirect of logo link to dashboard (after login and dashboard created)
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
        {user && user.isAdmin && <Link className="btn btn-base-200" href="/admin">Admin</Link>}
        <form className="flex-none">
          <LoginButton user={user} />
        </form>
      </div>
    </nav>
  );
}
