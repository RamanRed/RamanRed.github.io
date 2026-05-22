"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useBookState, PAGE_NAMES } from "@/hooks/useBookState";
import { AboutPage } from "@/components/book-pages/AboutPage";
import { EducationPage } from "@/components/book-pages/EducationPage";
import { GithubPage } from "@/components/book-pages/GithubPage";
import { DeployedPage } from "@/components/book-pages/DeployedPage";
import { TechStackPage } from "@/components/book-pages/TechStackPage";

const PAGES = [
    <AboutPage key="about" />,
    <EducationPage key="education" />,
    <GithubPage key="github" />,
    <DeployedPage key="deployed" />,
    <TechStackPage key="tech" />,
];

export function BookOverlay() {
    const { isOpen, currentPage, nextPage, prevPage, goToPage, closeBook } = useBookState();
    const scrollRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<Array<HTMLElement | null>>([]);
    const rafId = useRef<number | null>(null);

    const steps = useMemo(
        () => PAGES.map((_, i) => ({ id: `page-step-${i}`, pageIndex: i })),
        []
    );

    function syncScrollToPage(page: number, smooth = true) {
        const container = scrollRef.current;
        if (!container || PAGE_NAMES.length <= 1) return;

        const progress = page / (PAGE_NAMES.length - 1);
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTo({
            top: maxScroll * progress,
            behavior: smooth ? "smooth" : "auto",
        });
    }

    const animateFlip = useCallback((activePage: number) => {
        if (!bookRef.current) return;

        pageRefs.current.forEach((pageEl, i) => {
            if (!pageEl) return;
            const isFlipped = i < activePage;

            gsap.to(pageEl, {
                rotateY: isFlipped ? -176 : 0,
                x: isFlipped ? -16 : 0,
                z: isFlipped ? -20 : i * 2,
                duration: 0.75,
                ease: "power3.inOut",
                transformOrigin: "left center",
            });
        });

        gsap.to(bookRef.current, {
            rotateX: 2,
            rotateZ: -0.8,
            duration: 0.45,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
        });
    }, []);

    function handleContainerScroll() {
        const container = scrollRef.current;
        if (!container || PAGE_NAMES.length <= 1) return;

        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }

        rafId.current = requestAnimationFrame(() => {
            const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight);
            const progress = container.scrollTop / maxScroll;
            const page = Math.round(progress * (PAGE_NAMES.length - 1));
            if (page !== currentPage) {
                goToPage(page);
            }
        });
    }

    useEffect(() => {
        document.body.classList.add("book-open");
        syncScrollToPage(currentPage, false);

        return () => {
            document.body.classList.remove("book-open");
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
        // Run only on mount/unmount of overlay.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        animateFlip(currentPage);
    }, [animateFlip, currentPage]);

    return (
        <>
            {/* Close button */}
            <button
                className={`close-book-btn ${isOpen ? "visible" : ""}`}
                onClick={closeBook}
                aria-label="Close book"
                style={{ pointerEvents: isOpen ? "all" : "none" }}
            >
                <X size={18} />
            </button>

            {/* Book overlay */}
            <div className={`book-overlay ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
                <div className="book-overlay-scroll" ref={scrollRef} onScroll={handleContainerScroll}>
                    <section className="book-flip-stage">
                        <div className="book-frame" ref={bookRef}>
                            <div className="book-spine">
                                <span className="book-spine-text">Portfolio</span>
                            </div>

                            <div className="book-pages-area">
                                {PAGES.map((page, i) => (
                                    <article
                                        key={i}
                                        className={`book-page ${i === currentPage ? "active" : ""}`}
                                        ref={(el) => {
                                            pageRefs.current[i] = el;
                                        }}
                                        style={{ zIndex: PAGES.length - i }}
                                    >
                                        <div className="book-page-content">{page}</div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="book-scroll-steps" aria-hidden="true">
                        {steps.map((step) => (
                            <div className="book-scroll-step" key={step.id}>
                                <span className="book-step-index">0{step.pageIndex + 1}</span>
                                <span className="book-step-label">{PAGE_NAMES[step.pageIndex]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation bar */}
            <nav
                className={`book-nav ${isOpen ? "visible" : ""}`}
                aria-label="Book navigation"
                style={{ pointerEvents: isOpen ? "all" : "none" }}
            >
                <button
                    className="nav-btn"
                    onClick={() => {
                        prevPage();
                        syncScrollToPage(Math.max(0, currentPage - 1));
                    }}
                    disabled={currentPage === 0}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="nav-dots" role="tablist">
                    {PAGE_NAMES.map((name, i) => (
                        <button
                            key={name}
                            className={`nav-dot ${i === currentPage ? "active" : ""}`}
                            onClick={() => {
                                goToPage(i);
                                syncScrollToPage(i);
                            }}
                            role="tab"
                            aria-selected={i === currentPage}
                            aria-label={name}
                            title={name}
                        />
                    ))}
                </div>

                <span className="nav-page-label">{PAGE_NAMES[currentPage]}</span>

                <button
                    className="nav-btn"
                    onClick={() => {
                        nextPage();
                        syncScrollToPage(Math.min(PAGE_NAMES.length - 1, currentPage + 1));
                    }}
                    disabled={currentPage === PAGE_NAMES.length - 1}
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </button>
            </nav>
        </>
    );
}
