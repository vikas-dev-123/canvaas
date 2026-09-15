import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/mailer";

const ResendSchema = z.object({
    email: z.string().email(),
    purpose: z.enum(["SIGNUP_VERIFY", "LOGIN_2FA"]),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ResendSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { email, purpose } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Account not found." }, { status: 404 });
        }

        if (purpose === "SIGNUP_VERIFY" && user.emailVerifiedAt) {
            return NextResponse.json({ error: "This account is already verified." }, { status: 400 });
        }

        const code = await createOtp(email, purpose, user.id);
        await sendOtpEmail(email, code, purpose);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("OTP resend error:", error);
        return NextResponse.json({ error: "Could not resend the code. Please try again." }, { status: 500 });
    }
}
