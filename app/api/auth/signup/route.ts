import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, isStrongPassword } from "@/lib/auth/password";
import { createOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/mailer";

const SignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = SignUpSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
        }

        const { name, email, password } = parsed.data;

        if (!isStrongPassword(password)) {
            return NextResponse.json({ error: "Password must contain an uppercase letter, a lowercase letter, and a number." }, { status: 400 });
        }

        const existing = await db.user.findUnique({ where: { email } });

        if (existing && existing.emailVerifiedAt) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);

        if (existing && !existing.emailVerifiedAt) {
            // Unverified account from a previous incomplete signup — refresh it and resend the code.
            await db.user.update({
                where: { email },
                data: { name, password: passwordHash },
            });
        } else {
            await db.user.create({
                data: {
                    name,
                    email,
                    password: passwordHash,
                    avatarUrl: "",
                    role: "SUBACCOUNT_USER",
                },
            });
        }

        const code = await createOtp(email, "SIGNUP_VERIFY");
        await sendOtpEmail(email, code, "SIGNUP_VERIFY");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sign up error:", error);
        return NextResponse.json({ error: "Sign up failed. Please try again." }, { status: 500 });
    }
}
