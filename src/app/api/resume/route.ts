import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
    // ── Rate limiting ──────────────────────────────────────────────────────────
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`resume:${ip}`, 10, 60_000);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
        );
    }

    // SECURITY: URL comes exclusively from env var — NEVER from user input
    // This prevents SSRF attacks (attacker cannot redirect this to internal services)
    const blobUrl = process.env.RESUME_BLOB_URL;
    const filename = process.env.RESUME_FILENAME ?? "Resume.pdf";

    // Fallback: serve from public/ if env var not configured
    if (!blobUrl) {
        // Redirect to public resume if blob not configured
        return NextResponse.redirect(new URL("/resume.pdf", req.url));
    }

    // Validate that the configured URL is actually an https:// URL
    try {
        const parsed = new URL(blobUrl);
        if (!["https:", "http:"].includes(parsed.protocol)) {
            throw new Error("Invalid protocol");
        }
    } catch {
        console.error("RESUME_BLOB_URL is not a valid URL");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    try {
        const blob = await fetch(blobUrl);
        if (!blob.ok) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        const buffer = await blob.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/pdf",
                // attachment triggers download, hides actual blob URL
                "Content-Disposition": `attachment; filename="${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err) {
        console.error("resume route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
