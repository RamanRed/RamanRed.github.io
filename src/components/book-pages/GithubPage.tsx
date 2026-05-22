"use client";

import { Star } from "lucide-react";
import { useGithubRepos } from "@/hooks/useGithubRepos";
import { useBookState } from "@/hooks/useBookState";
import { LANG_COLORS } from "@/lib/three-utils";
import type { Repo } from "@/types";

export function GithubPage() {
    const { repos, isLoading, error } = useGithubRepos();
    const { openRepo } = useBookState();

    if (isLoading) {
        return (
            <div>
                <div className="page-section-label">Open Source</div>
                <h2 className="page-section-title">GitHub Projects</h2>
                <div className="page-divider" />
                <div style={{ color: "#7a7060", fontSize: 13, marginTop: 24 }}>
                    Loading repositories…
                </div>
            </div>
        );
    }

    if (error || repos.length === 0) {
        return (
            <div>
                <div className="page-section-label">Open Source</div>
                <h2 className="page-section-title">GitHub Projects</h2>
                <div className="page-divider" />
                <div style={{ color: "#7a7060", fontSize: 13, marginTop: 24 }}>
                    {error ? "Could not load repositories." : "No public repositories found."}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-section-label">Open Source</div>
            <h2 className="page-section-title">GitHub Projects</h2>
            <div className="page-divider" />

            <div className="repo-grid">
                {repos.slice(0, 12).map((repo: Repo) => (
                    <div
                        key={repo.id}
                        className="repo-card"
                        onClick={() => openRepo(repo)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && openRepo(repo)}
                        aria-label={`View ${repo.name} repository`}
                    >
                        <div className="repo-name">{repo.name}</div>
                        <div className="repo-desc">
                            {repo.description ?? "No description provided."}
                        </div>
                        <div className="repo-meta">
                            {repo.language && (
                                <span
                                    className="lang-dot"
                                    style={{ background: LANG_COLORS[repo.language] ?? "#888" }}
                                    title={repo.language}
                                />
                            )}
                            {repo.language && <span>{repo.language}</span>}
                            <Star size={11} />
                            <span>{repo.stargazers_count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
