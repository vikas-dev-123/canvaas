import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { OtpPurpose } from "@prisma/client";

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const MAX_ATTEMPTS = 5;

export const generateOtpCode = () => crypto.randomInt(100000, 1000000).toString();

/** Creates a fresh OTP for (email, purpose), invalidating any prior outstanding one. Returns the plaintext code to email. */
export const createOtp = async (email: string, purpose: OtpPurpose, userId?: string) => {
    const code = generateOtpCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await db.otpCode.updateMany({
        where: { email, purpose, consumedAt: null },
        data: { consumedAt: new Date() },
    });

    await db.otpCode.create({
        data: { email, userId, codeHash, purpose, expiresAt },
    });

    return code;
};

export type VerifyOtpResult = { success: true } | { success: false; reason: "not_found" | "expired" | "too_many_attempts" | "invalid" };

export const verifyOtp = async (email: string, purpose: OtpPurpose, code: string): Promise<VerifyOtpResult> => {
    const otp = await db.otpCode.findFirst({
        where: { email, purpose, consumedAt: null },
        orderBy: { createdAt: "desc" },
    });

    if (!otp) return { success: false, reason: "not_found" };
    if (otp.expiresAt < new Date()) return { success: false, reason: "expired" };
    if (otp.attempts >= MAX_ATTEMPTS) return { success: false, reason: "too_many_attempts" };

    const matches = await bcrypt.compare(code, otp.codeHash);

    if (!matches) {
        await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
        return { success: false, reason: "invalid" };
    }

    await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
    return { success: true };
};
