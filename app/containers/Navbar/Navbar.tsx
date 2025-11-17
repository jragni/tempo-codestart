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
        text-white
        w-full
        z-50
        px-2
        md:px-4
        h-[64px]
      "
    >
      <div className="flex-1">
        <Link className="btn btn-ghost text-lg md:text-xl text-neurtral-content" href="/">
          <span className="hidden sm:inline">Tempo Codestart</span>
          <span className="sm:hidden">Tempo</span>
        </Link>
      </div>
      <div className="flex gap-1 md:gap-2">
        {user && user.isAdmin && (
          <Link className="btn btn-base-200 btn-sm md:btn-md" href="/admin">
            <span className="hidden sm:inline">Admin</span>
            <span className="sm:hidden">A</span>
          </Link>
        )}
        <form className="flex-none">
          <LoginButton user={user} />
        </form>
      </div>
    </nav>
  );
}
