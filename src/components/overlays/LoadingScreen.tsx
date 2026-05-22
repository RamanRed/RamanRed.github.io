"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [label, setLabel] = useState("Initialising scene…");

    useEffect(() => {
        const steps = [
            { pct: 20, text: "Loading materials…" },
            { pct: 45, text: "Building desk geometry…" },
            { pct: 70, text: "Placing objects…" },
            { pct: 90, text: "Lighting scene…" },
            { pct: 100, text: "Ready!" },
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= steps.length) {
                clearInterval(interval);
                return;
            }
            setProgress(steps[i].pct);
            setLabel(steps[i].text);
            i++;
        }, 220);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-screen" id="loading-screen" aria-live="polite" aria-label="Loading portfolio">
            <div
                style={{
                    fontSize: 11,
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.4)",
                    marginBottom: 8,
                }}
            >
                Portfolio
            </div>
            <div className="loading-title">Loading Scene</div>
            <div className="loading-bar-outer" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="loading-bar-inner" style={{ width: `${progress}%` }} />
            </div>
            <div className="loading-sub">{label}</div>
        </div>
    );
}
