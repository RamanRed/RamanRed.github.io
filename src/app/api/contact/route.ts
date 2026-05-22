import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validate";
import { sendContactEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

const MAX_BODY_SIZE = 10 * 1024; // 10 KB

export async function POST(req: NextRequest) {
    // ── Rate limiting: 5 requests per 10 minutes per IP ───────────────────────
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests. Please wait before sending another message." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(rl.retryAfterSeconds),
                    "X-RateLimit-Remaining": "0",
                },
            }
        );
    }

    // ── Content-Type check ─────────────────────────────────────────────────────
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    // ── Body size guard (10 KB max) ────────────────────────────────────────────
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
        return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    // ── Parse and validate body ────────────────────────────────────────────────
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
            { status: 422 }
        );
    }

    // ── Send email ─────────────────────────────────────────────────────────────
    try {
        await sendContactEmail(parsed.data);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        // SECURITY: generic 500 in production — no internal details
        console.error("contact email error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Reject all non-POST methods explicitly
export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
