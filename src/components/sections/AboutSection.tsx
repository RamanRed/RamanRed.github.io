"use client";

import { config } from "@/config/portfolio";

export function AboutSection() {
    const stats = [
        { n: `${config.deployments.length}+`, label: "Live Projects" },
        { n: `${Object.values(config.techStack).flat().length}+`, label: "Technologies" },
        { n: `${config.education.length}`, label: "Degrees / Certs" },
        { n: "∞", label: "Cups of Coffee" },
    ];

    return (
        <section id="about" className="section" data-scroll-section>
            <div data-loco-anim>
                <div className="section-tag">About Me</div>
                <h2 className="section-title">
                    Crafting digital<br /><em>experiences</em> that matter
                </h2>
            </div>

            <div className="about-grid">
                <div className="about-text-col" data-loco-anim data-delay="1">
                    <div className="about-name-large">{config.name}</div>
                    <div className="about-role">{config.title} · {config.location}</div>
                    <p className="about-bio-text">{config.about}</p>

                    <div className="about-stats-grid">
                        {stats.map((s) => (
                            <div key={s.label} className="about-stat">
                                <div className="stat-number">{s.n}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="about-visual" data-loco-anim data-delay="2">
                    <div className="about-card-stack">
                        <div className="about-card about-card-2">
                            <div className="about-code-block">
                                <span className="kw">const</span> developer = {"{"}<br />
                                &nbsp;&nbsp;name: <span className="str">&quot;{config.name}&quot;</span>,<br />
                                &nbsp;&nbsp;role: <span className="str">&quot;{config.title}&quot;</span>,<br />
                                &nbsp;&nbsp;skills: [<br />
                                {config.techStack.languages.slice(0, 3).map(l => (
                                    <span key={l}>&nbsp;&nbsp;&nbsp;&nbsp;<span className="str">&quot;{l}&quot;</span>,<br /></span>
                                ))}
                                &nbsp;&nbsp;],<br />
                                &nbsp;&nbsp;coffee: <span className="num">Infinity</span>,<br />
                                {"}"};<br /><br />
                                <span className="cm">{"// Building since day one"}</span>
                            </div>
                        </div>
                        <div className="about-card about-card-1">
                            <div style={{ textAlign: "center", lineHeight: 2 }}>
                                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(232,180,75,0.5)", marginBottom: 8, textTransform: "uppercase" }}>Stack</div>
                                {[...config.techStack.frameworks, ...config.techStack.cloud].slice(0, 5).map(t => (
                                    <div key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{t}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
