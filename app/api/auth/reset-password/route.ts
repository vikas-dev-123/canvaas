import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/auth/otp";
import { hashPassword, isStrongPassword } from "@/lib/auth/password";

const ResetPasswordSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(8),
});

const reasonMessage: Record<string, string> = {
    not_found: "No reset code was requested for this email.",
    expired: "This code has expired. Please request a new one.",
    too_many_attempts: "Too many incorrect attempts. Please request a new code.",
    invalid: "Incorrect code. Please try again.",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ResetPasswordSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
        }

        const { email, code, newPassword } = parsed.data;

        if (!isStrongPassword(newPassword)) {
            return NextResponse.json({ error: "Password must contain an uppercase letter, a lowercase letter, and a number." }, { status: 400 });
        }

        const result = await verifyOtp(email, "PASSWORD_RESET", code);
        if (!result.success) {
            return NextResponse.json({ error: reasonMessage[result.reason] || "Verification failed." }, { status: 400 });
        }

        const passwordHash = await hashPassword(newPassword);
        await db.user.update({ where: { email }, data: { password: passwordHash } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
