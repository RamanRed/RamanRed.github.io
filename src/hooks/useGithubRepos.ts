import useSWR from "swr";
import type { Repo } from "@/types";

const fetcher = async (url: string): Promise<Repo[]> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch repos");
    return res.json();
};

export function useGithubRepos() {
    const { data, error, isLoading } = useSWR<Repo[]>("/api/repos", fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 5 * 60 * 1000, // 5 min client-side cache
    });

    return {
        repos: data ?? [],
        isLoading,
        error: error as Error | null,
    };
}
