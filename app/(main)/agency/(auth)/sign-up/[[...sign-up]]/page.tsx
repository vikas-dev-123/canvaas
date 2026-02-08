"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/pages/logo";

export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"form" | "verify">("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isLoaded) return null;

  /* =======================
     STEP 1: SIGN UP
  ======================= */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("PASSWORDS_DO_NOT_MATCH");
      setLoading(false);
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setMessage("VERIFICATION_CODE_SENT");
      setStep("verify"); // ✅ move to OTP screen
    } catch (err: any) {
      console.error("Sign up error:", err);
      // Better error handling for sign up
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === "form_identifier_exists") {
          setError("An account with this email already exists.");
        } else if (firstError.code === "form_password_pwned") {
          setError("Password is too weak. Please choose a stronger password.");
        } else {
          setError(firstError.message || "Sign up failed. Please try again.");
        }
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     STEP 2: VERIFY OTP
  ======================= */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === "verification_failed") {
          setError("Invalid or expired verification code.");
        } else {
          setError(firstError.message || "Verification failed. Please try again.");
        }
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inset-0 z-[200] flex items-center justify-center bg-white overflow-hidden">
      <div className="relative w-full max-w-lg p-10 md:p-14 z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <Logo className="h-10 mb-8" />
          <h2 className="text-4xl font-black text-black tracking-tighter mb-3">
            SYSTEM_MANIFEST
          </h2>
          <p className="text-slate-400 font-medium tracking-tight text-sm">
            Register your identity in the global structural network.
          </p>
        </div>

        {/* ================= FORM STEP ================= */}
        {step === "form" && (
          <form onSubmit={handleSignUp} className="space-y-8">
            <div className="space-y-6">

              {/* Email */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  STRUCTURAL_EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-slate-200 py-3 font-bold text-lg
                  text-black focus:outline-none focus:border-black transition-all
                  placeholder:text-slate-300"
                  placeholder="architect@canvas.core"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  SECURITY_KEY
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-slate-200 py-3 font-bold text-lg
                  text-black focus:outline-none focus:border-black transition-all
                  placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  CONFIRM_SECURITY_KEY
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-slate-200 py-3 font-bold text-lg
                  text-black focus:outline-none focus:border-black transition-all
                  placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <p className="text-[10px] font-black text-red-600 uppercase tracking-tight">
                  {error}
                </p>
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">
                  {message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-black text-white font-black text-lg tracking-[0.2em] uppercase
              hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-xl
              disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  AUTHORIZE_IDENTITY
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= OTP STEP ================= */}
        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                VERIFICATION_CODE
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-transparent border-b-2 border-slate-200 py-3 font-bold text-lg
                text-black text-center tracking-[0.4em] focus:outline-none focus:border-black
                placeholder:text-slate-300"
                placeholder="123456"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <p className="text-[10px] font-black text-red-600 uppercase tracking-tight">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-black text-white font-black text-lg tracking-[0.2em] uppercase
              hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-xl
              disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  VERIFY_EMAIL
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
