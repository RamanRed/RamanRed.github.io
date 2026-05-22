import { NextRequest, NextResponse } from "next/server";
import { fetchRepos } from "@/lib/github";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
    // ── Method guard (redundant here but explicit) ─────────────────────────────
    // Only GET allowed; Next.js handles 405 for others via route export

    // ── Rate limiting: 30 req/min per IP ──────────────────────────────────────
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`repos:${ip}`, 30, 60_000);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests" },
            {
                status: 429,
                headers: { "Retry-After": String(rl.retryAfterSeconds) },
            }
        );
    }

    try {
        const repos = await fetchRepos();

        return NextResponse.json(repos, {
            headers: {
                // Allow client-side caching; revalidated server-side every 5 min
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
            },
        });
    } catch (err) {
        // SECURITY: never expose error details to client
        console.error("repos route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
