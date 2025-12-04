"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const { user, sendVerificationEmail, logout } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push("/");
    }
  }, [user, router]);

  const handleResendEmail = async () => {
    try {
      await sendVerificationEmail();
      setMessage("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send verification email.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p>Please sign in first.</p>
        <Link href="/account/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">Verify Your Email</h1>
      <p className="text-center">
        We've sent a verification email to <strong>{user.email}</strong>.
        Please check your inbox and click the verification link.
      </p>
      
      <button
        onClick={handleResendEmail}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Resend Verification Email
      </button>

      <button
        onClick={logout}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Logout
      </button>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}