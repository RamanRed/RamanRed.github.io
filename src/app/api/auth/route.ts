import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const isAdmin = sessionCookie === "authenticated-raman";
    return NextResponse.json({ isAdmin });
}

export async function POST(req: NextRequest) {
    try {
        // ── Rate limiting: 5 authentication attempts per 5 minutes per IP ───────
        const ip = getClientIp(req.headers);
        const rl = rateLimit(`auth:${ip}`, 5, 5 * 60 * 1000);
        if (!rl.success) {
            return NextResponse.json(
                { error: "Too many authentication attempts. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(rl.retryAfterSeconds),
                    },
                }
            );
        }

        // ── Content-Type check ─────────────────────────────────────────────────────
        const contentType = req.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
            return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
        }

        // ── Body size guard (2 KB max for auth requests) ─────────────────────────
        const contentLength = req.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 2 * 1024) {
            return NextResponse.json({ error: "Request payload too large" }, { status: 413 });
        }

        const { email, password } = await req.json();

        const allowedEmails = ["ramanrandive2004@gmail.com", "raman.randive23@pccoepune.org"];
        const targetEmail = email ? email.toLowerCase().trim() : "";
        const adminPassword = process.env.ADMIN_PASSWORD || "ramanred00001";

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Easter Egg / Redirect connection trigger: Any other email is entered
        if (!allowedEmails.includes(targetEmail)) {
            return NextResponse.json({
                success: false,
                redirect: true,
                message: "Email recognized as visitor. Launching direct profiles connect portal."
            });
        }

        // Admin email verification
        if (password !== adminPassword) {
            return NextResponse.json({
                success: false,
                redirect: false,
                error: "Invalid password for admin access."
            }, { status: 401 });
        }

        // Secure authentication success
        const response = NextResponse.json({
            success: true,
            message: "Authentication successful. Unlocking admin access console."
        });

        // Set a session cookie (simple, secure cookie for security demo)
        response.cookies.set("admin_session", "authenticated-raman", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/"
        });

        return response;
    } catch (err) {
        console.error("Auth API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
