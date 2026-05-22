"use client";

import { config } from "@/config/portfolio";

export function AboutPage() {
    const stats = [
        `📍 ${config.location}`,
        `🎓 ${config.education.length} Degrees / Certs`,
        `🚀 ${config.deployments.length} Deployed Projects`,
        `💻 ${Object.values(config.techStack).flat().length}+ Technologies`,
    ];

    return (
        <div>
            <div className="page-section-label">Introduction</div>
            <h1 className="about-name">{config.name}</h1>
            <div className="about-title">{config.title}</div>
            <div className="about-location">📍 {config.location}</div>
            <div className="page-divider" />

            <p className="about-bio">{config.about}</p>

            <div className="about-stats">
                {stats.map((s) => (
                    <span key={s} className="stat-chip">{s}</span>
                ))}
                {config.techStack.languages.slice(0, 3).map((l) => (
                    <span key={l} className="stat-chip">🔬 {l}</span>
                ))}
            </div>
        </div>
    );
}
