import { Ratelimit } from "@upstash/ratelimit";
import { redis, isRedisConfigured } from "./redis";

// If Redis isn't configured (e.g. local dev without Upstash provisioned yet), rate
// limiting is a no-op that always allows the request rather than crashing the app.

export type RateLimitResult = { success: boolean; limit?: number; remaining?: number };

const ALWAYS_ALLOW: RateLimitResult = { success: true };

const buildLimiter = (requests: number, window: `${number} ${"s" | "m" | "h"}`, prefix: string) => {
    if (!redis) return null;
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(requests, window),
        analytics: true,
        prefix: `ratelimit:${prefix}`,
    });
};

// Login / signup / OTP-verify — brute-force / abuse targets, keyed by IP.
const authIpLimiter = buildLimiter(10, "1 m", "auth-ip");

// OTP resend — keyed by email, stricter to stop spamming an inbox.
const otpResendLimiter = buildLimiter(1, "30 s", "otp-resend");

// Public funnel-page traffic — generous, keyed by IP.
const publicPageLimiter = buildLimiter(120, "1 m", "public-page");

export const checkAuthRateLimit = async (ip: string): Promise<RateLimitResult> => {
    if (!authIpLimiter) return ALWAYS_ALLOW;
    const result = await authIpLimiter.limit(ip);
    return result;
};

export const checkOtpResendRateLimit = async (email: string): Promise<RateLimitResult> => {
    if (!otpResendLimiter) return ALWAYS_ALLOW;
    const result = await otpResendLimiter.limit(email);
    return result;
};

export const checkPublicPageRateLimit = async (ip: string): Promise<RateLimitResult> => {
    if (!publicPageLimiter) return ALWAYS_ALLOW;
    const result = await publicPageLimiter.limit(ip);
    return result;
};

export const isRateLimitingEnabled = isRedisConfigured;
