"use client";

import { config } from "@/config/portfolio";

export function EducationSection() {
    return (
        <section id="education" className="section-full edu-section" data-scroll-section>
            <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
                <div data-loco-anim>
                    <div className="section-tag">Background</div>
                    <h2 className="section-title">Education &amp;<br /><em>Certifications</em></h2>
                </div>

                <div className="edu-list">
                    {config.education.map((edu, i) => (
                        <div key={i} className="edu-card" data-loco-anim data-delay={String(Math.min(i + 1, 5))}>
                            <div className="edu-year">{edu.year}</div>
                            <div className="edu-degree">{edu.degree}</div>
                            <div className="edu-institution">{edu.institution}</div>
                            {edu.description && <div className="edu-desc">{edu.description}</div>}
                            {edu.gpa && <div className="edu-gpa">GPA: {edu.gpa}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
