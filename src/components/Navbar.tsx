"use client";

import { Download } from "lucide-react";
import { config } from "@/config/portfolio";

export function Navbar() {
    function handleResume() {
        const a = document.createElement("a");
        a.href = "/api/resume";
        a.download = config.resumeFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <header className="navbar" id="navbar">
            <a href="#hero" className="nav-logo">
                {config.name.split(" ")[0]}<span>.</span>
            </a>

            <nav>
                <ul className="nav-links">
                    {[
                        ["About", "#about"],
                        ["Education", "#education"],
                        ["Projects", "#github"],
                        ["Deployments", "#deployments"],
                        ["Stack", "#stack"],
                        ["Contact", "#contact"],
                    ].map(([label, href]) => (
                        <li key={label}>
                            <a href={href}>{label}</a>
                        </li>
                    ))}
                </ul>
            </nav>

            <button className="nav-resume-btn" onClick={handleResume} aria-label="Download resume">
                <Download size={13} />
                Resume
            </button>
        </header>
    );
}
