"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Send, CheckCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validate";

interface ContactDialogProps {
    onClose: () => void;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactDialog({ onClose }: ContactDialogProps) {
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
    });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    async function onSubmit(data: ContactInput) {
        setStatus("submitting");
        setErrorMsg("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (res.ok) {
                setStatus("success");
            } else if (res.status === 429) {
                setStatus("error");
                setErrorMsg("Too many requests. Please wait a few minutes.");
            } else {
                setStatus("error");
                setErrorMsg(json?.error ?? "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setErrorMsg("Network error. Please check your connection.");
        }
    }

    return (
        <div
            className="dialog-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
        >
            <div className="dialog" style={{ maxWidth: 480 }}>
                <div className="dialog-header">
                    <h2
                        id="contact-dialog-title"
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            fontFamily: "'Playfair Display', serif",
                            color: "rgba(255,255,255,0.9)",
                        }}
                    >
                        ☕ Let&apos;s Connect
                    </h2>
                    <button className="dialog-close" onClick={onClose} aria-label="Close contact dialog">
                        <X size={16} />
                    </button>
                </div>

                <div className="dialog-body">
                    {status === "success" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 16,
                                padding: "32px 0",
                                textAlign: "center",
                            }}
                        >
                            <CheckCircle size={48} color="#81c784" />
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 600, color: "#81c784", marginBottom: 8 }}>
                                    Message Sent!
                                </div>
                                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                                    Thanks for reaching out. I&apos;ll get back to you soon.
                                </div>
                            </div>
                            <button className="submit-btn" onClick={onClose} style={{ maxWidth: 200 }}>
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="form-group">
                                <label className="form-label" htmlFor="contact-name">Name</label>
                                <input
                                    id="contact-name"
                                    {...register("name")}
                                    className={`form-input ${errors.name ? "error" : ""}`}
                                    placeholder="Your name"
                                    autoComplete="name"
                                />
                                {errors.name && (
                                    <span className="form-error">{errors.name.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="contact-email">Email</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    {...register("email")}
                                    className={`form-input ${errors.email ? "error" : ""}`}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <span className="form-error">{errors.email.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="contact-message">Message</label>
                                <textarea
                                    id="contact-message"
                                    {...register("message")}
                                    className={`form-textarea ${errors.message ? "error" : ""}`}
                                    placeholder="What&apos;s on your mind?"
                                    rows={5}
                                />
                                {errors.message && (
                                    <span className="form-error">{errors.message.message}</span>
                                )}
                            </div>

                            {status === "error" && (
                                <div
                                    style={{
                                        padding: "10px 14px",
                                        background: "rgba(200,75,47,0.12)",
                                        border: "1px solid rgba(200,75,47,0.3)",
                                        borderRadius: 8,
                                        color: "#ff9070",
                                        fontSize: 13,
                                        marginBottom: 16,
                                    }}
                                >
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={status === "submitting"}
                            >
                                {status === "submitting" ? (
                                    "Sending…"
                                ) : (
                                    <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                                        <Send size={15} /> Send Message
                                    </span>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
