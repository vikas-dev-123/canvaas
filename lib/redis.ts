import { Redis } from "@upstash/redis";

// Edge-safe (REST-based) client — usable from both middleware.ts (Edge runtime)
// and Node-runtime route handlers/server actions.

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

export const isRedisConfigured = () => Boolean(redis);
