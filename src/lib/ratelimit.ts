/**
 * Simple in-memory rate limiter.
 * For production, swap with @upstash/ratelimit + Redis for persistence across instances.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key);
    }
}, 5 * 60 * 1000);

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number;
    retryAfterSeconds: number;
}

/**
 * @param identifier  Usually the client IP address
 * @param limit       Max requests allowed in the window
 * @param windowMs    Window duration in milliseconds
 */
export function rateLimit(
    identifier: string,
    limit: number,
    windowMs: number
): RateLimitResult {
    const now = Date.now();
    const key = identifier;
    const existing = store.get(key);

    if (!existing || existing.resetAt < now) {
        // New window
        store.set(key, { count: 1, resetAt: now + windowMs });
        return {
            success: true,
            remaining: limit - 1,
            resetAt: now + windowMs,
            retryAfterSeconds: 0,
        };
    }

    if (existing.count >= limit) {
        return {
            success: false,
            remaining: 0,
            resetAt: existing.resetAt,
            retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
        };
    }

    existing.count++;
    return {
        success: true,
        remaining: limit - existing.count,
        resetAt: existing.resetAt,
        retryAfterSeconds: 0,
    };
}

/**
 * Extract the real client IP from Next.js request headers.
 * Respects Vercel's x-real-ip and x-forwarded-for.
 */
export function getClientIp(headers: Headers): string {
    return (
        headers.get("x-real-ip") ??
        headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        "unknown"
    );
}
