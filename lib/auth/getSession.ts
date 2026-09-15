import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, signSession, verifySessionToken, type SessionPayload } from "./session";

// Node-runtime helpers for server components, server actions, and route handlers.

export const getSession = async (): Promise<SessionPayload | null> => {
    const token = cookies().get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
};

export const setSessionCookie = async (payload: SessionPayload) => {
    const token = await signSession(payload);
    cookies().set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
    });
};

export const clearSessionCookie = () => {
    cookies().set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
};
