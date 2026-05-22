import { create } from "zustand";
import type { Repo } from "@/types";

interface BookStore {
    isOpen: boolean;
    currentPage: number; // 0=About 1=Education 2=GitHub 3=Deployments 4=TechStack
    selectedRepo: Repo | null;
    isContactOpen: boolean;

    openBook: () => void;
    closeBook: () => void;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (n: number) => void;
    openRepo: (repo: Repo) => void;
    closeRepo: () => void;
    openContact: () => void;
    closeContact: () => void;
}

export const useBookState = create<BookStore>((set) => ({
    isOpen: false,
    currentPage: 0,
    selectedRepo: null,
    isContactOpen: false,

    openBook: () => set({ isOpen: true, currentPage: 0 }),
    closeBook: () => set({ isOpen: false, selectedRepo: null }),
    nextPage: () =>
        set((s) => ({ currentPage: Math.min(4, s.currentPage + 1) })),
    prevPage: () =>
        set((s) => ({ currentPage: Math.max(0, s.currentPage - 1) })),
    goToPage: (n) =>
        set({ currentPage: Math.min(4, Math.max(0, n)) }),
    openRepo: (repo) => set({ selectedRepo: repo }),
    closeRepo: () => set({ selectedRepo: null }),
    openContact: () => set({ isContactOpen: true }),
    closeContact: () => set({ isContactOpen: false }),
}));

export const PAGE_NAMES = ["About", "Education", "GitHub", "Deployments", "Tech Stack"];
