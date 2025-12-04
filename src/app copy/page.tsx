"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.emailVerified) {
      router.push("/account/verify-email");
    }
  }, [user, router]);

  if (loading) return <p className="p-4">Loading...</p>;

  // Check if user is logged in but not verified (should be redirected by useEffect)
  if (user && !user.emailVerified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 text-center">
          Please verify your email to access the app.
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {user ? (
        <>
          <p className="text-lg font-medium">
            Welcome, {user.displayName || user.email}
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            href="/account/login"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Login
          </Link>
          <Link
            href="/account/signup"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}