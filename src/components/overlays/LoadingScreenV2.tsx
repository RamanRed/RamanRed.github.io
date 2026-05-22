"use client";

import { useEffect, useState } from "react";

export function LoadingScreenV2() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const steps = [15, 35, 55, 72, 88, 100];
        let i = 0;
        const interval = setInterval(() => {
            if (i >= steps.length) { clearInterval(interval); return; }
            setProgress(steps[i]);
            i++;
        }, 180);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-screen-v2" id="loading-screen" aria-live="polite">
            <div className="loading-logo">
                Port<span>.</span>
            </div>
            <div className="loading-bar-v2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="loading-pct">{progress}%</div>
        </div>
    );
}
