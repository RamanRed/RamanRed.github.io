"use client";

import { Github, Linkedin, Twitter, Instagram, Youtube, Mail, BookOpen } from "lucide-react";
import { config } from "@/config/portfolio";
import { isSafeUrl } from "@/lib/validate";
import type { SocialLink } from "@/types";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
    const icons: Record<string, React.ReactNode> = {
        github: <Github size={16} />,
        linkedin: <Linkedin size={16} />,
        twitter: <Twitter size={16} />,
        instagram: <Instagram size={16} />,
        youtube: <Youtube size={16} />,
        email: <Mail size={16} />,
        devto: <BookOpen size={16} />,
    };
    return <>{icons[platform] ?? <span>{platform[0]?.toUpperCase()}</span>}</>;
}

export function SocialPanelV2() {
    return (
        <nav className="social-panel-v2" aria-label="Social media links">
            {config.social.map((link) => {
                const safeUrl =
                    isSafeUrl(link.url) || link.url.startsWith("mailto:")
                        ? link.url
                        : "#";
                return (
                    <a
                        key={link.platform}
                        href={safeUrl}
                        target={link.url.startsWith("mailto:") ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className="social-link-v2"
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
