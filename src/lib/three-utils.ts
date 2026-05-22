import * as THREE from "three";

/** Language colour map (GitHub colours) */
export const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Go: "#00ADD8",
    Rust: "#dea584",
    Java: "#b07219",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Ruby: "#701516",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    "C++": "#f34b7d",
    C: "#555555",
    Shell: "#89e051",
    Vue: "#41B883",
};

/** Create a simple procedural wood-like material */
export function createWoodMaterial(params?: {
    color?: THREE.ColorRepresentation;
}): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        color: params?.color ?? 0x6b4226,
        roughness: 0.85,
        metalness: 0.0,
    });
}

/** Create a leather-like material for book cover */
export function createLeatherMaterial(
    color: THREE.ColorRepresentation = 0x2c1a0e
): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.95,
        metalness: 0.0,
    });
}

/** Ease in-out cubic */
export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Lerp with clamping */
export function lerpClamped(a: number, b: number, t: number): number {
    return a + (b - a) * Math.min(1, Math.max(0, t));
}
