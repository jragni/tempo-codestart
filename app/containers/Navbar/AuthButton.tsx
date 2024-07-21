"use client";
/**
 * LoginModal component
 */
// TODO add google sign in
import Image from "next/image";
import { Session } from "next-auth";
import { useFormStatus } from "react-dom";

import { FaGithub } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";

import { handleSignIn, handleSignOut } from "./actions";

interface LoginButtonProps {
  session: Session | null,
};

export default function AuthButton({ session }: LoginButtonProps) {
  const { pending } = useFormStatus();
  const signInLabel = pending ? 'Signing in' : 'Sign In';

  return (session && session.user) ? (
    <button
      className="btn btn-ghost"
      formAction={handleSignOut}
      type="submit"
    >
      {session.user.image
        ? (
          <Image
            className="rounded-full"
            height={30}
            src={session.user.image} alt="user image"
            width={30}
          />
        ) : <FaRegUser />
      }
      Sign Out
    </button>
    ) : (
    <button
      className="btn btn-outline"
      formAction={() => handleSignIn('github')}
      type="submit"
    >
      <FaGithub />
      {signInLabel}
      {pending && <span className="loading loading-bars"></span>}
    </button>
  );
}