"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { useGithubRepos } from "@/hooks/useGithubRepos";
import { useBookState } from "@/hooks/useBookState";
import { LANG_COLORS } from "@/lib/three-utils";
import type { Repo } from "@/types";

export function GithubSection() {
    const { repos, isLoading, error } = useGithubRepos();
    const { openRepo } = useBookState();

    return (
        <section id="github" className="section" data-scroll-section>
            <div data-loco-anim>
                <div className="section-tag">Open Source</div>
                <h2 className="section-title">GitHub<br /><em>Projects</em></h2>
                <p className="section-body" style={{ marginTop: 12 }}>
                    Public repositories — click any card to view the README and live links.
                </p>
            </div>

            {isLoading ? (
                <div style={{ marginTop: 60, color: "var(--text-3)", fontSize: 14 }}>Fetching repositories…</div>
            ) : error || repos.length === 0 ? (
                <div style={{ marginTop: 60, color: "var(--text-3)", fontSize: 14 }}>
                    {error ? "Could not load repositories." : "No public repositories found."}
                </div>
            ) : (
                <div className="repos-grid">
                    {repos.slice(0, 9).map((repo: Repo, i) => (
                        <button
                            key={repo.id}
                            className="repo-card-v2"
                            onClick={() => openRepo(repo)}
                            data-loco-anim
                            data-delay={String(Math.min((i % 3) + 1, 5))}
                            style={{ textAlign: "left", width: "100%", background: "none", font: "inherit", cursor: "pointer" }}
                            aria-label={`View ${repo.name}`}
                        >
                            <div className="repo-v2-header">
                                {repo.language && (
                                    <span
                                        className="repo-v2-lang-dot"
                                        style={{ background: LANG_COLORS[repo.language] ?? "#888" }}
                                    />
                                )}
                                <span className="repo-v2-name">{repo.name}</span>
                                <span className="repo-v2-stars">
                                    <Star size={11} />
                                    {repo.stargazers_count}
                                </span>
                            </div>
                            <div className="repo-v2-desc">
                                {repo.description ?? "No description."}
                            </div>
                            <div className="repo-v2-footer">
                                {repo.language && <span>{repo.language}</span>}
                                <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                                    View repo
                                    <span className="repo-v2-arrow"><ArrowUpRight size={13} /></span>
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
