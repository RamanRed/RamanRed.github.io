"use client";

import dynamic from "next/dynamic";
import { useBookState } from "@/hooks/useBookState";
import { config } from "@/config/portfolio";

const Scene = dynamic(() => import("@/components/scene/Scene"), { ssr: false });

export function HeroSection() {
    const { openBook, openContact } = useBookState();

    return (
        <section id="hero" className="hero" data-scroll-section>
            {/* Three.js canvas as background */}
            <div className="hero-canvas" data-scroll data-scroll-speed="-1">
                <Scene />
            </div>

            {/* Text overlay */}
            <div className="hero-content" data-scroll data-scroll-speed="1">
                <div className="hero-eyebrow">Full Stack Engineer · {config.location}</div>
                <h1 className="hero-title">
                    {config.name.split(" ")[0]}
                    <span className="line-2">{config.name.split(" ").slice(1).join(" ") || "Portfolio"}</span>
                </h1>
                <p className="hero-sub">{config.tagline}</p>
                <div className="hero-cta">
                    <button className="hero-btn primary" onClick={openBook}>
                        Explore Portfolio →
                    </button>
                    <button className="hero-btn ghost" onClick={openContact}>
                        Say Hello ☕
                    </button>
                </div>
            </div>

            {/* Scroll hint */}
            <div className="hero-scroll-hint" data-scroll data-scroll-speed="2">
                <div className="scroll-line" />
                Scroll
            </div>
        </section>
    );
}
