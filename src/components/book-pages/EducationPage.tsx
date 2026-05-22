"use client";

import { config } from "@/config/portfolio";

export function EducationPage() {
    return (
        <div>
            <div className="page-section-label">Background</div>
            <h2 className="page-section-title">Education</h2>
            <div className="page-divider" />

            <div className="timeline">
                {config.education.map((edu, i) => (
                    <div key={i} className="timeline-item">
                        <div className="timeline-year">{edu.year}</div>
                        <div className="timeline-institution">{edu.institution}</div>
                        <div className="timeline-degree">{edu.degree}</div>
                        {edu.gpa && (
                            <div style={{ fontSize: 11, color: "#c84b2f", marginBottom: 4 }}>
                                GPA: {edu.gpa}
                            </div>
                        )}
                        {edu.description && (
                            <div className="timeline-desc">{edu.description}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
