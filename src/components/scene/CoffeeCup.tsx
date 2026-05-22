"use client";

import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CoffeeCupProps {
    position: [number, number, number];
    onContactOpen: () => void;
}

export function CoffeeCup({ position, onContactOpen }: CoffeeCupProps) {
    const groupRef = useRef<THREE.Group>(null);
    const steamsRef = useRef<THREE.Points>(null);
    const [hovered, setHovered] = useState(false);

    const baseY = position[1];

    // Deterministic pseudo-random helper so particle init is render-pure.
    const seeded = (index: number, seed: number) => {
        const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
        return x - Math.floor(x);
    };

    // Steam particle system
    const { positions, velocities } = useMemo(() => {
        const count = 30;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x0 = seeded(i, 1);
            const y0 = seeded(i, 2);
            const z0 = seeded(i, 3);
            const vx = seeded(i, 4);
            const vy = seeded(i, 5);
            const vz = seeded(i, 6);

            positions[i * 3] = (x0 - 0.5) * 0.04;
            positions[i * 3 + 1] = y0 * 0.1;
            positions[i * 3 + 2] = (z0 - 0.5) * 0.04;
            velocities[i * 3] = (vx - 0.5) * 0.001;
            velocities[i * 3 + 1] = 0.003 + vy * 0.003;
            velocities[i * 3 + 2] = (vz - 0.5) * 0.001;
        }
        return { positions, velocities };
    }, []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        // Hover bounce
        const targetY = hovered ? baseY + 0.05 : baseY;
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * Math.min(delta * 6, 1);

        // Animate steam particles
        if (steamsRef.current) {
            const geo = steamsRef.current.geometry;
            const pos = geo.attributes.position.array as Float32Array;
            const count = pos.length / 3;
            for (let i = 0; i < count; i++) {
                pos[i * 3] += velocities[i * 3] * 60 * delta;
                pos[i * 3 + 1] += velocities[i * 3 + 1] * 60 * delta;
                pos[i * 3 + 2] += velocities[i * 3 + 2] * 60 * delta;
                // Reset when risen too high
                if (pos[i * 3 + 1] > 0.35) {
                    pos[i * 3] = (Math.random() - 0.5) * 0.04;
                    pos[i * 3 + 1] = 0;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
                }
            }
            geo.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={onContactOpen}
            onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
            onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
            {/* Saucer */}
            <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.015, 24]} />
                <meshStandardMaterial color={0xeeeee0} roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Cup body (tapered cylinder) */}
            <mesh position={[0, 0.035, 0]} castShadow>
                <cylinderGeometry args={[0.055, 0.048, 0.088, 24]} />
                <meshStandardMaterial
                    color={hovered ? 0xd4603c : 0xc8c0b0}
                    roughness={0.25}
                    metalness={0.1}
                />
            </mesh>

            {/* Coffee liquid surface */}
            <mesh position={[0, 0.068, 0]}>
                <cylinderGeometry args={[0.048, 0.048, 0.004, 24]} />
                <meshStandardMaterial color={0x2c1005} roughness={0.1} metalness={0} />
            </mesh>

            {/* Handle */}
            <mesh position={[0.072, 0.028, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.025, 0.007, 8, 20, Math.PI]} />
                <meshStandardMaterial color={0xc8c0b0} roughness={0.25} metalness={0.1} />
            </mesh>

            {/* Steam particles */}
            <points ref={steamsRef} position={[0, 0.08, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={0xffffff}
                    size={0.012}
                    transparent
                    opacity={0.35}
                    sizeAttenuation
                    depthWrite={false}
                />
            </points>
        </group>
    );
}
