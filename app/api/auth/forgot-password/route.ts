import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/mailer";

const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ForgotPasswordSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
        }

        const { email } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (user) {
            const code = await createOtp(email, "PASSWORD_RESET", user.id);
            await sendOtpEmail(email, code, "PASSWORD_RESET");
        }

        // Always respond success to avoid leaking whether an email is registered.
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
