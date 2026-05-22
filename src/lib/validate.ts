import { z } from "zod";

// ── Contact Form Schema ───────────────────────────────────────────────────────
// Regex prevents HTML injection and newlines (email header injection)
const safeString = (maxLen: number) =>
    z
        .string()
        .min(1)
        .max(maxLen)
        .transform((s) => s.replace(/[\r\n]/g, " ").trim());

export const contactSchema = z.object({
    name: safeString(100).pipe(
        z.string().regex(/^[\w\s'\-.,À-ÿ]+$/, "Name contains invalid characters")
    ),
    email: z.string().email("Invalid email address").max(254).toLowerCase(),
    message: safeString(2000).pipe(z.string().min(10, "Message too short")),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ── URL Safety Check ──────────────────────────────────────────────────────────
/**
 * Validate a URL is safe to use as an href:
 * - Must be http or https (blocks javascript:, data:, etc.)
 * - Must be a real URL
 */
export function isSafeUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
}

// ── Sanitize plain text for email templates ───────────────────────────────────
/**
 * Strip HTML tags and encode entities for use in email bodies.
 * Server-side only — does not use DOM.
 */
export function sanitizeForEmail(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}

// ── Repo name  safety ─────────────────────────────────────────────────────────
/** Validate a GitHub repo name to prevent path traversal in API routes */
export const repoNameSchema = z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_.\-]+$/, "Invalid repo name");
