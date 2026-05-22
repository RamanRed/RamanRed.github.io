"use client";

import { ArrowUpRight } from "lucide-react";
import { config } from "@/config/portfolio";
import { isSafeUrl } from "@/lib/validate";

export function DeploymentsSection() {
    return (
        <section id="deployments" className="section-full deploy-section" data-scroll-section>
            <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
                <div data-loco-anim>
                    <div className="section-tag">Live Work</div>
                    <h2 className="section-title">Selected<br /><em>Deployments</em></h2>
                </div>

                <div className="deploy-list">
                    {config.deployments.map((dep, i) => {
                        const safeUrl = isSafeUrl(dep.url) ? dep.url : "#";
                        return (
                            <a
                                key={i}
                                href={safeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="deploy-item"
                                data-loco-anim
                            >
                                <div className="deploy-item-left">
                                    <div className="deploy-counter">0{i + 1}</div>
                                    <div className="deploy-v2-name">{dep.name}</div>
                                    <div className="deploy-v2-desc">{dep.description}</div>
                                </div>
                                <div className="deploy-item-tags">
                                    {dep.tags.map((t) => (
                                        <span key={t} className="deploy-item-tag">{t}</span>
                                    ))}
                                </div>
                                <div className="deploy-arrow">
                                    <ArrowUpRight size={20} />
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
