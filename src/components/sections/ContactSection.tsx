"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validate";
import { config } from "@/config/portfolio";
import { isSafeUrl } from "@/lib/validate";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactSection() {
    const [status, setStatus] = useState<Status>("idle");
    const [errMsg, setErrMsg] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
    });

    async function onSubmit(data: ContactInput) {
        setStatus("submitting"); setErrMsg("");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (res.ok) { setStatus("success"); }
            else if (res.status === 429) { setStatus("error"); setErrMsg("Too many requests. Please wait a few minutes."); }
            else { setStatus("error"); setErrMsg(json?.error ?? "Something went wrong."); }
        } catch { setStatus("error"); setErrMsg("Network error. Check your connection."); }
    }

    return (
        <section id="contact" className="section-full contact-section" data-scroll-section>
            <div className="contact-inner">
                {/* Left col */}
                <div>
                    <div data-loco-anim>
                        <div className="section-tag">Get In Touch</div>
                        <h2 className="section-title">Let&apos;s<br /><em>Work Together</em></h2>
                        <p className="section-body" style={{ marginTop: 16 }}>
                            Have a project in mind? Want to collaborate? Drop me a message and I&apos;ll get back to you.
                        </p>
                    </div>
                    <div className="contact-email-large" data-loco-anim data-delay="1">
                        <a href={`mailto:${config.email}`}>{config.email}</a>
                    </div>

                    {/* Social quick links */}
                    <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }} data-loco-anim data-delay="2">
                        {config.social.map((s) => {
                            const href = isSafeUrl(s.url) || s.url.startsWith("mailto:") ? s.url : "#";
                            const Icon = s.platform === "github" ? Github : s.platform === "linkedin" ? Linkedin : s.platform === "twitter" ? Twitter : Mail;
                            return (
                                <a
                                    key={s.platform}
                                    href={href}
                                    target={s.url.startsWith("mailto:") ? "_self" : "_blank"}
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8,
                                        padding: "10px 18px", borderRadius: "50px",
                                        border: "1px solid var(--border-2)", color: "var(--text-2)",
                                        textDecoration: "none", fontSize: 13, transition: "all 0.2s",
                                        textTransform: "capitalize",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,180,75,0.35)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-2)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-2)"; }}
                                >
                                    <Icon size={15} />
                                    {s.platform}
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Right col — contact form */}
                <div data-loco-anim data-delay="2">
                    {status === "success" ? (
                        <div className="cf-success">
                            <div className="cf-success-icon">🎉</div>
                            <div className="cf-success-title">Message sent!</div>
                            <div className="cf-success-sub">Thanks for reaching out - I&apos;ll be in touch soon.</div>
                            <button className="cf-submit" style={{ maxWidth: 200 }} onClick={() => setStatus("idle")}>Send another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="contact-form" noValidate>
                            <div className="cf-group">
                                <label className="cf-label" htmlFor="cf-name">Name</label>
                                <input id="cf-name" {...register("name")} className={`cf-input${errors.name ? " has-error" : ""}`} placeholder="Your name" autoComplete="name" />
                                {errors.name && <span className="cf-error">{errors.name.message}</span>}
                            </div>
                            <div className="cf-group">
                                <label className="cf-label" htmlFor="cf-email">Email</label>
                                <input id="cf-email" type="email" {...register("email")} className={`cf-input${errors.email ? " has-error" : ""}`} placeholder="you@example.com" autoComplete="email" />
                                {errors.email && <span className="cf-error">{errors.email.message}</span>}
                            </div>
                            <div className="cf-group">
                                <label className="cf-label" htmlFor="cf-msg">Message</label>
                                <textarea id="cf-msg" {...register("message")} className={`cf-textarea${errors.message ? " has-error" : ""}`} rows={5} placeholder="Tell me about your project…" />
                                {errors.message && <span className="cf-error">{errors.message.message}</span>}
                            </div>
                            {status === "error" && (
                                <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(200,75,47,0.1)", border: "1px solid rgba(200,75,47,0.3)", color: "var(--accent-2)", fontSize: 13 }}>{errMsg}</div>
                            )}
                            <button type="submit" className="cf-submit" disabled={status === "submitting"}>
                                {status === "submitting" ? "Sending…" : <><Send size={15} /> Send Message</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <span className="footer-name">{config.name}</span>
                <span className="footer-built">Built with Next.js · Three.js · Locomotive Scroll</span>
                <span className="footer-year">© {new Date().getFullYear()}</span>
            </div>
        </section>
    );
}
