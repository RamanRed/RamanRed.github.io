import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "hf/raman — AI/ML Engineer",
    description:
        "Hugging Face-themed portfolio for Raman — AI/ML engineer building fine-tuned models, RAG pipelines, and production deployments.",
    keywords: ["portfolio", "AI", "ML", "HuggingFace", "LLM", "Next.js", "models", "deployments"],
    robots: "index, follow",
    openGraph: {
        type: "website",
        title: "hf/raman — AI/ML Engineer",
        description:
            "Hugging Face-styled profile: datasets, models, and live deployments by Raman.",
        siteName: "hf/raman",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>{children}</body>
        </html>
    );
}
