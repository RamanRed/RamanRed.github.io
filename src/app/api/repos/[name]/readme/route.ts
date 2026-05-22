import { NextRequest, NextResponse } from "next/server";
import { fetchReadme } from "@/lib/github";
import { repoNameSchema } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    // ── Rate limiting ──────────────────────────────────────────────────────────
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`readme:${ip}`, 30, 60_000);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests" },
            {
                status: 429,
                headers: { "Retry-After": String(rl.retryAfterSeconds) },
            }
        );
    }

    const { name } = await params;

    // ── Input validation: prevent path traversal and injection ─────────────────
    const parsed = repoNameSchema.safeParse(name);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid repo name" }, { status: 400 });
    }

    try {
        const readme = await fetchReadme(parsed.data);
        // Return raw markdown — client-side rehype-sanitize handles XSS
        return new NextResponse(readme, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
            },
        });
    } catch (err) {
        console.error("readme route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
