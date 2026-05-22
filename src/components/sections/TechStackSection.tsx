"use client";

import { useState } from "react";
import Image from "next/image";
import { config } from "@/config/portfolio";

const CATS = ["All", "Languages", "Frameworks", "Cloud", "Databases", "Tools"] as const;
type Cat = typeof CATS[number];

function TechIcon({ name }: { name: string }) {
    const slug = name.toLowerCase()
        .replace(/\s+/g, "").replace(/\./g, "").replace(/\+/g, "p").replace(/#/g, "sharp")
        .replace("node", "nodejs").replace("next", "nextjs").replace("fastapi", "fastapi");
    return (
        <Image
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`}
            alt={name}
            width={18}
            height={18}
            unoptimized
        />
    );
}

export function TechStackSection() {
    const [active, setActive] = useState<Cat>("All");

    const allTechs = [
        ...config.techStack.languages,
        ...config.techStack.frameworks,
        ...config.techStack.cloud,
        ...config.techStack.databases,
        ...config.techStack.tools,
    ];

    const techByCategory: Record<string, string[]> = {
        Languages: config.techStack.languages,
        Frameworks: config.techStack.frameworks,
        Cloud: config.techStack.cloud,
        Databases: config.techStack.databases,
        Tools: config.techStack.tools,
    };

    const displayed = active === "All" ? allTechs : techByCategory[active];

    // Build two rows for marquee from all techs
    const row1 = [...allTechs, ...allTechs];
    const row2 = [...allTechs.slice(Math.floor(allTechs.length / 2)), ...allTechs, ...allTechs.slice(0, Math.floor(allTechs.length / 2))];

    return (
        <section id="stack" className="section" data-scroll-section>
            <div data-loco-anim>
                <div className="section-tag">Skills</div>
                <h2 className="section-title">Tech<br /><em>Stack</em></h2>
            </div>

            {/* Marquee rows */}
            <div className="tech-marquee-wrapper" data-loco-anim data-delay="1">
                <div className="tech-marquee-track">
                    {row1.map((t, i) => (
                        <div key={`${t}-${i}`} className="tech-pill-v2">
                            <TechIcon name={t} />
                            {t}
                        </div>
                    ))}
                </div>
                <div className="tech-marquee-track">
                    {row2.map((t, i) => (
                        <div key={`${t}-r2-${i}`} className="tech-pill-v2">
                            <TechIcon name={t} />
                            {t}
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter tabs */}
            <div data-loco-anim data-delay="2">
                <div className="tech-cat-tabs">
                    {CATS.map((cat) => (
                        <button
                            key={cat}
                            className={`tech-cat-btn ${active === cat ? "active" : ""}`}
                            onClick={() => setActive(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="tech-filtered-grid">
                    {displayed.map((tech) => (
                        <div key={tech} className="tech-filtered-pill">
                            <TechIcon name={tech} />
                            {tech}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
