"use client";
/**
 * LoginModal component
 */
// TODO add google sign in
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";

import { FaGithub } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";

import { handleSignIn, handleSignOut } from "./actions";
import { User } from "@/app/definitions";

interface LoginButtonProps {
	user?: User | null,
};

export default function AuthButton({ user }: LoginButtonProps) {
  const { pending } = useFormStatus();
  const [error, setError] = useState<null | string>(null);
  const signInLabel = pending ? 'Signing in' : 'Sign In';

  const handleFormAction = async () => {
    try {
      const slug = localStorage.getItem('last_viewed_problem_slug')
        || 'welcome-to-tempo';
      await handleSignIn('github', `/problems/${slug}`);
    } catch (e) {
      setError('An error occurred. Please try again.');
    }
  }

  return (user) ? (
    <button
      className="btn btn-ghost btn-sm md:btn-md"
      formAction={handleSignOut}
      type="submit"
      aria-label="Sign out"
    >
      {user.image
        ? (
          <Image
            className="rounded-full"
            height={30}
            src={user.image} alt="user image"
            width={30}
          />
        ) : <FaRegUser />
      }
      <span className="hidden sm:inline">Sign Out</span>
    </button>
    ) : (
    <div>
      <button
        className={`
          btn
          btn-outline
          btn-sm
          md:btn-md
          ${!!error && 'btn-error'}
        `}
        formAction={handleFormAction}
        type="submit"
        aria-label="Sign in with GitHub"
      >
        <FaGithub />
        <span className="hidden sm:inline">{signInLabel}</span>
        <span className="sm:hidden">Sign In</span>
        {pending && <span className="loading loading-bars loading-sm"></span>}
      </button>
      <p className="text-center text-xs text-error">{error}</p>
    </div>
  );
}