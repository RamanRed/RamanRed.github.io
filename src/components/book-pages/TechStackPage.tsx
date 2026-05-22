"use client";

import { useState } from "react";
import Image from "next/image";
import { config } from "@/config/portfolio";

const CATEGORIES = ["Languages", "Frameworks", "Cloud", "Databases", "Tools"] as const;
type Category = typeof CATEGORIES[number];

const TECH_MAP: Record<Category, string[]> = {
    Languages: config.techStack.languages,
    Frameworks: config.techStack.frameworks,
    Cloud: config.techStack.cloud,
    Databases: config.techStack.databases,
    Tools: config.techStack.tools,
};

// Simple icon fallback using devicons CDN
function TechIcon({ name }: { name: string }) {
    const slug = name.toLowerCase().replace(/[\s.+#]/g, "").replace("node.js", "nodejs");
    return (
        <Image
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`}
            alt={name}
            width={20}
            height={20}
            unoptimized
        />
    );
}

export function TechStackPage() {
    const [active, setActive] = useState<Category>("Languages");

    return (
        <div>
            <div className="page-section-label">Skills</div>
            <h2 className="page-section-title">Tech Stack</h2>
            <div className="page-divider" />

            <div className="tech-tabs">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`tech-tab ${active === cat ? "active" : ""}`}
                        onClick={() => setActive(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="tech-badges">
                {TECH_MAP[active].map((tech) => (
                    <div key={tech} className="tech-badge">
                        <TechIcon name={tech} />
                        {tech}
                    </div>
                ))}
            </div>
        </div>
    );
}
