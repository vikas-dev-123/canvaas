"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
 
import { useRouter } from "next/navigation";
import { Logo } from "@/components/pages/logo";

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First attempt to sign in
      const res = await signIn.create({
        identifier: email,
        password,
      });

      // If sign in is complete, set active session
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/");
      } else {
        // Handle other statuses (like verification required)
        console.log("Sign in status:", res.status);
        setError("Please check your email for verification or try again.");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      // Better error handling
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === "form_identifier_not_found") {
          setError("No account found with this email address.");
        } else if (firstError.code === "form_password_incorrect") {
          setError("Incorrect password. Please try again.");
        } else if (firstError.code === "session_unauthorized") {
          setError("Account requires email verification. Please check your email.");
        } else {
          setError(firstError.message || "Authentication failed. Please try again.");
        }
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  h-full inset-0 z-[200] flex items-center justify-center bg-white overflow-hidden">
      {/* Background watermark */}
       

      <div className="relative w-full max-w-xl p-12 md:p-20 z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Logo className="h-12 mb-10" />
          <h2 className="text-4xl font-black text-black tracking-tighter mb-4">
            ENTRY_PROTOCOL
          </h2>
          <p className="text-slate-400 font-medium tracking-tight">
            Synchronize with the Canvas core architecture.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-10">
          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">
                STRUCTURAL_EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-slate-100 py-4 font-bold text-lg
                text-black dark:text-white focus:outline-none focus:border-black transition-all
                placeholder:text-slate-200 dark:placeholder:text-white/30"
                placeholder="architect@canvas.core"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">
                SECURITY_KEY
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-slate-100 py-4 font-bold text-lg
                text-black focus:outline-none focus:border-black transition-all
                placeholder:text-slate-200 dark:placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="mt-8 text-center">
  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
    NEW_TO_CANVAS
  </p>

  <button
    type="button"
    onClick={() => router.push("/agency/sign-up")}
    className="text-[11px] font-black uppercase tracking-[0.3em] 
    text-black   hover:opacity-60 transition-opacity"
  >
    CREATE_ACCOUNT
  </button>
</div>

          {error && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-xs font-bold text-red-600 uppercase tracking-tight">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-8 bg-black text-white font-black text-xl tracking-[0.2em] uppercase
            hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl
            disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                CONNECT_CORE
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}