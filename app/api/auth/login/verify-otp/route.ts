import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/auth/otp";
import { setSessionCookie } from "@/lib/auth/getSession";

const VerifySchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
});

const reasonMessage: Record<string, string> = {
    not_found: "No sign-in code was requested for this email.",
    expired: "This code has expired. Please sign in again.",
    too_many_attempts: "Too many incorrect attempts. Please sign in again.",
    invalid: "Incorrect code. Please try again.",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = VerifySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
        }

        const { email, code } = parsed.data;

        const result = await verifyOtp(email, "LOGIN_2FA", code);
        if (!result.success) {
            return NextResponse.json({ error: reasonMessage[result.reason] || "Verification failed." }, { status: 400 });
        }

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Account not found." }, { status: 404 });
        }

        await setSessionCookie({ userId: user.id, role: user.role, email: user.email });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login OTP verification error:", error);
        return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
    }
}
