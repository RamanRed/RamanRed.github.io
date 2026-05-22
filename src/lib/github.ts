import type { Repo } from "@/types";
import { config } from "@/config/portfolio";

const GITHUB_API = "https://api.github.com";

function getHeaders(): HeadersInit {
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "portfolio-website",
    };
    // Server-only — never exposed to client
    if (process.env.GITHUB_PAT) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_PAT}`;
    }
    return headers;
}

/** Fetch all public, non-fork repos for the config username */
export async function fetchRepos(): Promise<Repo[]> {
    // SECURITY: username comes from server config only — never user input
    const username = config.github.username;

    const res = await fetch(
        `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=public`,
        {
            headers: getHeaders(),
            next: { revalidate: 300 }, // Cache 5 minutes
        }
    );

    if (!res.ok) {
        console.error(`GitHub API error: ${res.status}`);
        return [];
    }

    const repos: Repo[] = await res.json();

    // Filter: public, non-fork only
    const filtered = repos.filter((r) => !r.fork && !r.private);

    // Sort: pinned repos first, then by stars → updated
    const pinned = config.github.pinnedRepos;
    return filtered.sort((a, b) => {
        const aPin = pinned.indexOf(a.name);
        const bPin = pinned.indexOf(b.name);
        if (aPin !== -1 && bPin !== -1) return aPin - bPin;
        if (aPin !== -1) return -1;
        if (bPin !== -1) return 1;
        if (b.stargazers_count !== a.stargazers_count)
            return b.stargazers_count - a.stargazers_count;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
}

/** Fetch README for a specific repo as raw markdown */
export async function fetchReadme(repoName: string): Promise<string> {
    // SECURITY: repoName is already validated by the API route before calling this
    const username = config.github.username;

    try {
        const res = await fetch(
            `${GITHUB_API}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}/readme`,
            {
                headers: {
                    ...getHeaders(),
                    Accept: "application/vnd.github.raw+json",
                },
                next: { revalidate: 300 },
            }
        );

        if (!res.ok) return "";
        return res.text();
    } catch {
        return "";
    }
}
