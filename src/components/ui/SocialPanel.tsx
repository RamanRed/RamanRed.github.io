"use client";

import { Github, Linkedin, Twitter, Instagram, Youtube, Mail, BookOpen, Code2, Trophy, Terminal } from "lucide-react";
import { config } from "@/config/portfolio";
import { isSafeUrl } from "@/lib/validate";
import type { SocialLink } from "@/types";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
    const icons: Record<SocialLink["platform"], React.ReactNode> = {
        github: <Github size={18} />,
        linkedin: <Linkedin size={18} />,
        twitter: <Twitter size={18} />,
        instagram: <Instagram size={18} />,
        youtube: <Youtube size={18} />,
        email: <Mail size={18} />,
        devto: <BookOpen size={18} />,
        huggingface: <span style={{ fontSize: 16, lineHeight: 1 }}>🤗</span>,
        leetcode: <Code2 size={18} />,
        codechef: <Trophy size={18} />,
        hackerrank: <Terminal size={18} />,
    };
    return <>{icons[platform] ?? <span>{platform[0].toUpperCase()}</span>}</>;
}

export function SocialPanel() {
    return (
        <nav className="social-panel" aria-label="Social links">
            {config.social.map((link) => {
                // SECURITY: validate URLs before rendering — prevents javascript: hrefs
                const safeUrl = isSafeUrl(link.url) ? link.url : link.url.startsWith("mailto:") ? link.url : "#";

                return (
                    <a
                        key={link.platform}
                        href={safeUrl}
                        target={link.url.startsWith("mailto:") ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label={link.label ?? link.platform}
                        title={link.label ?? link.platform}
                    >
                        <SocialIcon platform={link.platform} />
                    </a>
                );
            })}
        </nav>
    );
}
