"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function DeskItems() {
    const lampLightRef = useRef<THREE.PointLight>(null);

    useFrame(({ clock }) => {
        if (lampLightRef.current) {
            // Subtle flicker
            lampLightRef.current.intensity = 0.8 + Math.sin(clock.elapsedTime * 3.7) * 0.05;
        }
    });

    return (
        <group>
            {/* ── Desk Lamp ─────────────────────────────────────────────────────── */}
            {/* Base */}
            <mesh position={[1.3, 0.76, -0.4]} castShadow>
                <cylinderGeometry args={[0.045, 0.06, 0.015, 16]} />
                <meshStandardMaterial color={0x222230} roughness={0.4} metalness={0.8} />
            </mesh>
            {/* Arm */}
            <mesh position={[1.3, 0.98, -0.4]} rotation={[0, 0, 0.15]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.45, 8]} />
                <meshStandardMaterial color={0x333345} roughness={0.4} metalness={0.8} />
            </mesh>
            {/* Shade */}
            <mesh position={[1.35, 1.2, -0.4]} rotation={[0.3, 0, 0.1]} castShadow>
                <coneGeometry args={[0.07, 0.09, 16, 1, true]} />
                <meshStandardMaterial color={0x888870} roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Lamp light */}
            <pointLight
                ref={lampLightRef}
                position={[1.35, 1.14, -0.4]}
                color="#ffeaa0"
                intensity={0.8}
                distance={3}
                decay={2}
            />

            {/* ── Pen / Pencil ──────────────────────────────────────────────────── */}
            <mesh position={[-0.5, 0.755, -0.2]} rotation={[0, 0.4, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.007, 0.006, 0.22, 8]} />
                <meshStandardMaterial color={0x2c2cf0} roughness={0.6} metalness={0} />
            </mesh>
            {/* Pen tip */}
            <mesh position={[-0.602, 0.755, -0.195]} rotation={[0, 0.4, Math.PI / 2]} castShadow>
                <coneGeometry args={[0.006, 0.02, 8]} />
                <meshStandardMaterial color={0x888888} roughness={0.4} metalness={0.5} />
            </mesh>

            {/* ── Small Plant ───────────────────────────────────────────────────── */}
            {/* Pot */}
            <mesh position={[1.45, 0.79, 0.5]} castShadow>
                <cylinderGeometry args={[0.05, 0.04, 0.065, 12]} />
                <meshStandardMaterial color={0xb04a20} roughness={0.8} metalness={0} />
            </mesh>
            {/* Soil */}
            <mesh position={[1.45, 0.825, 0.5]}>
                <cylinderGeometry args={[0.045, 0.045, 0.008, 12]} />
                <meshStandardMaterial color={0x3d1f0a} roughness={1} metalness={0} />
            </mesh>
            {/* Leaves (approximate as spheres) */}
            <mesh position={[1.44, 0.89, 0.5]} castShadow>
                <sphereGeometry args={[0.05, 10, 10]} />
                <meshStandardMaterial color={0x2d7a3a} roughness={0.9} metalness={0} />
            </mesh>
            <mesh position={[1.47, 0.88, 0.48]}>
                <sphereGeometry args={[0.038, 10, 10]} />
                <meshStandardMaterial color={0x3d9a4a} roughness={0.9} metalness={0} />
            </mesh>
            <mesh position={[1.42, 0.875, 0.53]}>
                <sphereGeometry args={[0.032, 10, 10]} />
                <meshStandardMaterial color={0x4aaf55} roughness={0.9} metalness={0} />
            </mesh>

            {/* ── Notepad ───────────────────────────────────────────────────────── */}
            <mesh position={[-1.1, 0.758, 0.1]} rotation={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[0.28, 0.005, 0.22]} />
                <meshStandardMaterial color={0xfaf7f0} roughness={0.9} metalness={0} />
            </mesh>
            {/* Lines on notepad */}
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[-1.1, 0.762, -0.02 + i * 0.04]} rotation={[0, 0.1, 0]}>
                    <boxGeometry args={[0.22, 0.001, 0.004]} />
                    <meshStandardMaterial color={0xc8d0e0} roughness={1} metalness={0} />
                </mesh>
            ))}

            {/* ── Monitor / Screen ─────────────────────────────────────────────── */}
            {/* Stand */}
            <mesh position={[0, 0.76, -0.85]} castShadow>
                <boxGeometry args={[0.06, 0.01, 0.16]} />
                <meshStandardMaterial color={0x222230} roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.86, -0.88]} castShadow>
                <boxGeometry args={[0.03, 0.2, 0.03]} />
                <meshStandardMaterial color={0x222230} roughness={0.4} metalness={0.8} />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 1.08, -0.9]} castShadow>
                <boxGeometry args={[0.72, 0.42, 0.025]} />
                <meshStandardMaterial color={0x111118} roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Screen glow */}
            <mesh position={[0, 1.08, -0.885]}>
                <boxGeometry args={[0.64, 0.34, 0.002]} />
                <meshStandardMaterial
                    color={0x0a1628}
                    roughness={0.1}
                    metalness={0}
                    emissive={0x1a3a6a}
                    emissiveIntensity={0.8}
                />
            </mesh>
            {/* Screen ambient light */}
            <pointLight position={[0, 1.08, -0.87]} color="#1a5fff" intensity={0.4} distance={2} decay={2} />
        </group>
    );
}
