"use client";

import { Download } from "lucide-react";
import { config } from "@/config/portfolio";

export function ResumeButton() {
    function handleDownload() {
        // Opens /api/resume which streams PDF with Content-Disposition: attachment
        // The actual blob URL is never exposed to the client
        const link = document.createElement("a");
        link.href = "/api/resume";
        link.download = config.resumeFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <button
            className="resume-btn"
            onClick={handleDownload}
            aria-label="Download resume PDF"
        >
            <Download size={14} />
            Resume
        </button>
    );
}
