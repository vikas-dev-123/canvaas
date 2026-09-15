import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/auth/otp";

const VerifySchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
});

const reasonMessage: Record<string, string> = {
    not_found: "No verification code was requested for this email.",
    expired: "This code has expired. Please request a new one.",
    too_many_attempts: "Too many incorrect attempts. Please request a new code.",
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

        const result = await verifyOtp(email, "SIGNUP_VERIFY", code);
        if (!result.success) {
            return NextResponse.json({ error: reasonMessage[result.reason] || "Verification failed." }, { status: 400 });
        }

        await db.user.update({
            where: { email },
            data: { emailVerifiedAt: new Date() },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sign up verification error:", error);
        return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
    }
}
