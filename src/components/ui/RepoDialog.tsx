"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ExternalLink, Github, X, Star } from "lucide-react";
import type { Repo } from "@/types";
import { isSafeUrl } from "@/lib/validate";
import { LANG_COLORS } from "@/lib/three-utils";

interface RepoDialogProps {
    repo: Repo;
    onClose: () => void;
}

export function RepoDialog({ repo, onClose }: RepoDialogProps) {
    const [readme, setReadme] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchReadme() {
            try {
                // Use validated repo name from the repo object (already validated on server)
                const res = await fetch(`/api/repos/${encodeURIComponent(repo.name)}/readme`, {
                    signal: controller.signal,
                });
                if (res.ok) {
                    const text = await res.text();
                    setReadme(text || null);
                } else {
                    setReadme(null);
                }
            } catch {
                setReadme(null);
            } finally {
                setLoading(false);
            }
        }

        fetchReadme();
        return () => controller.abort();
    }, [repo.name]);

    // Close on backdrop click or Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const liveUrl = isSafeUrl(repo.homepage) ? repo.homepage! : null;
    const githubUrl = isSafeUrl(repo.html_url) ? repo.html_url : null;
    const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "#888") : null;

    return (
        <div
            className="dialog-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="repo-dialog-title"
        >
            <div className="dialog">
                <div className="dialog-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            {langColor && (
                                <span
                                    style={{ width: 12, height: 12, borderRadius: "50%", background: langColor, flexShrink: 0 }}
                                />
                            )}
                            {repo.language && (
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
                                    {repo.language}
                                </span>
                            )}
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 3 }}>
                                <Star size={11} /> {repo.stargazers_count}
                            </span>
                        </div>
                        <h2
                            id="repo-dialog-title"
                            style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "'Playfair Display', serif" }}
                        >
                            {repo.name}
                        </h2>
                        {repo.description && (
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                                {repo.description}
                            </p>
                        )}
                    </div>
                    <button className="dialog-close" onClick={onClose} aria-label="Close dialog">
                        <X size={16} />
                    </button>
                </div>

                <div className="dialog-body">
                    {/* Links */}
                    <div className="repo-dialog-links">
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-link-btn secondary"
                            >
                                <Github size={14} /> GitHub
                            </a>
                        )}
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-link-btn primary"
                            >
                                <ExternalLink size={14} /> Live Demo
                            </a>
                        )}
                    </div>

                    {/* Topics */}
                    {repo.topics?.length > 0 && (
                        <div className="repo-topics">
                            {repo.topics.map((tag) => (
                                <span key={tag} className="repo-topic">{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* README */}
                    {loading ? (
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading README…</div>
                    ) : readme ? (
                        <div className="markdown-body">
                            {/* rehype-sanitize strips <script>, onclick, javascript: hrefs */}
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                                {readme}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                            No README available for this repository.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
