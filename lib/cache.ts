import { redis } from "./redis";

// Thin get-or-set cache wrapper over Upstash Redis. When Redis isn't configured
// (e.g. local dev without Upstash provisioned), every call is a passthrough to `fn`
// so caching is purely additive and never a hard dependency for the app to run.

export const getOrSetCache = async <T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> => {
    if (!redis) return fn();

    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;

    const fresh = await fn();
    if (fresh !== null && fresh !== undefined) {
        await redis.set(key, fresh, { ex: ttlSeconds });
    }
    return fresh;
};

/** Deletes one or more exact cache keys. */
export const invalidateCache = async (...keys: string[]) => {
    if (!redis || keys.length === 0) return;
    await redis.del(...keys);
};
