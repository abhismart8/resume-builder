"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();

  if (session === undefined) {
    return (
      <nav className="bg-white border-b px-6 py-3 flex gap-6">
        <span className="text-sm">Loading...</span>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b px-6 py-3 flex gap-6">
      <Link href="/" className="text-sm font-medium">
        Home
      </Link>
      <Link href="/templates" className="text-sm font-medium">
        Templates
      </Link>

      {session ? (
        <>
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-sm font-medium">
            Login
          </Link>
          <Link href="/signup" className="text-sm font-medium">
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
}