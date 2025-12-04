"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Email login failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Sign in with Google
      </button>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-2 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Login
        </button>
      </form>

      <p className="text-sm">
        Don’t have an account?{" "}
        <Link href="/account/signup" className="text-blue-600 underline">
          Sign Up
        </Link>
      </p>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
