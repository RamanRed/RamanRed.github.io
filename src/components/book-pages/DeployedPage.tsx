"use client";

import { ExternalLink } from "lucide-react";
import { config } from "@/config/portfolio";
import { isSafeUrl } from "@/lib/validate";

export function DeployedPage() {
    return (
        <div>
            <div className="page-section-label">Live Projects</div>
            <h2 className="page-section-title">Deployments</h2>
            <div className="page-divider" />

            <div className="deploy-grid">
                {config.deployments.map((dep, i) => {
                    const safeUrl = isSafeUrl(dep.url) ? dep.url : "#";

                    return (
                        <div key={i} className="deploy-card">
                            <a href={safeUrl} target="_blank" rel="noopener noreferrer">
                                <div className="deploy-name">
                                    {dep.name} <ExternalLink size={11} style={{ display: "inline", marginLeft: 4 }} />
                                </div>
                                <div className="deploy-desc">{dep.description}</div>
                                <div className="deploy-tags">
                                    {dep.tags.map((t) => (
                                        <span key={t} className="deploy-tag">{t}</span>
                                    ))}
                                </div>
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
