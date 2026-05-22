import { sanitizeForEmail } from "@/lib/validate";

export interface EmailPayload {
    name: string;
    email: string;
    message: string;
}

/**
 * Send contact email using Resend.
 * SECURITY: recipient is always the env var — never user input.
 */
export async function sendContactEmail(payload: EmailPayload): Promise<void> {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY!);

    const to = process.env.CONTACT_TO_EMAIL!;
    if (!to) throw new Error("CONTACT_TO_EMAIL not configured");

    // Sanitize all fields before templating (prevent email injection)
    const safeName = sanitizeForEmail(payload.name);
    const safeMessage = sanitizeForEmail(payload.message);

    // Strip newlines from subject (email header injection prevention)
    const subject = `Portfolio contact: ${payload.name.replace(/[\r\n]/g, " ")}`;

    await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to,
        replyTo: payload.email, // validated email — safe as Reply-To
        subject,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#c84b2f">New Portfolio Contact</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px;font-weight:bold;color:#666;width:100px">From</td>
            <td style="padding:8px">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:8px;font-weight:bold;color:#666">Email</td>
            <td style="padding:8px">${payload.email}</td>
          </tr>
          <tr>
            <td style="padding:8px;font-weight:bold;color:#666;vertical-align:top">Message</td>
            <td style="padding:8px;white-space:pre-wrap">${safeMessage}</td>
          </tr>
        </table>
        <hr style="margin:24px 0;border:1px solid #eee"/>
        <p style="font-size:12px;color:#999">Sent via your portfolio contact form</p>
      </div>
    `,
        text: `New contact from ${payload.name} (${payload.email}):\n\n${payload.message}`,
    });
}
