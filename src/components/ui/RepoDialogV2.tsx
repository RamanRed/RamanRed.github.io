"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ExternalLink, Github, X, Star } from "lucide-react";
import type { Repo } from "@/types";
import { isSafeUrl } from "@/lib/validate";
import { LANG_COLORS } from "@/lib/three-utils";

interface Props {
    repo: Repo;
    onClose: () => void;
}

export function RepoDialogV2({ repo, onClose }: Props) {
    const [readme, setReadme] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ctrl = new AbortController();
        (async () => {
            try {
                const res = await fetch(`/api/repos/${encodeURIComponent(repo.name)}/readme`, { signal: ctrl.signal });
                if (res.ok) setReadme(await res.text() || null);
                else setReadme(null);
            } catch { setReadme(null); }
            finally { setLoading(false); }
        })();
        return () => ctrl.abort();
    }, [repo.name]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const liveUrl = isSafeUrl(repo.homepage) ? repo.homepage! : null;
    const ghUrl = isSafeUrl(repo.html_url) ? repo.html_url : null;

    return (
        <div
            className="dialog-backdrop-v2"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rd-title"
        >
            <div className="dialog-v2">
                <div className="dialog-v2-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            {repo.language && (
                                <span style={{ width: 10, height: 10, borderRadius: "50%", background: LANG_COLORS[repo.language] ?? "#888", flexShrink: 0 }} />
                            )}
                            {repo.language && <span style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.05em" }}>{repo.language}</span>}
                            <span style={{ fontSize: 11, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 4 }}>
                                <Star size={11} /> {repo.stargazers_count}
                            </span>
                        </div>
                        <h2 id="rd-title" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-serif)" }}>
                            {repo.name}
                        </h2>
                        {repo.description && <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>{repo.description}</p>}
                    </div>
                    <button className="dialog-v2-close" onClick={onClose} aria-label="Close">
                        <X size={14} />
                    </button>
                </div>

                <div className="dialog-v2-body">
                    <div className="repo-dialog-links-v2">
                        {ghUrl && (
                            <a href={ghUrl} target="_blank" rel="noopener noreferrer" className="repo-link-v2 secondary">
                                <Github size={14} /> GitHub
                            </a>
                        )}
                        {liveUrl && (
                            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="repo-link-v2 primary">
                                <ExternalLink size={14} /> Live Demo
                            </a>
                        )}
                    </div>

                    {repo.topics?.length > 0 && (
                        <div className="repo-topics-v2">
                            {repo.topics.map((t) => <span key={t} className="repo-topic-v2">{t}</span>)}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ color: "var(--text-3)", fontSize: 13 }}>Loading README…</div>
                    ) : readme ? (
                        <div className="markdown-v2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                                {readme}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div style={{ color: "var(--text-3)", fontSize: 13 }}>No README available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
