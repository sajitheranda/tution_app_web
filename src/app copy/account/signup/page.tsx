"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const { loginWithGoogle, signupWithEmail } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google signup failed.");
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signupWithEmail(email, password);
      // Redirect to verification page instead of showing success message
      router.push("/account/verify-email");
    } catch (err: any) {
      setError(err.message || "Email signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      
      <button
        onClick={handleGoogleSignup}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        Sign up with Google
      </button>

      <div className="relative w-80 my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <form onSubmit={handleEmailSignup} className="flex flex-col gap-3 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
          minLength={6}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/account/login" className="text-blue-600 underline hover:text-blue-700">
          Login
        </Link>
      </p>

      {error && (
        <div className="w-80 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}