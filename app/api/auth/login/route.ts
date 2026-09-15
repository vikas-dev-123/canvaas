import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/mailer";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = LoginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
        }

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        if (!user.emailVerifiedAt) {
            return NextResponse.json({ error: "Please verify your email before logging in.", needsVerification: true }, { status: 403 });
        }

        const passwordMatches = await verifyPassword(password, user.password);
        if (!passwordMatches) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const code = await createOtp(email, "LOGIN_2FA", user.id);
        await sendOtpEmail(email, code, "LOGIN_2FA");

        return NextResponse.json({ step: "otp-required", email });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
    }
}
