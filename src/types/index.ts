// Shared TypeScript types for the portfolio website

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  private: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  description?: string;
  gpa?: string;
}

export interface Deployment {
  name: string;
  url: string;
  description: string;
  tags: string[];
  screenshot?: string;
}

export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "instagram" | "devto" | "youtube" | "email" | "huggingface" | "leetcode" | "codechef" | "hackerrank";
  url: string;
  label?: string;
}

export interface CodingStats {
  github?: { commits?: number; prs?: number; issues?: number; email?: string; };
  leetcode?: { solved?: number; rank?: number; points?: number; email?: string; };
  codechef?: { rating?: number; stars?: number; globalRank?: number; email?: string; };
  hackerrank?: { badges?: number; stars?: number; points?: number; email?: string; };
  huggingface?: { email?: string; };
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  cloud: string[];
  databases: string[];
  tools: string[];
}

export interface PortfolioConfig {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  about: string;
  education: Education[];
  github: {
    username: string;
    pinnedRepos: string[];
  };
  deployments: Deployment[];
  techStack: TechStack;
  social: SocialLink[];
  resumeFilename: string;
  codingStats?: CodingStats;
  customStreaks?: Record<string, number>;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
