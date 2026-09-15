"use client";

import React, { useState } from "react";
import { ArrowRight, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/pages/logo";

export default function SignInPage() {
  const router = useRouter();

  const [step, setStep] = useState<"form" | "otp">("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* =======================
     STEP 1: EMAIL + PASSWORD
  ======================= */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please try again.");
        return;
      }

      setMessage("A sign-in code was sent to your email.");
      setStep("otp");
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     STEP 2: VERIFY OTP (mandatory 2FA)
  ======================= */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Verification error:", err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "LOGIN_2FA" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not resend the code.");
        return;
      }
      setMessage("A new code was sent to your email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="h-full inset-0 z-[200] flex items-center justify-center bg-white overflow-hidden">
      <div className="relative w-full max-w-xl p-12 md:p-20 z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Logo className="h-12 mb-10" />
          <h2 className="text-4xl font-black text-black tracking-tighter mb-4">
            {step === "form" ? "ENTRY_PROTOCOL" : "VERIFY_IDENTITY"}
          </h2>
          <p className="text-slate-400 font-medium tracking-tight">
            {step === "form" ? "Synchronize with the Canvas core architecture." : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {step === "form" && (
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
                  placeholder="you@example.com"
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

            <div className="text-right -mt-6">
              <button
                type="button"
                onClick={() => router.push("/agency/forgot-password")}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-opacity"
              >
                Forgot_Password?
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">NEW_TO_CANVAS</p>
              <button
                type="button"
                onClick={() => router.push("/agency/sign-up")}
                className="text-[11px] font-black uppercase tracking-[0.3em] text-black hover:opacity-60 transition-opacity"
              >
                CREATE_ACCOUNT
              </button>
            </div>

            {error && (
              <div className="p-5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-xs font-bold text-red-600 uppercase tracking-tight">{error}</p>
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
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerify} className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">
                VERIFICATION_CODE
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-transparent border-b-2 border-slate-200 py-3 font-bold text-lg
                text-black text-center tracking-[0.4em] focus:outline-none focus:border-black
                placeholder:text-slate-300"
                placeholder="123456"
              />
            </div>

            {message && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">{message}</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <p className="text-[10px] font-black text-red-600 uppercase tracking-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-black text-white font-black text-lg tracking-[0.2em] uppercase
              hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-xl
              disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>VERIFY_&amp;_SIGN_IN<ArrowRight className="w-6 h-6" /></>}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-opacity disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend_Code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
