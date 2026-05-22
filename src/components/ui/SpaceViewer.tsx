"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, RefreshCw, Layers } from "lucide-react";
import type { Deployment } from "@/types";

interface Props {
    deployment: Deployment;
    onClose: () => void;
}

export function SpaceViewer({ deployment, onClose }: Props) {
    const [loading, setLoading] = useState(true);
    const [iframeUrl, setIframeUrl] = useState("");

    useEffect(() => {
        // Cleanly format iframe URL to load Hugging Face Space in embedded mode
        let url = deployment.url;
        if (url.includes("huggingface.co/spaces/")) {
            // e.g., https://huggingface.co/spaces/RamanRed/bookprofile -> https://huggingface.co/spaces/RamanRed/bookprofile?embed=true
            if (!url.includes("?embed=true")) {
                url = `${url}${url.includes("?") ? "&" : "?"}embed=true`;
            }
        }
        setIframeUrl(url);

        // Escape key binding
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [deployment.url, onClose]);

    const handleRefresh = () => {
        setLoading(true);
        const originalUrl = iframeUrl;
        setIframeUrl("");
        setTimeout(() => setIframeUrl(originalUrl), 100);
    };

    return (
        <div
            className="dialog-backdrop-v2"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sv-title"
            style={{ zIndex: 999 }}
        >
            <div className="dialog-v2" style={{ maxWidth: 1000, width: "95vw", height: "85vh", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div className="dialog-v2-header" style={{ padding: "12px 20px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span className="hf-chip" style={{ fontSize: 9 }}>Space Deployment</span>
                            <span className="hf-server-status" style={{ fontSize: 9 }}>● Running</span>
                            <span style={{ fontSize: 10, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
                                <Layers size={10} /> CPU Basic · Free
                            </span>
                        </div>
                        <h2 id="sv-title" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--mono)" }}>
                            {deployment.name}
                        </h2>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                            onClick={handleRefresh}
                            className="hf-icon-btn"
                            title="Reload Space Application"
                            style={{ color: "var(--ink-3)", padding: 6 }}
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        </button>
                        <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hf-icon-btn"
                            title="Open in new window"
                            style={{ color: "var(--ink-3)", padding: 6, display: "flex", alignItems: "center" }}
                        >
                            <ExternalLink size={14} />
                        </a>
                        <button
                            className="dialog-v2-close"
                            onClick={onClose}
                            aria-label="Close Preview"
                            style={{ margin: 0, padding: 6 }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Sub-Header Description */}
                {deployment.description && (
                    <div style={{ padding: "0 20px 10px", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--ink-3)" }}>
                        {deployment.description}
                    </div>
                )}

                {/* Iframe Viewport */}
                <div style={{ flex: 1, position: "relative", background: "#0b0b0b", borderBottomLeftRadius: 14, borderBottomRightRadius: 14, overflow: "hidden" }}>
                    {loading && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#0f0f0f", zIndex: 5 }}>
                            <div className="hf-loading-spinner" />
                            <span style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
                                Initializing Space sandbox environments...
                            </span>
                        </div>
                    )}
                    {iframeUrl && (
                        <iframe
                            src={iframeUrl}
                            title={`Hugging Face Space: ${deployment.name}`}
                            width="100%"
                            height="100%"
                            style={{ border: "none", display: "block" }}
                            allow="accelerometer; gyroscope; microphone; camera; midi; encrypted-media; picture-in-picture"
                            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
                            onLoad={() => setLoading(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
