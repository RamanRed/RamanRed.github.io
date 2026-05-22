"use client";

import { useRef } from "react";
import * as THREE from "three";

export function Desk() {
    const groupRef = useRef<THREE.Group>(null);

    const woodColor = 0x6b3a1f;
    const darkWood = 0x3d1f0a;
    const metalColor = 0x888890;

    return (
        <group ref={groupRef}>
            {/* Tabletop */}
            <mesh position={[0, 0.72, 0]} receiveShadow castShadow>
                <boxGeometry args={[3.8, 0.06, 2.2]} />
                <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.05} />
            </mesh>

            {/* Tabletop edge trim */}
            <mesh position={[0, 0.70, 0]}>
                <boxGeometry args={[3.85, 0.02, 2.25]} />
                <meshStandardMaterial color={darkWood} roughness={0.5} metalness={0.0} />
            </mesh>

            {/* Legs — front */}
            <mesh position={[1.7, 0.35, 0.9]} castShadow>
                <boxGeometry args={[0.07, 0.72, 0.07]} />
                <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[-1.7, 0.35, 0.9]} castShadow>
                <boxGeometry args={[0.07, 0.72, 0.07]} />
                <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Legs — back */}
            <mesh position={[1.7, 0.35, -0.9]} castShadow>
                <boxGeometry args={[0.07, 0.72, 0.07]} />
                <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[-1.7, 0.35, -0.9]} castShadow>
                <boxGeometry args={[0.07, 0.72, 0.07]} />
                <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Cross beam — front */}
            <mesh position={[0, 0.22, 0.9]}>
                <boxGeometry args={[3.37, 0.05, 0.05]} />
                <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Cross beam — back */}
            <mesh position={[0, 0.22, -0.9]}>
                <boxGeometry args={[3.37, 0.05, 0.05]} />
                <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.7} />
            </mesh>

            {/* Floor (shadow catcher) */}
            <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color={0x0e0e14} roughness={1} metalness={0} />
            </mesh>
        </group>
    );
}
