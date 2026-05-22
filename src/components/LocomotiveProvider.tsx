"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Initializes Locomotive + GSAP motion layers and wraps the app in a scroll container.
 */
export function LocomotiveProvider({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cleanup: (() => void) | undefined;
        let isMounted = true;

        async function initScroll() {
            const container = containerRef.current;
            if (!container) return;

            gsap.registerPlugin(ScrollTrigger);

            const LocomotiveScroll = (await import("locomotive-scroll")).default;
            if (!isMounted) return;

            type ScrollPayload = {
                scroll?: { y?: number };
                currentElements?: Record<string, unknown>;
            };

            type LocoInstance = {
                on?: (eventName: string, cb: (payload: ScrollPayload) => void) => void;
                off?: (eventName: string, cb: (payload: ScrollPayload) => void) => void;
                scrollTo?: (
                    target: HTMLElement | number,
                    options?: {
                        duration?: number;
                        lerp?: number;
                        disableLerp?: boolean;
                        offset?: number;
                    }
                ) => void;
                update?: () => void;
                destroy?: () => void;
            };

            const locoScroll = new LocomotiveScroll({
                el: container,
                smooth: true,
                lenisOptions: {
                    lerp: 0.08,
                    duration: 1.2,
                    orientation: "vertical",
                    smoothWheel: true,
                    wheelMultiplier: 0.95,
                    touchMultiplier: 1.25,
                },
            } as unknown as Record<string, unknown>) as LocoInstance;

            const progressBar = document.querySelector(".scroll-progress") as HTMLElement | null;
            const navbar = document.querySelector(".navbar") as HTMLElement | null;
            const revealTargets = gsap.utils.toArray<HTMLElement>("[data-loco-anim]");

            let currentScrollY = 0;

            const updateChrome = () => {
                const docHeight = Math.max(container.scrollHeight - window.innerHeight, 1);
                const progress = Math.min(Math.max(currentScrollY / docHeight, 0), 1);

                if (progressBar) {
                    progressBar.style.transform = `scaleX(${progress})`;
                }

                if (navbar) {
                    navbar.classList.toggle("scrolled", currentScrollY > 60);
                }
            };

            ScrollTrigger.scrollerProxy(container, {
                scrollTop(value) {
                    if (typeof value === "number") {
                        locoScroll.scrollTo?.(value, { duration: 0, disableLerp: true });
                        return value;
                    }

                    return currentScrollY;
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    };
                },
                pinType: "transform",
            });

            const revealTriggers = revealTargets.map((el) => ScrollTrigger.create({
                trigger: el,
                scroller: container,
                start: "top 86%",
                onEnter: () => el.classList.add("in-view"),
                onEnterBack: () => el.classList.add("in-view"),
                onLeaveBack: () => el.classList.remove("in-view"),
            }));

            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#hero",
                    scroller: container,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.8,
                },
            });

            heroTl
                .to(".hero-content", { yPercent: -22, autoAlpha: 0.4, ease: "none" }, 0)
                .to(".hero-canvas", { scale: 1.05, yPercent: -8, ease: "none" }, 0)
                .to(".hero-scroll-hint", { autoAlpha: 0, y: 26, ease: "none" }, 0);

            const onLocoScroll = (payload: ScrollPayload) => {
                currentScrollY = payload.scroll?.y ?? currentScrollY;
                updateChrome();
                ScrollTrigger.update();
            };

            locoScroll.on?.("scroll", onLocoScroll);

            const onResize = () => {
                locoScroll.update?.();
                ScrollTrigger.refresh();
            };

            const anchorHandler = (event: Event) => {
                const target = event.target as HTMLElement | null;
                const anchor = target?.closest("a[href^='#']") as HTMLAnchorElement | null;
                if (!anchor) return;

                const href = anchor.getAttribute("href");
                if (!href || href.length < 2) return;
                const section = document.querySelector(href) as HTMLElement | null;
                if (!section) return;

                event.preventDefault();
                locoScroll.scrollTo?.(section, { duration: 1.1, lerp: 0.08, offset: -20 });
            };

            const onRefresh = () => locoScroll.update?.();

            ScrollTrigger.defaults({ scroller: container });
            ScrollTrigger.addEventListener("refresh", onRefresh);
            window.addEventListener("resize", onResize);
            document.addEventListener("click", anchorHandler);

            updateChrome();
            requestAnimationFrame(() => {
                locoScroll.update?.();
                ScrollTrigger.refresh();
            });

            cleanup = () => {
                document.removeEventListener("click", anchorHandler);
                window.removeEventListener("resize", onResize);
                ScrollTrigger.removeEventListener("refresh", onRefresh);

                locoScroll.off?.("scroll", onLocoScroll);
                revealTriggers.forEach((trigger) => trigger.kill());
                heroTl.kill();
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

                locoScroll.destroy?.();
            };
        }

        initScroll();

        return () => {
            isMounted = false;
            cleanup?.();
        };
    }, []);

    return (
        <div ref={containerRef} data-scroll-container className="app-scroll-container">
            {children}
        </div>
    );
}
