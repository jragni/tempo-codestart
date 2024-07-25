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
        || 'your-first-problem';
      await handleSignIn('github', `/problems/${slug}`);
    } catch (e) {
      setError('An error occurred. Please try again.');
    }
  }

  return (user) ? (
    <button
      className="btn btn-ghost"
      formAction={handleSignOut}
      type="submit"
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
      Sign Out
    </button>
    ) : (
    <div>
      <button
        className={`
          btn
          btn-outline
          ${!!error && 'btn-error'}
        `}
        formAction={handleFormAction}
        type="submit"
      >
        <FaGithub />
        {signInLabel}
        {pending && <span className="loading loading-bars"></span>}
      </button>
      <p className="text-center text-xs text-error">{error}</p>
    </div>
  );
}