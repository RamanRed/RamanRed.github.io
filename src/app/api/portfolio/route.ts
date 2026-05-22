import { NextRequest, NextResponse } from "next/server";
import { config as staticConfig } from "@/config/portfolio";
import { supabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

const ADMIN_EMAIL = "ramanrandive2004@gmail.com";

// Helper to verify admin session
function isAdminAuthenticated(req: NextRequest): boolean {
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const authHeader = req.headers.get("Authorization");

    return sessionCookie === "authenticated-raman" || authHeader === "Bearer authenticated-raman";
}

export async function GET(req: NextRequest) {
    // ── Rate limiting: 60 requests per minute per IP ─────────────────────────
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`portfolio-get:${ip}`, 60, 60 * 1000);
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            {
                status: 429,
                headers: { "Retry-After": String(rl.retryAfterSeconds) },
            }
        );
    }

    try {
        if (!supabase) {
            // Supabase not configured, return static config
            return NextResponse.json(staticConfig);
        }

        // Try fetching from Supabase table
        const { data, error } = await supabase
            .from("portfolio_settings")
            .select("config")
            .eq("email", ADMIN_EMAIL)
            .maybeSingle();

        if (error) {
            console.error("Supabase select error (falling back to static config):", error.message);
            return NextResponse.json(staticConfig);
        }

        if (data && data.config) {
            return NextResponse.json(data.config);
        }

        // Row doesn't exist, let's attempt to seed it
        const { error: insertError } = await supabase
            .from("portfolio_settings")
            .insert({
                email: ADMIN_EMAIL,
                config: staticConfig
            });

        if (insertError) {
            console.error("Supabase seed error (using static):", insertError.message);
        }

        return NextResponse.json(staticConfig);
    } catch (err) {
        console.error("GET Portfolio API error (falling back to static):", err);
        return NextResponse.json(staticConfig);
    }
}

export async function POST(req: NextRequest) {
    try {
        // Authenticate admin session
        if (!isAdminAuthenticated(req)) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const newConfig = await req.json();

        if (!newConfig || typeof newConfig !== "object") {
            return NextResponse.json({ error: "Invalid configuration payload" }, { status: 400 });
        }

        if (!supabase) {
            return NextResponse.json({
                success: true,
                localOnly: true,
                message: "Supabase keys not found in .env.local. Saved config to session memory."
            });
        }

        // Upsert into Supabase portfolio_settings
        const { error } = await supabase
            .from("portfolio_settings")
            .upsert({
                email: ADMIN_EMAIL,
                config: newConfig,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "email"
            });

        if (error) {
            console.error("Supabase upsert error:", error.message);
            return NextResponse.json({
                success: false,
                error: `Database sync failed: ${error.message}`
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Configuration synchronized successfully to Supabase cloud database!"
        });
    } catch (err) {
        console.error("POST Portfolio API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
