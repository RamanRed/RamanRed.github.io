"use client";

import { useState } from "react";
import { X, Save, Plus, Trash2, Globe, Database, Settings, ShieldAlert } from "lucide-react";
import type { PortfolioConfig, SocialLink, Deployment, Education } from "@/types";

interface Props {
    initialConfig: PortfolioConfig;
    onClose: () => void;
    onSaveSuccess: (updatedConfig: PortfolioConfig) => void;
}

export function AdminEditor({ initialConfig, onClose, onSaveSuccess }: Props) {
    const [activeTab, setActiveTab] = useState<"basic" | "social" | "tech" | "projects">("basic");
    const [editedConfig, setEditedConfig] = useState<PortfolioConfig>(JSON.parse(JSON.stringify(initialConfig)));
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
    const [copied, setCopied] = useState(false);

    const copySQLToClipboard = () => {
        const sqlText = `CREATE TABLE IF NOT EXISTS public.portfolio_settings (
    email TEXT PRIMARY KEY,
    config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.portfolio_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow write and update for anon users" ON public.portfolio_settings
    FOR ALL USING (true) WITH CHECK (true);`;
        navigator.clipboard.writeText(sqlText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Dynamic field handlers
    const handleBasicChange = (field: keyof PortfolioConfig, value: any) => {
        setEditedConfig((prev) => ({ ...prev, [field]: value }));
    };

    // Social Links Handlers
    const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
        setEditedConfig((prev) => {
            const nextSocial = [...prev.social];
            nextSocial[index] = { ...nextSocial[index], [field]: value };
            return { ...prev, social: nextSocial };
        });
    };

    const addSocialLink = () => {
        setEditedConfig((prev) => ({
            ...prev,
            social: [...prev.social, { platform: "github", url: "https://" }]
        }));
    };

    const removeSocialLink = (index: number) => {
        setEditedConfig((prev) => ({
            ...prev,
            social: prev.social.filter((_, i) => i !== index)
        }));
    };

    // Tech Stack Handlers
    const handleTechChange = (category: "languages" | "frameworks" | "cloud" | "databases" | "tools", value: string) => {
        const list = value.split(",").map((s) => s.trim()).filter(Boolean);
        setEditedConfig((prev) => ({
            ...prev,
            techStack: { ...prev.techStack, [category]: list }
        }));
    };

    // Deployments Handlers
    const handleDeploymentChange = (index: number, field: keyof Deployment, value: any) => {
        setEditedConfig((prev) => {
            const nextDep = [...prev.deployments];
            nextDep[index] = { ...nextDep[index], [field]: value };
            return { ...prev, deployments: nextDep };
        });
    };

    const handleDeploymentTagsChange = (index: number, value: string) => {
        const tags = value.split(",").map((s) => s.trim()).filter(Boolean);
        setEditedConfig((prev) => {
            const nextDep = [...prev.deployments];
            nextDep[index] = { ...nextDep[index], tags };
            return { ...prev, deployments: nextDep };
        });
    };

    const addDeployment = () => {
        setEditedConfig((prev) => ({
            ...prev,
            deployments: [
                ...prev.deployments,
                { name: "New AI App", url: "https://huggingface.co/spaces/RamanRed/app", description: "", tags: ["Spaces", "Gradio"] }
            ]
        }));
    };

    const removeDeployment = (index: number) => {
        setEditedConfig((prev) => ({
            ...prev,
            deployments: prev.deployments.filter((_, i) => i !== index)
        }));
    };


    // Save configuration API Call
    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedConfig)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setMessage({ text: data.message || "Saved successfully!", error: false });
                onSaveSuccess(editedConfig);
            } else {
                setMessage({ text: data.error || "Save operation failed.", error: true });
            }
        } catch (err) {
            console.error("Save error:", err);
            setMessage({ text: "Failed to connect to save endpoint.", error: true });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dialog-backdrop-v2" style={{ zIndex: 998 }}>
            <div className="dialog-v2" style={{ maxWidth: 850, width: "95vw", height: "80vh", display: "flex", flexDirection: "column" }}>
                {/* Editor Header */}
                <div className="dialog-v2-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Settings size={18} className="animate-spin" color="var(--hf-yellow)" />
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", fontFamily: "var(--mono)" }}>
                            Hugging Face Profile Editor
                        </h2>
                        <span className="hf-chip" style={{ fontSize: 9 }}>admin panel</span>
                    </div>
                    <button className="dialog-v2-close" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                {/* Main Body Grid */}
                <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
                    {/* Left tabs menu */}
                    <div style={{ width: 180, borderRight: "1px solid var(--border)", background: "#111", padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                            { id: "basic", label: "Profile Basics" },
                            { id: "social", label: "Social Platform URLs" },
                            { id: "tech", label: "Tech Stack Tags" },
                            { id: "projects", label: "Live Spaces / Repos" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    textAlign: "left",
                                    padding: "8px 12px",
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: activeTab === tab.id ? 600 : 400,
                                    color: activeTab === tab.id ? "var(--hf-yellow)" : "var(--ink-3)",
                                    background: activeTab === tab.id ? "var(--hf-yellow-2)" : "transparent"
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}

                        <div style={{ marginTop: "auto", padding: 8, background: "rgba(255, 157, 0, 0.03)", border: "1px dashed var(--border)", borderRadius: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--hf-orange)", fontSize: 10, fontWeight: 700, marginBottom: 2 }}>
                                <ShieldAlert size={10} /> Live Data Sync
                            </div>
                            <span style={{ fontSize: 9, color: "var(--ink-4)", display: "block" }}>
                                All saves synchronize directly into your active Supabase database table.
                            </span>
                        </div>
                    </div>

                    {/* Right form panel */}
                    <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#151515" }}>
                        {/* Database Sync Error / Table Not Found Troubleshooting Guide */}
                        {message && message.error && message.text.includes("portfolio_settings") && (
                            <div style={{
                                background: "rgba(239, 68, 68, 0.05)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                borderRadius: 8,
                                padding: 16,
                                marginBottom: 20,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--hf-red)", fontWeight: 700, fontSize: 13 }}>
                                    <ShieldAlert size={16} />
                                    <span>Supabase Table Setup Required</span>
                                </div>
                                <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
                                    The Supabase credentials in your <code>.env.local</code> are connected, but the <strong><code>portfolio_settings</code></strong> table is missing in your database schema. Follow these quick steps to create it:
                                </p>
                                <ol style={{ fontSize: 11, color: "var(--ink-3)", paddingLeft: 20, margin: "0 0 4px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                                    <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: "var(--hf-yellow)", textDecoration: "underline", fontWeight: 600 }}>Supabase Dashboard</a> and open your project.</li>
                                    <li>Click on the <strong>SQL Editor</strong> tab in the left sidebar.</li>
                                    <li>Click <strong>"New Query"</strong>, paste the SQL schema script below, and click <strong>"Run"</strong>.</li>
                                </ol>
                                
                                <div style={{ position: "relative" }}>
                                    <pre style={{
                                        margin: 0,
                                        padding: "12px 14px",
                                        background: "#0c0c0c",
                                        borderRadius: 6,
                                        fontSize: 10,
                                        fontFamily: "var(--mono)",
                                        color: "#aaa",
                                        overflowX: "auto",
                                        border: "1px solid var(--border)",
                                        maxHeight: 180,
                                        lineHeight: 1.4
                                    }}>
{`CREATE TABLE IF NOT EXISTS public.portfolio_settings (
    email TEXT PRIMARY KEY,
    config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.portfolio_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow write and update for anon users" ON public.portfolio_settings
    FOR ALL USING (true) WITH CHECK (true);`}
                                    </pre>
                                    <button 
                                        onClick={copySQLToClipboard}
                                        style={{
                                            position: "absolute",
                                            top: 6,
                                            right: 6,
                                            background: copied ? "var(--hf-green)" : "rgba(255,255,255,0.08)",
                                            color: copied ? "#000" : "var(--ink)",
                                            border: "none",
                                            borderRadius: 4,
                                            padding: "4px 8px",
                                            fontSize: 9,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            transition: "all 0.15s ease"
                                        }}
                                    >
                                        {copied ? "✓ Copied!" : "Copy SQL Code"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Basic Profile Details ── */}
                        {activeTab === "basic" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <div>
                                        <label className="hf-admin-label">Full Name</label>
                                        <input
                                            type="text"
                                            value={editedConfig.name}
                                            onChange={(e) => handleBasicChange("name", e.target.value)}
                                            className="hf-admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="hf-admin-label">Title / Role</label>
                                        <input
                                            type="text"
                                            value={editedConfig.title}
                                            onChange={(e) => handleBasicChange("title", e.target.value)}
                                            className="hf-admin-input"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <div>
                                        <label className="hf-admin-label">Location</label>
                                        <input
                                            type="text"
                                            value={editedConfig.location}
                                            onChange={(e) => handleBasicChange("location", e.target.value)}
                                            className="hf-admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="hf-admin-label">Email Address</label>
                                        <input
                                            type="email"
                                            value={editedConfig.email}
                                            onChange={(e) => handleBasicChange("email", e.target.value)}
                                            className="hf-admin-input"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="hf-admin-label">Resume PDF Filename</label>
                                    <input
                                        type="text"
                                        value={editedConfig.resumeFilename}
                                        onChange={(e) => handleBasicChange("resumeFilename", e.target.value)}
                                        className="hf-admin-input"
                                    />
                                </div>
                                <div>
                                    <label className="hf-admin-label">Tagline (Hero Statement)</label>
                                    <input
                                        type="text"
                                        value={editedConfig.tagline}
                                        onChange={(e) => handleBasicChange("tagline", e.target.value)}
                                        className="hf-admin-input"
                                    />
                                </div>
                                <div>
                                    <label className="hf-admin-label">About / Bio Section</label>
                                    <textarea
                                        value={editedConfig.about}
                                        onChange={(e) => handleBasicChange("about", e.target.value)}
                                        className="hf-admin-input"
                                        style={{ minHeight: 110, resize: "vertical" }}
                                    />
                                </div>

                                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 6 }}>
                                    <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--hf-yellow)", marginBottom: 10, fontFamily: "var(--mono)" }}>
                                        Platform Registered Emails
                                    </h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <div>
                                            <label className="hf-admin-label">GitHub Email</label>
                                            <input
                                                type="email"
                                                value={editedConfig.codingStats?.github?.email || ""}
                                                onChange={(e) => {
                                                    const codingStats = editedConfig.codingStats || {};
                                                    codingStats.github = { ...(codingStats.github || {}), email: e.target.value };
                                                    handleBasicChange("codingStats", codingStats);
                                                }}
                                                className="hf-admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="hf-admin-label">LeetCode Email</label>
                                            <input
                                                type="email"
                                                value={editedConfig.codingStats?.leetcode?.email || ""}
                                                onChange={(e) => {
                                                    const codingStats = editedConfig.codingStats || {};
                                                    codingStats.leetcode = { ...(codingStats.leetcode || {}), email: e.target.value };
                                                    handleBasicChange("codingStats", codingStats);
                                                }}
                                                className="hf-admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="hf-admin-label">CodeChef Email</label>
                                            <input
                                                type="email"
                                                value={editedConfig.codingStats?.codechef?.email || ""}
                                                onChange={(e) => {
                                                    const codingStats = editedConfig.codingStats || {};
                                                    codingStats.codechef = { ...(codingStats.codechef || {}), email: e.target.value };
                                                    handleBasicChange("codingStats", codingStats);
                                                }}
                                                className="hf-admin-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="hf-admin-label">HackerRank Email</label>
                                            <input
                                                type="email"
                                                value={editedConfig.codingStats?.hackerrank?.email || ""}
                                                onChange={(e) => {
                                                    const codingStats = editedConfig.codingStats || {};
                                                    codingStats.hackerrank = { ...(codingStats.hackerrank || {}), email: e.target.value };
                                                    handleBasicChange("codingStats", codingStats);
                                                }}
                                                className="hf-admin-input"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                                        <div>
                                            <label className="hf-admin-label">Hugging Face Email</label>
                                            <input
                                                type="email"
                                                value={editedConfig.codingStats?.huggingface?.email || ""}
                                                onChange={(e) => {
                                                    const codingStats = editedConfig.codingStats || {};
                                                    codingStats.huggingface = { ...(codingStats.huggingface || {}), email: e.target.value };
                                                    handleBasicChange("codingStats", codingStats);
                                                }}
                                                className="hf-admin-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Social Links ── */}
                        {activeTab === "social" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Manage external profiles links</span>
                                    <button onClick={addSocialLink} className="hf-admin-btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <Plus size={12} /> Add Platform Link
                                    </button>
                                </div>

                                {editedConfig.social.map((item, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <select
                                            value={item.platform}
                                            onChange={(e) => handleSocialChange(idx, "platform", e.target.value as any)}
                                            className="hf-admin-input"
                                            style={{ width: 140 }}
                                        >
                                            {["github", "linkedin", "twitter", "instagram", "huggingface", "leetcode", "codechef", "hackerrank", "youtube", "email"].map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={item.url}
                                            onChange={(e) => handleSocialChange(idx, "url", e.target.value)}
                                            placeholder="https://"
                                            className="hf-admin-input"
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            onClick={() => removeSocialLink(idx)}
                                            style={{ color: "var(--hf-red)", padding: 8 }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Tab: Tech Stack Tags ── */}
                        {activeTab === "tech" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <span style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 8 }}>
                                    Enter comma-separated lists of tags for your skills feed.
                                </span>
                                {[
                                    { cat: "languages", label: "Languages (e.g. Python, SQL)" },
                                    { cat: "frameworks", label: "Frameworks (e.g. PyTorch, Next.js)" },
                                    { cat: "cloud", label: "Cloud & Devops (e.g. Docker, AWS)" },
                                    { cat: "databases", label: "Databases (e.g. Pinecone, PostgreSQL)" },
                                    { cat: "tools", label: "Tools & Utilities (e.g. Git, Weights & Biases)" },
                                ].map((item) => (
                                    <div key={item.cat}>
                                        <label className="hf-admin-label">{item.label}</label>
                                        <input
                                            type="text"
                                            defaultValue={editedConfig.techStack[item.cat as keyof typeof editedConfig.techStack]?.join(", ")}
                                            onBlur={(e) => handleTechChange(item.cat as any, e.target.value)}
                                            className="hf-admin-input"
                                            placeholder="Tag 1, Tag 2, Tag 3..."
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Tab: Live Deployments & Spaces ── */}
                        {activeTab === "projects" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Manage live model apps and spaces</span>
                                    <button onClick={addDeployment} className="hf-admin-btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <Plus size={12} /> Add Space App
                                    </button>
                                </div>

                                {editedConfig.deployments.map((dep, idx) => (
                                    <div key={idx} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12, background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", gap: 8 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--hf-yellow)" }}>Space Deployment #{idx + 1}</span>
                                            <button onClick={() => removeDeployment(idx)} style={{ color: "var(--hf-red)", fontSize: 11, display: "flex", alignItems: "center", gap: 2 }}>
                                                <Trash2 size={11} /> Remove
                                            </button>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                            <div>
                                                <label className="hf-admin-label" style={{ fontSize: 10 }}>App Name</label>
                                                <input
                                                    type="text"
                                                    value={dep.name}
                                                    onChange={(e) => handleDeploymentChange(idx, "name", e.target.value)}
                                                    className="hf-admin-input"
                                                    style={{ padding: 6, fontSize: 12 }}
                                                />
                                            </div>
                                            <div>
                                                <label className="hf-admin-label" style={{ fontSize: 10 }}>Space/Deployment URL</label>
                                                <input
                                                    type="text"
                                                    value={dep.url}
                                                    onChange={(e) => handleDeploymentChange(idx, "url", e.target.value)}
                                                    className="hf-admin-input"
                                                    style={{ padding: 6, fontSize: 12 }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="hf-admin-label" style={{ fontSize: 10 }}>Description</label>
                                            <textarea
                                                value={dep.description}
                                                onChange={(e) => handleDeploymentChange(idx, "description", e.target.value)}
                                                className="hf-admin-input"
                                                style={{ minHeight: 48, padding: 6, fontSize: 12, resize: "vertical" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="hf-admin-label" style={{ fontSize: 10 }}>Tags (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={dep.tags.join(", ")}
                                                onChange={(e) => handleDeploymentTagsChange(idx, e.target.value)}
                                                className="hf-admin-input"
                                                style={{ padding: 6, fontSize: 12 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Save actions */}
                <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "between", background: "#111" }}>
                    {message && (
                        <span style={{ fontSize: 11, fontWeight: 500, color: message.error ? "var(--hf-red)" : "var(--hf-green)" }}>
                            {message.error ? "❌ " : "✓ "} {message.text}
                        </span>
                    )}

                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                        <button
                            onClick={onClose}
                            className="hf-admin-btn-secondary"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="hf-admin-btn-primary"
                            disabled={saving}
                            style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                            <Save size={14} />
                            {saving ? "Synchronizing..." : "Sync Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
