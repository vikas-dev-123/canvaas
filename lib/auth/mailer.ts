import { Resend } from "resend";
import { OtpPurpose } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || "Canvaas <onboarding@resend.dev>";

const purposeCopy: Record<OtpPurpose, { subject: string; heading: string }> = {
    SIGNUP_VERIFY: { subject: "Verify your Canvaas account", heading: "Confirm your email" },
    LOGIN_2FA: { subject: "Your Canvaas sign-in code", heading: "Sign-in verification code" },
    PASSWORD_RESET: { subject: "Reset your Canvaas password", heading: "Password reset code" },
};

export const sendOtpEmail = async (email: string, code: string, purpose: OtpPurpose) => {
    const copy = purposeCopy[purpose];
    await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: copy.subject,
        html: `<div style="font-family:sans-serif;max-width:420px;margin:0 auto">
            <h2>${copy.heading}</h2>
            <p>Your verification code is:</p>
            <p style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</p>
            <p style="color:#666">This code expires in ${process.env.OTP_TTL_MINUTES || 10} minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>`,
    });
};

export const sendInviteEmail = async (email: string, agencyName: string) => {
    const signUpUrl = `${process.env.NEXT_PUBLIC_URL}/agency/sign-up`;
    await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `You've been invited to join ${agencyName} on Canvaas`,
        html: `<div style="font-family:sans-serif;max-width:420px;margin:0 auto">
            <h2>You're invited to ${agencyName}</h2>
            <p>Sign up with this email address to join the team.</p>
            <p><a href="${signUpUrl}" style="display:inline-block;background:#000;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px">Accept invitation</a></p>
        </div>`,
    });
};
