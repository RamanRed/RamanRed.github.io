"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { config as defaultConfig } from "@/config/portfolio";
import { useGithubRepos } from "@/hooks/useGithubRepos";
import { SpaceViewer } from "@/components/ui/SpaceViewer";
import { AdminEditor } from "@/components/ui/AdminEditor";
import type { PortfolioConfig, Deployment } from "@/types";
import {
    Edit3, LogOut, Key, ArrowRight, ShieldCheck, UserCheck,
    Sparkles, ExternalLink, Github, Linkedin, Twitter, MessageSquare,
    Search, BookOpen, Bookmark, Check, Star, Eye, EyeOff, Copy
} from "lucide-react";

// ── Language colour map ───────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
    Python: "#3572A5",
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Rust: "#dea584",
    Go: "#00ADD8",
    "C++": "#f34b7d",
    C: "#555555",
    Java: "#b07219",
    Shell: "#89e051",
    Jupyter: "#DA5B0B",
    CUDA: "#76B900",
    Dockerfile: "#384d54",
    HTML: "#e34c26",
    CSS: "#563d7c",
};

// ── HF Logo SVG ───────────────────────────────────────────────────────────────
function HFLogo({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="60" cy="60" r="60" fill="#FFD21E" />
            <ellipse cx="40" cy="48" rx="8" ry="10" fill="white" />
            <ellipse cx="80" cy="48" rx="8" ry="10" fill="white" />
            <circle cx="40" cy="50" r="4" fill="#1A1609" />
            <circle cx="80" cy="50" r="4" fill="#1A1609" />
            <path d="M38 74 Q60 92 82 74" stroke="#1A1609" strokeWidth="4" strokeLinecap="round" fill="none" />
            <rect x="16" y="32" width="12" height="6" rx="3" fill="#FF9D00" />
            <rect x="92" y="32" width="12" height="6" rx="3" fill="#FF9D00" />
        </svg>
    );
}

// ── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
    const initials = name.slice(0, 2).toUpperCase();
    return (
        <div
            style={{
                width: size, height: size,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff9d00, #ff5500)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: size * 0.38, fontWeight: 700, color: "#000",
                flexShrink: 0, fontFamily: "var(--mono)",
            }}
        >
            {initials}
        </div>
    );
}

// ── Left Sidebar ──────────────────────────────────────────────────────────────
function LeftSidebar({
    activeTab,
    setActiveTab,
    isAdmin,
    onConnectClick,
    onLogoutClick,
    onOpenEditor,
    config,
    unreadCount
}: {
    activeTab: string;
    setActiveTab: (t: string) => void;
    isAdmin: boolean;
    onConnectClick: () => void;
    onLogoutClick: () => void;
    onOpenEditor: () => void;
    config: PortfolioConfig;
    unreadCount: number;
}) {
    const navItems = [
        { icon: "○", label: "Profile", tab: "profile" },
        { icon: "□", label: "Inbox", badge: unreadCount > 0 ? String(unreadCount) : undefined, tab: "inbox" },
        { icon: "$", label: "Billing", tab: "billing" },
        { icon: "+", label: "Get PRO", accent: true, tab: "pro" },
    ];

    const resourceItems = [
        { icon: "🦜", label: "LangChain", url: "https://python.langchain.com/" },
        { icon: "🕸️", label: "LangGraph", url: "https://langchain-ai.github.io/langgraph/" },
        { icon: "👥", label: "CrewAI", url: "https://docs.crewai.com/" },
        { icon: "🌲", label: "Pinecone", url: "https://docs.pinecone.io/" },
        { icon: "🤗", label: "Hugging Face Docs", url: "https://huggingface.co/docs" },
    ];

    return (
        <aside className="hf-left-sidebar">
            {/* New button */}
            <button className="hf-new-btn" onClick={isAdmin ? onOpenEditor : onConnectClick}>
                <span>+</span> New
            </button>

            {/* Username + nav */}
            <div className="hf-sidebar-section">
                <div className="hf-sidebar-username">
                    <Avatar name={config.name} size={20} />
                    <span>{config.name}</span>
                </div>
                <nav className="hf-sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            className={`hf-sidebar-link ${activeTab === item.tab ? "active" : ""} ${item.accent ? "accent" : ""}`}
                            onClick={() => item.tab && setActiveTab(item.tab)}
                        >
                            <span className="hf-sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                            {item.badge !== undefined && (
                                <span className="hf-sidebar-badge">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Admin Connection Console (NEW) */}
            <div className="hf-sidebar-section" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                <p className="hf-sidebar-label">Database Control</p>
                {isAdmin ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--hf-green)", background: "rgba(34, 197, 94, 0.08)", padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                            <ShieldCheck size={12} />
                            <span style={{ fontWeight: 600 }}>Admin Authenticated</span>
                        </div>
                        <button className="hf-admin-btn-secondary" onClick={onOpenEditor} style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontSize: 11, padding: "5px 10px" }}>
                            <Edit3 size={11} /> Config Console
                        </button>
                        <button className="hf-sidebar-link" onClick={onLogoutClick} style={{ color: "var(--hf-red)", fontSize: 11 }}>
                            <LogOut size={11} style={{ marginRight: 6 }} /> Disconnect Admin
                        </button>
                    </div>
                ) : (
                    <button className="hf-admin-connect-sidebar" onClick={onConnectClick}>
                        <Key size={12} />
                        <span>Connect Admin Panel</span>
                    </button>
                )}
            </div>

            {/* Resources */}
            <div className="hf-sidebar-section">
                <p className="hf-sidebar-label">Resources</p>
                <nav className="hf-sidebar-nav">
                    {resourceItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hf-sidebar-link"
                        >
                            <span className="hf-sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

// ── Models Feed (GitHub repos) ────────────────────────────────────────────────
function ModelsFeed({ config }: { config: PortfolioConfig }) {
    const { repos, isLoading, error } = useGithubRepos();

    if (isLoading) return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="hf-feed-card hf-skeleton-card">
                    <div className="hf-skeleton" style={{ height: 14, width: "50%", marginBottom: 8 }} />
                    <div className="hf-skeleton" style={{ height: 11, width: "80%" }} />
                </div>
            ))}
        </div>
    );

    if (error) return (
        <div className="hf-feed-card" style={{ marginTop: 16, color: "var(--ink-3)", fontSize: 13 }}>
            Could not load repos from GitHub. Check your username in config.
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
            {repos.slice(0, 12).map((repo) => (
                <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hf-feed-item"
                >
                    <div className="hf-feed-item-icon">📦</div>
                    <div className="hf-feed-item-body">
                        <div className="hf-feed-item-title">
                            <span className="hf-feed-item-owner">{config.github.username}/</span>
                            <span className="hf-feed-item-name">{repo.name}</span>
                        </div>
                        {repo.description && (
                            <p className="hf-feed-item-desc">{repo.description}</p>
                        )}
                        <div className="hf-feed-item-meta">
                            {repo.language && (
                                <>
                                    <span
                                        className="hf-lang-dot"
                                        style={{ background: LANG_COLORS[repo.language] ?? "#888" }}
                                    />
                                    <span>{repo.language}</span>
                                    <span>·</span>
                                </>
                            )}
                            <span>⭐ {repo.stargazers_count}</span>
                            <span>·</span>
                            <span>Updated {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                    </div>
                    <span className="hf-feed-item-arrow">↗</span>
                </a>
            ))}
        </div>
    );
}

// ── Datasets Feed (About / Skills) ────────────────────────────────────────────
function DatasetsFeed({ config, isAdmin, onEditClick }: { config: PortfolioConfig; isAdmin: boolean; onEditClick: () => void }) {
    const rows = [
        ["name", config.name],
        ["role", config.title],
        ["location", config.location],
        ["email", config.email],
        ["languages", config.techStack.languages.join(", ")],
        ["frameworks", config.techStack.frameworks.join(", ")],
        ["cloud", config.techStack.cloud.join(", ")],
        ["databases", config.techStack.databases.join(", ")],
    ];

    return (
        <div style={{ marginTop: 8 }}>
            <div className="hf-feed-card" style={{ marginBottom: 12, position: "relative" }}>
                {isAdmin && (
                    <button
                        onClick={onEditClick}
                        style={{ position: "absolute", top: 12, right: 12, color: "var(--hf-yellow)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, background: "rgba(255,157,0,0.06)", border: "1px solid rgba(255,157,0,0.2)", padding: "4px 8px", borderRadius: 5 }}
                    >
                        <Edit3 size={10} /> Edit Dataset
                    </button>
                )}
                <div className="hf-card-head">
                    <span className="hf-chip" style={{ fontSize: 10 }}>parquet</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--hf-yellow)" }}>
                        {config.name.toLowerCase().replace(/\s+/g, "")}/profile-dataset
                    </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 12 }}>
                    {rows.length} rows · 2 columns · Personal profile card
                </p>
                <div className="hf-table">
                    {rows.map(([key, value]) => (
                        <div className="hf-row" key={key}>
                            <span className="hf-key">{key}</span>
                            <span className="hf-value">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* About Biography Section */}
            <div className="hf-feed-card" style={{ marginBottom: 12, position: "relative" }}>
                {isAdmin && (
                    <button
                        onClick={onEditClick}
                        style={{ position: "absolute", top: 12, right: 12, color: "var(--hf-yellow)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, background: "rgba(255,157,0,0.06)", border: "1px solid rgba(255,157,0,0.2)", padding: "4px 8px", borderRadius: 5 }}
                    >
                        <Edit3 size={10} /> Edit Biography
                    </button>
                )}
                <p style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--hf-yellow)", marginBottom: 8 }}>## Biography / About Me</p>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {config.about}
                </p>
            </div>

            <div className="hf-feed-card" style={{ position: "relative" }}>
                {isAdmin && (
                    <button
                        onClick={onEditClick}
                        style={{ position: "absolute", top: 12, right: 12, color: "var(--hf-yellow)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, background: "rgba(255,157,0,0.06)", border: "1px solid rgba(255,157,0,0.2)", padding: "4px 8px", borderRadius: 5 }}
                    >
                        <Edit3 size={10} /> Edit Tech Stack
                    </button>
                )}
                <p style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--hf-yellow)", marginBottom: 12 }}>## Tech Stack</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                        ["Languages", config.techStack.languages],
                        ["Frameworks", config.techStack.frameworks],
                        ["Cloud", config.techStack.cloud],
                        ["Databases", config.techStack.databases],
                        ["Tools", config.techStack.tools],
                    ].map(([cat, items]) => (
                        <div key={cat as string} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)", width: 80, flexShrink: 0, paddingTop: 2 }}>
                                {cat as string}
                            </span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {(items as string[]).map((s) => (
                                    <span key={s} className="hf-tag-pill">{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Spaces Feed (Deployments) ─────────────────────────────────────────────────
function SpacesFeed({ config, isAdmin, onSpaceClick, onEditClick }: { config: PortfolioConfig; isAdmin: boolean; onSpaceClick: (dep: Deployment) => void; onEditClick: () => void }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8, position: "relative" }}>
            {isAdmin && (
                <button
                    onClick={onEditClick}
                    style={{ position: "absolute", top: -38, right: 0, color: "var(--hf-yellow)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, background: "rgba(255,157,0,0.06)", border: "1px solid rgba(255,157,0,0.2)", padding: "4px 8px", borderRadius: 5, zIndex: 10 }}
                >
                    <Edit3 size={10} /> Manage Spaces
                </button>
            )}

            {config.deployments.map((dep) => (
                <div
                    key={dep.name}
                    onClick={() => onSpaceClick(dep)}
                    className="hf-feed-item"
                    style={{ cursor: "pointer" }}
                >
                    <div className="hf-feed-item-icon">🚀</div>
                    <div className="hf-feed-item-body">
                        <div className="hf-feed-item-title">
                            <span className="hf-feed-item-owner">{config.github.username}/</span>
                            <span className="hf-feed-item-name">{dep.name}</span>
                            <span className="hf-running-badge" style={{ cursor: "pointer" }}>● Interactive Test</span>
                        </div>
                        <p className="hf-feed-item-desc">{dep.description}</p>
                        <div className="hf-feed-item-meta" style={{ flexWrap: "wrap", gap: "4px 8px" }}>
                            {dep.tags.map((tag) => (
                                <span key={tag} className="hf-tag-pill" style={{ fontSize: 10 }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <span className="hf-feed-item-arrow" style={{ color: "var(--hf-yellow)" }}>preview ↗</span>
                </div>
            ))}
        </div>
    );
}

// ── Community Feed (Education + Contact + All Socials) ───────────────────────
function CommunityFeed({ config, isAdmin, onEditClick }: { config: PortfolioConfig; isAdmin: boolean; onEditClick: () => void }) {
    const [liveStats, setLiveStats] = useState<{
        leetcode: { solved: number };
        codechef: { rating: number; stars: number };
        hackerrank: { badges: number };
    } | null>(null);

    useEffect(() => {
        const leetcodeUrl = config.social.find((s) => s.platform === "leetcode")?.url || "";
        const codechefUrl = config.social.find((s) => s.platform === "codechef")?.url || "";
        const hackerrankUrl = config.social.find((s) => s.platform === "hackerrank")?.url || "";

        const leetcodeUser = leetcodeUrl.match(/leetcode\.com\/(?:u\/)?([^\/]+)/)?.[1] || "RamanRed";
        const codechefUser = codechefUrl.match(/codechef\.com\/users\/([^\/]+)/)?.[1] || "rich_wolves_49";
        const hackerrankUser = hackerrankUrl.match(/hackerrank\.com\/profile\/([^\/]+)/)?.[1] || "raman_randive23";

        fetch(`/api/stats?leetcode=${leetcodeUser}&codechef=${codechefUser}&hackerrank=${hackerrankUser}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setLiveStats(data);
                }
            })
            .catch((err) => console.error("Error loading live coding stats:", err));
    }, [config]);

    const platformMeta: Record<string, { icon: string; label: string; color: string; desc: string }> = {
        github: { icon: "⬡", label: "GitHub", color: "#e8e8e8", desc: "Code, repos & open-source contributions" },
        linkedin: { icon: "in", label: "LinkedIn", color: "#0a66c2", desc: "Professional network & career updates" },
        twitter: { icon: "𝕏", label: "X / Twitter", color: "#e8e8e8", desc: "Thoughts on AI/ML & tech" },
        instagram: { icon: "📸", label: "Instagram", color: "#e1306c", desc: "Behind the scenes & personal moments" },
        huggingface: { icon: "🤗", label: "Hugging Face", color: "#ff9d00", desc: "Models, datasets & Spaces" },
        leetcode: { icon: "💻", label: "LeetCode", color: "#ffa116", desc: "DSA practice & contest rankings" },
        codechef: { icon: "🍳", label: "CodeChef", color: "#e74c3c", desc: "Contests & algorithm training stars" },
        hackerrank: { icon: "✓", label: "HackerRank", color: "#2ec866", desc: "Certified skills verification" },
        youtube: { icon: "▶", label: "YouTube", color: "#ff0000", desc: "Tutorials, walkthroughs & demos" },
        email: { icon: "✉️", label: "Email", color: "#22c55e", desc: "Direct contact & collaboration" },
    };

    const stats = liveStats || config.codingStats || {
        leetcode: { solved: 266, rank: 45000, points: 1540 },
        codechef: { rating: 1272, stars: 1 },
        hackerrank: { badges: 5 }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8, position: "relative" }}>
            {isAdmin && (
                <button
                    onClick={onEditClick}
                    style={{ position: "absolute", top: -38, right: 0, color: "var(--hf-yellow)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, background: "rgba(255,157,0,0.06)", border: "1px solid rgba(255,157,0,0.2)", padding: "4px 8px", borderRadius: 5, zIndex: 10 }}
                >
                    <Edit3 size={10} /> Edit Socials & Training
                </button>
            )}

            {/* ── Social Links ── */}
            <div className="hf-feed-card">
                <p style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--hf-yellow)", marginBottom: 14 }}>## Connect with me</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {config.social.map((item) => {
                        const meta = platformMeta[item.platform] ?? { icon: "🔗", label: item.platform, color: "var(--ink-3)", desc: "" };
                        return (
                            <a
                                key={item.platform}
                                href={item.url}
                                target={item.url.startsWith("mailto:") ? "_self" : "_blank"}
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <div className="hf-platform-card">
                                    <span className="hf-platform-icon" style={{ color: meta.color }}>{meta.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{meta.label}</div>
                                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{meta.desc}</div>
                                    </div>
                                    <span style={{ marginLeft: "auto", color: "var(--ink-4)", fontSize: 12 }}>↗</span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* ── Dynamic Platform Stats ── */}
            <div className="hf-feed-card">
                <p style={{ fontSize: 12, fontFamily: "var(--mono)", color: "#ffa116", marginBottom: 14 }}>## Coding Stats Summary</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    <div style={{ background: "var(--bg-code)", borderRadius: 8, padding: "12px 8px", textAlign: "center", border: "1px solid #ffa11630" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#ffa116", fontFamily: "var(--mono)" }}>{stats.leetcode?.solved}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>LeetCode Solved</div>
                    </div>
                    <div style={{ background: "var(--bg-code)", borderRadius: 8, padding: "12px 8px", textAlign: "center", border: "1px solid #e74c3c30" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#e74c3c", fontFamily: "var(--mono)" }}>{stats.codechef?.rating}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>Chef Rating ({stats.codechef?.stars}★)</div>
                    </div>
                    <div style={{ background: "var(--bg-code)", borderRadius: 8, padding: "12px 8px", textAlign: "center", border: "1px solid #2ec86630" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#2ec866", fontFamily: "var(--mono)" }}>{stats.hackerrank?.badges || 6}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>HR Gold Badges</div>
                    </div>
                </div>
            </div>

            {/* ── Education ── */}
            <div className="hf-feed-card">
                <p style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--hf-yellow)", marginBottom: 12 }}>## Training Runs (Education)</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {config.education.map((edu) => (
                        <div key={edu.institution} style={{ borderLeft: "2px solid var(--hf-yellow)", paddingLeft: 12 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{edu.degree}</div>
                            <div style={{ fontSize: 12, color: "var(--hf-yellow)", margin: "2px 0" }}>{edu.institution}</div>
                            {edu.description && <p style={{ fontSize: 12, color: "var(--ink-3)" }}>{edu.description}</p>}
                            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--ink-4)" }}>{edu.year}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Resume Download ── */}
            <a href="/resume.pdf" download className="hf-resume-download">
                <span>📄</span>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Download Resume</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{config.resumeFilename || "RamanRandive_Resume.pdf"}</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 16 }}>↓</span>
            </a>

        </div>
    );
}

// ── Center Feed ───────────────────────────────────────────────────────────────
function CenterFeed({
    config,
    isAdmin,
    onSpaceClick,
    onEditClick
}: {
    config: PortfolioConfig;
    isAdmin: boolean;
    onSpaceClick: (dep: Deployment) => void;
    onEditClick: () => void;
}) {
    const contentTabs = ["Models", "Datasets", "Spaces", "Community"];
    const [contentTab, setContentTab] = useState("Spaces"); // Load interactive Spaces by default for impressive look!

    return (
        <div className="hf-center-feed">
            {/* Following header */}
            <div className="hf-feed-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar name={config.name} size={22} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Following</span>
                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>0 ▾</span>
                    <span className="hf-chip" style={{ fontSize: 9, marginLeft: "auto", background: "rgba(255, 210, 30, 0.05)" }}>
                        🤗 huggingface.co/{config.name.toLowerCase().replace(/\s+/g, "")}
                    </span>
                </div>
            </div>

            {/* Content type tabs */}
            <div className="hf-content-tabs">
                {contentTabs.map((tab) => (
                    <button
                        key={tab}
                        className={`hf-content-tab ${contentTab === tab ? "active" : ""}`}
                        onClick={() => setContentTab(tab)}
                    >
                        {tab === "Models" && <span style={{ marginRight: 4 }}>⬡</span>}
                        {tab === "Datasets" && <span style={{ marginRight: 4 }}>🗄</span>}
                        {tab === "Spaces" && <span style={{ marginRight: 4 }}>🚀</span>}
                        {tab === "Community" && <span style={{ marginRight: 4 }}>💬</span>}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Switchboard */}
            {contentTab === "Models" && <ModelsFeed config={config} />}
            {contentTab === "Datasets" && <DatasetsFeed config={config} isAdmin={isAdmin} onEditClick={onEditClick} />}
            {contentTab === "Spaces" && <SpacesFeed config={config} isAdmin={isAdmin} onSpaceClick={onSpaceClick} onEditClick={onEditClick} />}
            {contentTab === "Community" && <CommunityFeed config={config} isAdmin={isAdmin} onEditClick={onEditClick} />}
        </div>
    );
}

// ── Right Trending Panel ──────────────────────────────────────────────────────
function RightPanel({ config }: { config: PortfolioConfig }) {
    const trendingTabs = ["All", "Models", "Datasets", "Spaces"];
    const [trendTab, setTrendTab] = useState("All");

    const trending = [
        { name: "Qwen/Qwen2.5-Coder-32B", type: "Text-Generation", updated: "3 days", likes: "1.2M", icon: "⬡" },
        { name: "deepseek-ai/DeepSeek-V3", type: "Text-Generation", updated: "5 days", likes: "890k", icon: "🤗" },
        { name: `RamanRed/weapon_detection_space`, type: "Computer-Vision", updated: "Active", likes: "2.4k", icon: "🚀" },
        { name: `RamanRed/openenvs`, type: "Reinforcement-Learning", updated: "Live App", likes: "847", icon: "📦" },
        { name: `RamanRed/train_dataset_weapon`, type: "Computer-Vision", updated: "Active", likes: "312", icon: "🚀" },
    ];

    return (
        <aside className="hf-right-panel">
            <div className="hf-right-header">
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>📈 Trending Deployments</span>
                <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>online</span>
            </div>

            <div className="hf-trend-tabs">
                {trendingTabs.map((t) => (
                    <button
                        key={t}
                        className={`hf-trend-tab ${trendTab === t ? "active" : ""}`}
                        onClick={() => setTrendTab(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="hf-trend-list">
                {trending.map((item, i) => {
                    const isSpace = item.name.includes("RamanRed/") && (item.name.includes("_space") || item.name.includes("openenvs"));
                    const isDataset = item.name.includes("dataset");
                    const baseUrl = isSpace 
                        ? `https://huggingface.co/spaces/${item.name}` 
                        : isDataset 
                        ? `https://huggingface.co/datasets/${item.name}` 
                        : `https://huggingface.co/${item.name}`;

                    return (
                        <a 
                            key={item.name} 
                            href={baseUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hf-trend-item-link"
                            style={{ textDecoration: "none", color: "inherit", display: "block" }}
                        >
                            <div className="hf-trend-item">
                                <span className="hf-trend-rank">{i + 1}</span>
                                <span className="hf-trend-icon">{item.icon}</span>
                                <div className="hf-trend-body">
                                    <div className="hf-trend-name" style={{ display: "flex", alignItems: "center", justifyContent: "between", gap: 4 }}>
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                                        <ExternalLink size={10} style={{ opacity: 0.4, flexShrink: 0 }} />
                                    </div>
                                    <div className="hf-trend-meta">
                                        <span>{item.type}</span>
                                        <span>· ♥ {item.likes}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </aside>
    );
}

// ── Billing Section (Hire me for project) ──────────────────────────────────────
function BillingSection({ config }: { config: PortfolioConfig }) {
    return (
        <div className="hf-center-feed animate-fade-in" style={{ padding: "20px 24px" }}>
            <div className="hf-feed-header" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>💳</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>huggingface.co/settings/billing</span>
                    <span className="hf-chip" style={{ fontSize: 9, marginLeft: "auto", background: "rgba(34, 197, 94, 0.08)", color: "var(--hf-green)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>● Open for Projects</span>
                </div>
            </div>

            <div className="hf-feed-card" style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(255, 157, 0, 0.06) 0%, rgba(15, 15, 15, 0.5) 100%)", border: "1px solid rgba(255, 157, 0, 0.2)" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 32 }}>💼</div>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--hf-yellow)", marginBottom: 4 }}>Hire Raman for Your AI/ML Project!</h2>
                        <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>
                            {"Are you looking to fine-tune open-source models, build custom RAG pipelines, or deploy secure AI APIs? I am open for freelance, contract, and consulting roles! Let's build something impressive together."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="hf-feed-card" style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--hf-yellow)", marginBottom: 12 }}>## Services & Core Capabilities</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: "var(--bg-code)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "var(--ink)", marginBottom: 4 }}>⚙️ LLM Fine-Tuning & PEFT</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.4 }}>
                            Fine-tuning Llama, Mistral, Qwen, and custom sentence-transformers using LoRA, QLoRA, and custom evaluations.
                        </div>
                    </div>
                    <div style={{ background: "var(--bg-code)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "var(--ink)", marginBottom: 4 }}>🧠 Retrieval-Augmented Gen (RAG)</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.4 }}>
                            Building vector database architectures with Pinecone, FAISS, PGVector, utilizing advanced semantic chunking and re-ranking.
                        </div>
                    </div>
                    <div style={{ background: "var(--bg-code)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "var(--ink)", marginBottom: 4 }}>🚀 High-Performance Deployments</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.4 }}>
                            Packaging models as lightweight APIs using FastAPI, Docker, and Gradio, optimized for serverless space environments.
                        </div>
                    </div>
                    <div style={{ background: "var(--bg-code)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "var(--ink)", marginBottom: 4 }}>🌐 Full-Stack AI Integration</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.4 }}>
                            Combining modern Next.js/React frontends with AI models, database synchronization (Supabase/Postgres), and real-time streams.
                        </div>
                    </div>
                </div>
            </div>

            <div className="hf-feed-card" style={{ textAlign: "center", padding: "24px 20px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <span style={{ fontSize: 18 }}>💬</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Ready to collaborate?</h3>
                <p style={{ fontSize: 11, color: "var(--ink-3)", maxWidth: 360, margin: "0 auto 14px" }}>
                    Reach out with your project specifications, timeline, and budget. I will review and get back to you within 24 hours!
                </p>
                <a href={`mailto:${config.email}?subject=Project%20Hiring%20Inquiry`} className="hf-admin-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 11, padding: "8px 20px", borderRadius: 8 }}>
                    <span>Send Project Proposal</span> ↗
                </a>
            </div>
        </div>
    );
}

// ── Inbox Section ─────────────────────────────────────────────────────────────
// ── News Feed Types & Initial Data ───────────────────────────────────────────
interface NewsArticle {
    id: number;
    title: string;
    sender: string;
    source: "substack" | "medium";
    author: string;
    date: string;
    unread: boolean;
    bookmarked: boolean;
    summary: string;
    body: string;
    link: string;
    readTime: string;
}

const INITIAL_NEWS: NewsArticle[] = [
    {
        id: 1,
        sender: "Ahead of AI (Substack)",
        source: "substack",
        author: "Sebastian Raschka",
        title: "Understanding LoRA: Parameter-Efficient Fine-Tuning under the Hood",
        date: "May 20, 2026",
        unread: true,
        bookmarked: false,
        summary: "An in-depth analysis of low-rank adaptation mechanics, rank selections (r), scaling factors (alpha), and how LoRA saves up to 90% of GPU memory in modern LLM fine-tuning pipelines.",
        body: "Low-Rank Adaptation (LoRA) has become the de facto standard for fine-tuning large language models efficiently. By freezing the pre-trained model weights and injecting trainable rank decomposition matrices into each layer of the Transformer architecture, LoRA drastically reduces the number of trainable parameters for downstream tasks.\n\nKey Takeaways:\n1. Weight updates are decomposed into two low-rank matrices A and B: ΔW = B × A.\n2. Saves tremendous GPU memory because optimizer states for base weights don't need storing.\n3. The scaling factor α governs weight contribution; typical values match or double r.",
        link: "https://magazine.sebastianraschka.com/p/understanding-lora-and-llma-finetuning",
        readTime: "8 min read"
    },
    {
        id: 2,
        sender: "Towards Data Science (Medium)",
        source: "medium",
        author: "Ariadna de Senespleda",
        title: "Building Production-Grade RAG: Graph-Based Vector Indexes & Hybrid Search",
        date: "May 18, 2026",
        unread: true,
        bookmarked: false,
        summary: "Explore the practical trade-offs between HNSW, IVF-Flat, and emerging Graph-based indexing techniques (like PGVector & Pinecone) when handling millions of multi-modal document chunks.",
        body: "Retrieval-Augmented Generation (RAG) is transitioning from simple demo apps to complex production systems. Standard vector search is no longer sufficient. This deep dive covers high-performance indexing and query pipelines to optimize relevancy, latency, and memory footprint.\n\nKey Takeaways:\n1. Hybrid search combining BM25 keyword matching and dense vector embeddings yields the best retrieval relevance.\n2. Graph-based indexes (HNSW) offer fast query latency but suffer from memory overhead and slow index build times.\n3. Chunking strategies (e.g. semantic chunking based on sentences) dramatically reduce noise in retrieval steps.",
        link: "https://towardsdatascience.com/",
        readTime: "12 min read"
    },
    {
        id: 3,
        sender: "Interconnects (Substack)",
        source: "substack",
        author: "Nathan Lambert",
        title: "The Llama-3.x Era: RLHF, DPO, and the Battle for Open-Weights Alignment",
        date: "May 15, 2026",
        unread: false,
        bookmarked: false,
        summary: "Comparing direct preference optimization (DPO) and reinforcement learning from human feedback (RLHF) strategies used to align recent open models, highlighting reward modeling trade-offs.",
        body: "The landscape of open-weights models has undergone massive changes with advanced alignment techniques. While supervised fine-tuning (SFT) establishes basic instruction following, reinforcement learning with direct preference models takes these models to state-of-the-art levels.\n\nKey Takeaways:\n1. DPO removes the need for a separate reward model, optimizing the policy directly from preference pairs.\n2. Hybrid schemes (e.g. running RLHF with PPO after DPO) still yield the highest instruction-following safety scores.\n3. Aligning reasoning models (like DeepSeek-R1 styles) requires structured reinforcement learning on chain-of-thought tokens.",
        link: "https://www.interconnects.ai/",
        readTime: "10 min read"
    },
    {
        id: 4,
        sender: "Latent Space (Substack)",
        source: "substack",
        author: "Swyx & Alessio",
        title: "The Rise of AI Agents: From Text Generators to Action-Oriented Systems",
        date: "May 10, 2026",
        unread: false,
        bookmarked: true,
        summary: "An exploration of LLM tool-use, function-calling API loops, and memory architectures that enable self-correcting autonomous software development agents.",
        body: "Generative AI is shifting from static passive assistance to active agency. Developers are designing multi-step agent workflows using specialized prompting structures (ReAct), micro-agent orchestration frameworks, and cognitive loop execution.\n\nKey Takeaways:\n1. Tool-use capabilities rely on specialized fine-tuning for structured output generation (JSON/XML/tool blocks).\n2. Multi-agent frameworks (like AutoGen, CrewAI) improve reliability by distributing roles and encouraging debate.\n3. Long-term memory mechanisms (e.g. episodic databases) are crucial for agent state preservation over long tasks.",
        link: "https://www.latentspace.fm/",
        readTime: "15 min read"
    },
    {
        id: 5,
        sender: "LlamaIndex Blog (Medium)",
        source: "medium",
        author: "Jerry Liu",
        title: "Advanced Semantic Re-ranking & Agentic RAG Architectures",
        date: "May 08, 2026",
        unread: false,
        bookmarked: false,
        summary: "How to deploy two-stage retrieval systems in enterprise contexts, combining fast first-stage vector search with high-precision neural rankers (Cohere, BGE-Reranker).",
        body: "In high-accuracy search contexts, standard vector similarity fails to capture fine-grained relevance. A two-stage architecture solves this: retrieve a broad set of candidates quickly, then run a deep cross-encoder re-ranker over the top results to bubble up the best answer.\n\nKey Takeaways:\n1. Cross-encoder re-rankers are computationally expensive but extremely accurate at capturing token interaction.\n2. Integrating a second-stage re-ranker consistently boosts Mean Reciprocal Rank (MRR) by 15-20%.\n3. Agentic RAG workflows can dynamically decide whether to invoke a re-ranking stage or fallback to raw search.",
        link: "https://medium.com/llamaindex-blog",
        readTime: "9 min read"
    }
];

// ── Inbox Section (Curated AI/ML News Feeds) ───────────────────────────────────
function InboxSection({
    config,
    news,
    setNews
}: {
    config: PortfolioConfig;
    news: NewsArticle[];
    setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "substack" | "medium" | "bookmarked" | "unread">("all");
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Filter and search logic
    const filteredNews = news.filter(item => {
        const matchesSearch = 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        if (activeFilter === "substack") return item.source === "substack";
        if (activeFilter === "medium") return item.source === "medium";
        if (activeFilter === "bookmarked") return item.bookmarked;
        if (activeFilter === "unread") return item.unread;
        return true;
    });

    const toggleRead = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNews(prev => prev.map(item => 
            item.id === id ? { ...item, unread: !item.unread } : item
        ));
    };

    const toggleBookmark = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNews(prev => prev.map(item => 
            item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
        ));
    };

    const handleCopy = (id: number, link: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCardClick = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
        // Automatically mark as read when expanded
        setNews(prev => prev.map(item => 
            item.id === id && item.unread ? { ...item, unread: false } : item
        ));
    };

    const markAllRead = () => {
        setNews(prev => prev.map(item => ({ ...item, unread: false })));
    };

    const totalUnread = news.filter(n => n.unread).length;

    return (
        <div className="hf-center-feed animate-fade-in" style={{ padding: "20px 24px" }}>
            <div className="hf-feed-header" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>📬</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>huggingface.co/settings/inbox</span>
                    {totalUnread > 0 && (
                        <span className="hf-sidebar-badge" style={{ background: "var(--hf-yellow)", color: "#000", fontWeight: 700, marginLeft: 6 }}>
                            {totalUnread} new
                        </span>
                    )}
                </div>
                {totalUnread > 0 && (
                    <button 
                        onClick={markAllRead} 
                        className="hf-admin-btn-secondary" 
                        style={{ fontSize: 11, padding: "5px 12px", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer" }}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Newsletter Feed Description Card */}
            <div className="hf-feed-card" style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(255, 157, 0, 0.05) 0%, rgba(21, 21, 21, 0.8) 100%)", border: "1px solid rgba(255, 157, 0, 0.1)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 24, padding: 8, background: "rgba(255, 157, 0, 0.1)", borderRadius: 8 }}>📖</span>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Curated AI & ML Publications Feed</h4>
                        <p style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
                            Staying abreast of state-of-the-art AI. Real-world insights directly aggregated from leading technical journals, newsletters, and publications on Substack and Medium.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                <div style={{ position: "relative", width: "100%" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center" }}>
                        <Search size={14} />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search publications, titles, key concepts..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px 8px 34px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--bg-elev)",
                            color: "var(--ink)",
                            fontSize: 12,
                            outline: "none",
                            transition: "border-color 0.2s",
                        }}
                    />
                </div>

                {/* Filter Row */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(["all", "substack", "medium", "bookmarked", "unread"] as const).map(filter => {
                        const count = news.filter(n => {
                            if (filter === "substack") return n.source === "substack";
                            if (filter === "medium") return n.source === "medium";
                            if (filter === "bookmarked") return n.bookmarked;
                            if (filter === "unread") return n.unread;
                            return true;
                        }).length;

                        const label = 
                            filter === "all" ? "All Feeds" :
                            filter === "substack" ? "Substack" :
                            filter === "medium" ? "Medium" :
                            filter === "bookmarked" ? "Bookmarks" : "Unread";

                        const isActive = activeFilter === filter;

                        return (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontSize: 11,
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    border: isActive ? "1px solid var(--hf-yellow)" : "1px solid var(--border)",
                                    background: isActive ? "rgba(255, 157, 0, 0.08)" : "var(--bg-elev)",
                                    color: isActive ? "var(--hf-yellow)" : "var(--ink-2)",
                                    cursor: "pointer",
                                    fontWeight: isActive ? 700 : 500,
                                    transition: "all 0.15s ease",
                                }}
                            >
                                <span>{label}</span>
                                <span style={{ 
                                    fontSize: 9, 
                                    background: isActive ? "var(--hf-yellow)" : "rgba(255, 255, 255, 0.08)", 
                                    color: isActive ? "#000" : "var(--ink-3)", 
                                    padding: "1px 5px", 
                                    borderRadius: 4,
                                    fontWeight: 700
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Newsletter Feed Cards List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredNews.length === 0 ? (
                    <div className="hf-feed-card" style={{ padding: "40px 20px", textAlign: "center" }}>
                        <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>🔍</span>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>No articles match your criteria</h4>
                        <p style={{ fontSize: 11, color: "var(--ink-3)" }}>Try adjusting your search queries or resetting filters.</p>
                    </div>
                ) : (
                    filteredNews.map(item => {
                        const isExpanded = expandedId === item.id;
                        
                        // Pick border accent style based on source & read status
                        const getLeftBorder = () => {
                            if (item.unread) return "3px solid var(--hf-yellow)";
                            if (item.source === "substack") return "1px solid #FF6719";
                            return "1px solid #02B875";
                        };

                        return (
                            <div 
                                key={item.id} 
                                className="hf-feed-card animate-fade-in" 
                                onClick={() => handleCardClick(item.id)}
                                style={{ 
                                    cursor: "pointer", 
                                    borderLeft: getLeftBorder(), 
                                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: isExpanded ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "none",
                                    transform: isExpanded ? "scale(1.01)" : "scale(1)",
                                    background: isExpanded ? "#1b1b1b" : "var(--bg-elev)",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        {/* Dynamic Source badge styling */}
                                        <span style={{ 
                                            fontSize: 9, 
                                            fontWeight: 800, 
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                            padding: "2px 6px", 
                                            borderRadius: 4,
                                            background: item.source === "substack" 
                                                ? "linear-gradient(135deg, rgba(255, 103, 25, 0.15) 0%, rgba(255, 103, 25, 0.05) 100%)" 
                                                : "linear-gradient(135deg, rgba(2, 184, 117, 0.15) 0%, rgba(2, 184, 117, 0.05) 100%)",
                                            color: item.source === "substack" ? "#FF6719" : "#02B875",
                                            border: item.source === "substack" ? "1px solid rgba(255, 103, 25, 0.2)" : "1px solid rgba(2, 184, 117, 0.2)",
                                            fontFamily: "var(--mono)"
                                        }}>
                                            {item.source}
                                        </span>
                                        <span style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600 }}>{item.sender}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 11, color: "var(--ink-4)", fontFamily: "var(--mono)" }}>{item.date}</span>
                                        
                                        {/* Bookmark trigger */}
                                        <button
                                            onClick={(e) => toggleBookmark(item.id, e)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: item.bookmarked ? "#EAB308" : "var(--ink-4)",
                                                cursor: "pointer",
                                                padding: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "color 0.15s"
                                            }}
                                            title={item.bookmarked ? "Remove Bookmark" : "Bookmark Article"}
                                        >
                                            <Star size={13} fill={item.bookmarked ? "#EAB308" : "none"} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ 
                                    fontWeight: item.unread ? 800 : 700, 
                                    fontSize: 13, 
                                    color: item.unread ? "var(--hf-yellow)" : "var(--ink)", 
                                    marginBottom: 6,
                                    lineHeight: 1.4,
                                }}>
                                    {item.title}
                                </div>
                                
                                <p style={{ 
                                    fontSize: 11, 
                                    color: "var(--ink-3)", 
                                    lineHeight: 1.5,
                                    margin: 0,
                                    display: "-webkit-box",
                                    WebkitLineClamp: isExpanded ? "none" : 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {item.summary}
                                </p>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, flexWrap: "wrap", gap: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 10, color: "var(--ink-4)", background: "rgba(255, 255, 255, 0.04)", padding: "2px 6px", borderRadius: 4, fontFamily: "var(--mono)" }}>
                                            ✍️ {item.author}
                                        </span>
                                        <span style={{ fontSize: 10, color: "var(--ink-4)", fontFamily: "var(--mono)" }}>
                                            ⏱ {item.readTime}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 10, color: "var(--hf-yellow)", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                                        {isExpanded ? "Collapse View ▲" : "Expand Summary ▼"}
                                    </span>
                                </div>

                                {/* Expanded body region */}
                                {isExpanded && (
                                    <div 
                                        onClick={(e) => e.stopPropagation()} 
                                        style={{ 
                                            marginTop: 14, 
                                            paddingTop: 14, 
                                            borderTop: "1px solid var(--border)",
                                            cursor: "default"
                                        }}
                                    >
                                        <div style={{ 
                                            background: "#121212", 
                                            border: "1px solid rgba(255,255,255,0.03)", 
                                            borderRadius: 8, 
                                            padding: 12, 
                                            fontSize: 11, 
                                            color: "var(--ink-2)", 
                                            lineHeight: 1.6, 
                                            fontFamily: "var(--mono)",
                                            whiteSpace: "pre-line",
                                            marginBottom: 14
                                        }}>
                                            {item.body}
                                        </div>

                                        {/* Action options */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={(e) => toggleRead(item.id, e)}
                                                    className="hf-admin-btn-secondary"
                                                    style={{ 
                                                        display: "inline-flex", 
                                                        alignItems: "center", 
                                                        gap: 6, 
                                                        fontSize: 10, 
                                                        padding: "6px 12px", 
                                                        borderRadius: 6,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    {item.unread ? <Eye size={12} /> : <EyeOff size={12} />}
                                                    <span>{item.unread ? "Mark as Read" : "Mark as Unread"}</span>
                                                </button>
                                                <button
                                                    onClick={(e) => handleCopy(item.id, item.link, e)}
                                                    className="hf-admin-btn-secondary"
                                                    style={{ 
                                                        display: "inline-flex", 
                                                        alignItems: "center", 
                                                        gap: 6, 
                                                        fontSize: 10, 
                                                        padding: "6px 12px", 
                                                        borderRadius: 6,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    {copiedId === item.id ? <Check size={12} style={{ color: "var(--hf-green)" }} /> : <Copy size={12} />}
                                                    <span>{copiedId === item.id ? "Link Copied!" : "Copy Source URL"}</span>
                                                </button>
                                            </div>
                                            
                                            <a 
                                                href={item.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="hf-admin-btn-primary" 
                                                style={{ 
                                                    display: "inline-flex", 
                                                    alignItems: "center", 
                                                    gap: 6, 
                                                    textDecoration: "none", 
                                                    fontSize: 10, 
                                                    padding: "6px 14px", 
                                                    borderRadius: 6,
                                                    background: item.source === "substack" ? "#FF6719" : "#02B875",
                                                    color: "#fff",
                                                    border: "none",
                                                }}
                                            >
                                                <span>Read Publication</span>
                                                <ExternalLink size={11} />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// ── Pro Section ───────────────────────────────────────────────────────────────
function ProSection({ config }: { config: PortfolioConfig }) {
    return (
        <div className="hf-center-feed animate-fade-in" style={{ padding: "20px 24px" }}>
            <div className="hf-feed-header" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>✨</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>huggingface.co/pro/raman</span>
                </div>
            </div>

            <div className="hf-feed-card" style={{ background: "linear-gradient(135deg, rgba(255, 210, 30, 0.1) 0%, rgba(15, 15, 15, 0.5) 100%)", border: "1px solid rgba(255, 210, 30, 0.2)", padding: 24, borderRadius: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="hf-chip animate-pulse" style={{ background: "var(--hf-yellow)", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px" }}>PRO STATUS ENABLED</span>
                    <span style={{ fontSize: 24 }}>🤗</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--ink)", marginBottom: 6 }}>Hugging Face PRO Account</h2>
                <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 14 }}>
                    Your account is supercharged! Enjoy priority CPU/GPU Autotrain training pipelines, persistent inference API endpoints, and unlimited spaces execution.
                </p>

                <div style={{ marginBottom: 14, background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--ink-3)" }}>Registered HF Email:</span>
                    <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--hf-yellow)", fontWeight: 700 }}>
                        {config.codingStats?.huggingface?.email || "ramanrandive2004@gmail.com"}
                    </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span className="hf-tag-pill" style={{ background: "rgba(255, 255, 255, 0.06)", fontSize: 10 }}>Priority AutoTrain</span>
                    <span className="hf-tag-pill" style={{ background: "rgba(255, 255, 255, 0.06)", fontSize: 10 }}>Persistent Spaces</span>
                    <span className="hf-tag-pill" style={{ background: "rgba(255, 255, 255, 0.06)", fontSize: 10 }}>Inference API Pro</span>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    // Fetch dynamic portfolio config with default config as fallbackData
    const { data: portfolioConfig, mutate: mutateConfig } = useSWR<PortfolioConfig>(
        "/api/portfolio",
        fetcher,
        {
            fallbackData: defaultConfig,
            revalidateOnFocus: false
        }
    );

    const activeConfig = portfolioConfig || defaultConfig;

    // Admin Access Management States
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAdminEditor, setShowAdminEditor] = useState(false);
    const [showRedirectModal, setShowRedirectModal] = useState(false);

    // Form login details
    const [loginEmail, setLoginEmail] = useState("xyz@gmail.com");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginStep, setLoginStep] = useState<1 | 2>(1);

    // Easter egg redirect social handles
    const [redirectEmail, setRedirectEmail] = useState("");

    // Active deployment selection for iframe viewing
    const [selectedSpace, setSelectedSpace] = useState<Deployment | null>(null);

    // Reset login step when modal visibility changes
    useEffect(() => {
        if (!showLoginModal) {
            setLoginStep(1);
            setLoginError("");
            setLoginPassword("");
            setLoginEmail("xyz@gmail.com");
        }
    }, [showLoginModal]);

    // Securely check if session cookie is active on client mount
    useEffect(() => {
        fetch("/api/auth")
            .then((res) => res.json())
            .then((data) => {
                if (data.isAdmin) {
                    setIsAdmin(true);
                }
            })
            .catch((err) => console.error("Client session check failed:", err));
    }, []);

    // Perform Admin Login authentication request
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");

        const targetEmail = loginEmail.toLowerCase().trim();

        if (loginStep === 1) {
            if (targetEmail === "ramanrandive2004@gmail.com" || targetEmail === "raman.randive23@pccoepune.org") {
                setLoginStep(2);
            } else {
                // Non-admin visitor directly triggers the easter egg popup redirect!
                setRedirectEmail(loginEmail);
                setShowLoginModal(false);
                setShowRedirectModal(true);
                setLoginEmail("xyz@gmail.com");
                setLoginPassword("");
            }
            return;
        }

        // Step 2: Password verification
        setLoggingIn(true);
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: targetEmail, password: loginPassword })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Successful admin login
                setIsAdmin(true);
                setShowLoginModal(false);
                setLoginEmail("xyz@gmail.com");
                setLoginPassword("");
                setLoginStep(1);
            } else {
                setLoginError(data.error || "Authentication failed.");
            }
        } catch (err) {
            console.error("Login connection error:", err);
            setLoginError("Failed to connect to authentication API.");
        } finally {
            setLoggingIn(false);
        }
    };

    // Logout and clear authentication cookie
    const handleLogout = () => {
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        setIsAdmin(false);
        setShowAdminEditor(false);
    };

    const navTabs = [
        { label: "Models", icon: "⬡", url: "https://huggingface.co/models" },
        { label: "Datasets", icon: "🗄", url: "https://huggingface.co/datasets" },
        { label: "Spaces", icon: "🚀", url: "https://huggingface.co/spaces" },
        { label: "Community", icon: "💬", url: "https://huggingface.co/posts" },
        { label: "Docs", icon: "", url: "https://huggingface.co/docs" },
        { label: "Enterprise", icon: "", url: "https://huggingface.co/enterprise" },
        { label: "Pricing", icon: "", url: "https://huggingface.co/pricing" },
    ];
    const [activeSidebarTab, setActiveSidebarTab] = useState("profile");

    const [news, setNews] = useState<NewsArticle[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("hf_portfolio_news");
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {}
            }
        }
        return INITIAL_NEWS;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("hf_portfolio_news", JSON.stringify(news));
        }
    }, [news]);

    const unreadNewsCount = news.filter(n => n.unread).length;

    // Retrieve specific social url by platform
    const getSocialUrl = (platform: string): string => {
        const found = activeConfig.social.find((s) => s.platform === platform);
        return found ? found.url : "#";
    };

    return (
        <>
            {/* ── Top Navbar ── */}
            <header className="hf-topbar">
                <div className="hf-topbar-left">
                    <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer" className="hf-topbar-logo">
                        <HFLogo size={24} />
                        <span>Hugging Face</span>
                    </a>
                    <div className="hf-search-box">
                        <span className="hf-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search models, datasets, users..."
                            className="hf-search-input"
                            readOnly
                        />
                    </div>
                </div>

                <nav className="hf-topbar-nav">
                    {navTabs.map((tab) => (
                        <a 
                            key={tab.label} 
                            href={tab.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hf-topbar-tab"
                        >
                            {tab.icon && <span>{tab.icon} </span>}
                            {tab.label}
                        </a>
                    ))}
                </nav>

                <div className="hf-topbar-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {isAdmin ? (
                        <button
                            onClick={() => setShowAdminEditor(true)}
                            className="hf-admin-badge-btn"
                            title="Open Admin Config Panel"
                        >
                            <ShieldCheck size={14} />
                            <span>Console</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="hf-connect-btn-top"
                            title="Sign in to Admin Dashboard"
                        >
                            <Key size={12} />
                            <span>Connect</span>
                        </button>
                    )}
                    <Avatar name={activeConfig.name} size={30} />
                </div>
            </header>

            {/* ── App Layout ── */}
            <div className="hf-app-layout">
                <LeftSidebar
                    activeTab={activeSidebarTab}
                    setActiveTab={setActiveSidebarTab}
                    isAdmin={isAdmin}
                    onConnectClick={() => setShowLoginModal(true)}
                    onLogoutClick={handleLogout}
                    onOpenEditor={() => setShowAdminEditor(true)}
                    config={activeConfig}
                    unreadCount={unreadNewsCount}
                />
                {activeSidebarTab === "profile" ? (
                    <CenterFeed
                        config={activeConfig}
                        isAdmin={isAdmin}
                        onSpaceClick={(dep) => setSelectedSpace(dep)}
                        onEditClick={() => setShowAdminEditor(true)}
                    />
                ) : activeSidebarTab === "billing" ? (
                    <BillingSection config={activeConfig} />
                ) : activeSidebarTab === "inbox" ? (
                    <InboxSection config={activeConfig} news={news} setNews={setNews} />
                ) : activeSidebarTab === "pro" ? (
                    <ProSection config={activeConfig} />
                ) : (
                    <CenterFeed
                        config={activeConfig}
                        isAdmin={isAdmin}
                        onSpaceClick={(dep) => setSelectedSpace(dep)}
                        onEditClick={() => setShowAdminEditor(true)}
                    />
                )}
                <RightPanel config={activeConfig} />
            </div>

            {/* ── Interactive Space Embedded iframe Viewer ── */}
            {selectedSpace && (
                <SpaceViewer
                    deployment={selectedSpace}
                    onClose={() => setSelectedSpace(null)}
                />
            )}

            {/* ── Administrative Profile Config Editor console ── */}
            {showAdminEditor && (
                <AdminEditor
                    initialConfig={activeConfig}
                    onClose={() => setShowAdminEditor(false)}
                    onSaveSuccess={(updated) => {
                        mutateConfig(updated, false);
                        setShowAdminEditor(false);
                    }}
                />
            )}

            {/* ── Admin Login Modal Dialog ── */}
            {showLoginModal && (
                <div
                    className="dialog-backdrop-v2"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="dialog-v2" style={{ maxWidth: 400, padding: "24px 30px" }}>
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <HFLogo size={44} />
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginTop: 10 }}>Connect Admin Console</h2>
                            <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>Verify credentials to modify streaks, resume, and spaces.</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {loginStep === 1 ? (
                                <div className="animate-fade-in">
                                    <label className="hf-admin-label">Access Email</label>
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="xyz@gmail.com"
                                        required
                                        className="hf-admin-input"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    <div style={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center", 
                                        background: "rgba(255, 255, 255, 0.03)", 
                                        padding: "10px 14px", 
                                        borderRadius: 8, 
                                        border: "1px solid var(--border)", 
                                        fontFamily: "var(--mono)"
                                    }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: 9, color: "var(--ink-4)", textTransform: "uppercase", fontWeight: 700 }}>Access Account</span>
                                            <span style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 600 }}>{loginEmail}</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setLoginStep(1)} 
                                            style={{ 
                                                fontSize: 10, 
                                                color: "var(--hf-yellow)", 
                                                background: "rgba(255, 157, 0, 0.1)", 
                                                border: "1px solid rgba(255, 157, 0, 0.2)", 
                                                borderRadius: 4, 
                                                padding: "4px 8px", 
                                                cursor: "pointer", 
                                                fontWeight: 700,
                                                transition: "all 0.15s" 
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div>
                                        <label className="hf-admin-label">Secure Password</label>
                                        <input
                                            type="password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="hf-admin-input"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}

                            {loginError && (
                                <div style={{ color: "var(--hf-red)", fontSize: 11, fontWeight: 500, background: "rgba(239, 68, 68, 0.08)", padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                                    ⚠️ {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loggingIn}
                                className="hf-admin-btn-primary"
                                style={{ width: "100%", padding: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}
                            >
                                {loginStep === 1 ? (
                                    <>
                                        <span>Next</span>
                                        <ArrowRight size={14} />
                                    </>
                                ) : (
                                    <>
                                        <span>{loggingIn ? "Connecting Database..." : "Unlock Access"}</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        <button
                            onClick={() => setShowLoginModal(false)}
                            style={{ display: "block", width: "100%", textAlign: "center", marginTop: 14, fontSize: 11, color: "var(--ink-3)" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ── Visitor Social Quick Connect Modal (EASTER EGG) ── */}
            {showRedirectModal && (
                <div
                    className="dialog-backdrop-v2"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowRedirectModal(false); }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="dialog-v2" style={{ maxWidth: 520, padding: 30 }}>
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255, 157, 0, 0.08)", border: "1px solid rgba(255, 157, 0, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                                <Sparkles size={28} color="var(--hf-yellow)" className="animate-pulse" />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)" }}>Looking to connect with Raman? 🤗</h2>
                            <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 6, padding: "0 10px" }}>
                                Hello! You entered <strong style={{ color: "var(--ink)" }}>{redirectEmail}</strong> in the admin console. Since that email is for visitors, here are Raman's official connection channels:
                            </p>
                        </div>

                        {/* Interactive Redirect Tiles */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                            <a href={getSocialUrl("linkedin")} target="_blank" rel="noopener noreferrer" className="hf-visitor-card" style={{ borderLeft: "3px solid #0a66c2" }}>
                                <Linkedin size={18} color="#0a66c2" />
                                <div>
                                    <div className="title">LinkedIn</div>
                                    <div className="sub">Professional network</div>
                                </div>
                                <ExternalLink size={11} className="arrow" />
                            </a>

                            <a href={getSocialUrl("github")} target="_blank" rel="noopener noreferrer" className="hf-visitor-card" style={{ borderLeft: "3px solid #e8e8e8" }}>
                                <Github size={18} color="#e8e8e8" />
                                <div>
                                    <div className="title">GitHub</div>
                                    <div className="sub">Open-source code</div>
                                </div>
                                <ExternalLink size={11} className="arrow" />
                            </a>

                            <a href={getSocialUrl("huggingface")} target="_blank" rel="noopener noreferrer" className="hf-visitor-card" style={{ borderLeft: "3px solid #ff9d00" }}>
                                <span style={{ fontSize: 16 }}>🤗</span>
                                <div>
                                    <div className="title">Hugging Face</div>
                                    <div className="sub">Model training & Spaces</div>
                                </div>
                                <ExternalLink size={11} className="arrow" />
                            </a>

                            <a href={getSocialUrl("twitter")} target="_blank" rel="noopener noreferrer" className="hf-visitor-card" style={{ borderLeft: "3px solid #60a5fa" }}>
                                <Twitter size={18} color="#60a5fa" />
                                <div>
                                    <div className="title">X / Twitter</div>
                                    <div className="sub">AI & tech discussions</div>
                                </div>
                                <ExternalLink size={11} className="arrow" />
                            </a>
                        </div>

                        <div style={{ background: "var(--bg-code)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <MessageSquare size={16} color="var(--hf-green)" />
                            <div style={{ flex: 1, fontSize: 11, color: "var(--ink-2)" }}>
                                Direct mail is always open for inquiries:
                                <a href={`mailto:${activeConfig.email}`} style={{ color: "var(--hf-yellow)", fontWeight: 700, marginLeft: 4 }}>
                                    {activeConfig.email}
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowRedirectModal(false)}
                            className="hf-admin-btn-primary"
                            style={{ width: "100%", padding: 10 }}
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
