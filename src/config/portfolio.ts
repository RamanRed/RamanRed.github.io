import type { PortfolioConfig } from "@/types";

// ★ ALL YOUR CONTENT LIVES HERE — edit this file to customise your portfolio
export const config: PortfolioConfig = {
    name: "Raman Randive",
    title: "AI/ML Engineer",
    tagline: "Building production-ready models, fine-tuned pipelines, and intelligent deployments.",
    location: "India",
    email: "ramanrandive2004@gmail.com",

    about: `I'm an AI/ML engineer focused on building real-world language and vision systems — from fine-tuning open-source LLMs to shipping model APIs at scale. I work across the full stack of ML: data pipelines, model training, evaluation harnesses, and cloud deployments. When I'm not training models, I'm probably reading papers, contributing to open-source, or hacking on a new inference optimisation.`,

    education: [
        {
            institution: "University (B.Tech)",
            degree: "B.Tech Computer Science",
            year: "2024",
            description: "Specialisation in Machine Learning and Distributed Systems.",
        },
        {
            institution: "Hugging Face Courses",
            degree: "NLP with Transformers",
            year: "2023",
            description: "Completed the full HF NLP course — fine-tuning, tokenisation, and model evaluation.",
        },
        {
            institution: "Fast.ai",
            degree: "Practical Deep Learning",
            year: "2022",
            description: "Top-down approach to computer vision and natural language processing.",
        },
    ],

    github: {
        username: "RamanRed",
        pinnedRepos: [],
    },

    deployments: [
        {
            name: "Weapon Detection Space",
            url: "https://huggingface.co/spaces/RamanRed/weapon_detection_space",
            description: "A deep-learning-based security system leveraging fine-tuned computer vision models to detect weapons and threats in real-time camera streams.",
            tags: ["Gradio", "Computer Vision", "PyTorch", "Spaces"],
        },
        {
            name: "Train Dataset Weapon",
            url: "https://huggingface.co/spaces/RamanRed/train_dataset_weapon",
            description: "An interactive fine-tuning dataset management sandbox designed to preprocess, curate, and annotate image pairs for security-related threat detection tasks.",
            tags: ["Gradio", "Dataset Curation", "Fine-tuning", "Python"],
        },
        {
            name: "OpenEnvs Network Sandbox",
            url: "https://huggingface.co/spaces/RamanRed/openenvs",
            description: "A custom reinforcement learning framework and OpenEnv environment simulating complex network routing protocols and automated troubleshooting diagnostics.",
            tags: ["FastAPI", "Docker", "Reinforcement Learning", "Gymnasium", "Network Diagnostics"],
        },
        {
            name: "My Env Server",
            url: "https://huggingface.co/spaces/RamanRed/my_env",
            description: "A dockerized RL training server and environment orchestrator for deploying network simulation tasks.",
            tags: ["Docker", "OpenEnv", "RL Sandbox", "Agent Training"],
        },
    ],

    techStack: {
        languages: ["Python", "TypeScript", "SQL", "Bash", "CUDA"],
        frameworks: ["PyTorch", "Transformers", "FastAPI", "Next.js", "Gradio"],
        cloud: ["Hugging Face Spaces", "AWS SageMaker", "Docker", "GCP Vertex AI", "Kubernetes"],
        databases: ["PostgreSQL", "Pinecone", "Redis", "FAISS", "MongoDB"],
        tools: ["Git", "Weights & Biases", "DVC", "Jupyter", "VSCode"],
    },

    social: [
        { platform: "github", url: "https://github.com/RamanRed" },
        { platform: "linkedin", url: "https://www.linkedin.com/in/raman-randive-043424323/" },
        { platform: "twitter", url: "https://x.com/RandiveRaman" },
        { platform: "instagram", url: "https://instagram.com/RamanRed" },
        { platform: "huggingface", url: "https://huggingface.co/RamanRed" },
        { platform: "leetcode", url: "https://leetcode.com/u/RamanRed/" },
        { platform: "codechef", url: "https://www.codechef.com/users/rich_wolves_49" },
        { platform: "hackerrank", url: "https://www.hackerrank.com/profile/raman_randive23" },
        { platform: "youtube", url: "https://youtube.com/@RamanRed" },
        { platform: "email", url: "mailto:ramanrandive2004@gmail.com" },
    ],

    resumeFilename: "RamanRandive_Resume.pdf",

    codingStats: {
        github: { commits: 342, prs: 58, issues: 12, email: "ramanrandive2004@gmail.com" },
        leetcode: { solved: 266, rank: 45000, points: 1540, email: "ramanrandive2004@gmail.com" },
        codechef: { rating: 1272, stars: 1, globalRank: 12400, email: "ramanrandive2004@gmail.com" },
        hackerrank: { badges: 5, stars: 5, points: 2850, email: "raman.randive23@pccoepune.org" },
        huggingface: { email: "ramanrandive2004@gmail.com" }
    },

    customStreaks: {}
};

