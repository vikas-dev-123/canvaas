"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/pages/logo";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"request" | "reset">("request");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();

      // The endpoint always responds success to avoid leaking whether an email is registered.
      setMessage("If that email is registered, a reset code has been sent.");
      setStep("reset");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("PASSWORDS_DO_NOT_MATCH");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not reset your password.");
        return;
      }

      router.push("/agency/sign-in?reset=1");
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMessage("A new code was sent, if that email is registered.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="inset-0 z-[200] flex items-center justify-center bg-white overflow-hidden">
      <div className="relative w-full max-w-lg p-10 md:p-14 z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <Logo className="h-10 mb-8" />
          <h2 className="text-4xl font-black text-black tracking-tighter mb-3">
            {step === "request" ? "RECOVER_ACCESS" : "SET_NEW_KEY"}
          </h2>
          <p className="text-slate-400 font-medium tracking-tight text-sm">
            {step === "request" ? "Enter your email to receive a reset code." : `Enter the code sent to ${email} and choose a new password.`}
          </p>
        </div>

        {step === "request" && (
          <form onSubmit={handleRequest} className="space-y-8">
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
                placeholder="you@example.com"
              />
            </div>

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
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>SEND_RESET_CODE<ArrowRight className="w-6 h-6" /></>}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/agency/sign-in")}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-opacity"
              >
                Back_to_Sign_In
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset} className="space-y-6">
            {message && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">{message}</p>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
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

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                NEW_SECURITY_KEY
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-slate-200 py-3 font-bold text-lg
                text-black focus:outline-none focus:border-black transition-all
                placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                CONFIRM_NEW_KEY
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
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>RESET_PASSWORD<ArrowRight className="w-6 h-6" /></>}
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
