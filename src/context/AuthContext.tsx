"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    if (typeof window === "undefined") return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
  if (typeof window === "undefined") return;

  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  if (!userCredential.user.emailVerified) {
    // DON'T logout here - just throw an error
    throw new Error("Please verify your email before logging in.");
  }
};
  const signupWithEmail = async (email: string, password: string) => {
    if (typeof window === "undefined") return;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Send verification email but DON'T log them out
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent to:", userCredential.user.email);
    }
  };

  const sendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  };

  const logout = async () => {
    if (typeof window === "undefined") return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        loginWithGoogle, 
        loginWithEmail, 
        signupWithEmail, 
        logout,
        sendVerificationEmail 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};