import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

// Edge-safe (pure jose, no Prisma/bcrypt/next-headers imports) so this file can be
// imported from both middleware.ts (Edge runtime) and Node-runtime route handlers.

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "canvaas_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
    userId: string;
    role: Role;
    email: string;
};

const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is not set");
    return new TextEncoder().encode(secret);
};

export const signSession = async (payload: SessionPayload) =>
    new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
        .sign(getSecretKey());

export const verifySessionToken = async (token: string | undefined | null): Promise<SessionPayload | null> => {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        if (typeof payload.userId !== "string" || typeof payload.role !== "string" || typeof payload.email !== "string") {
            return null;
        }
        return { userId: payload.userId, role: payload.role as Role, email: payload.email };
    } catch {
        return null;
    }
};
