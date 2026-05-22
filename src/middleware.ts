import { NextResponse } from "next/server";

export function middleware() {
    const res = NextResponse.next();

    // ── Security Headers ──────────────────────────────────────────────────────
    const csp = [
        "default-src 'self'",
        // Three.js + inline scripts (canvas workers)
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' fonts.googleapis.com",
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com https://cdn.jsdelivr.net",
        "img-src 'self' data: blob: https://avatars.githubusercontent.com https://opengraph.githubassets.com https://raw.githubusercontent.com https://cdn.jsdelivr.net",
        // drei assets (Environment HDR, GLTF helpers) + GitHub API
        "connect-src 'self' https://api.github.com https://raw.githack.com https://market-assets.fra1.cdn.digitaloceanspaces.com blob:",
        "font-src 'self' fonts.gstatic.com data:",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",                // anti-clickjacking
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
    ].join("; ");

    res.headers.set("Content-Security-Policy", csp);
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
    );
    res.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
    );

    // ── Strip server-identifying headers ─────────────────────────────────────
    res.headers.delete("X-Powered-By");
    res.headers.delete("Server");

    return res;
}

export const config = {
    matcher: [
        // Apply to all routes except Next.js internals and static files
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
