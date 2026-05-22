"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

interface BookProps {
    position: [number, number, number];
    onOpen: () => void;
}

export function Book({ position, onOpen }: BookProps) {
    const groupRef = useRef<THREE.Group>(null);
    const coverRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [opened, setOpened] = useState(false);

    const baseY = position[1];

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        if (animating || opened) return;

        // Subtle hover levitate
        const target = hovered ? baseY + 0.06 : baseY;
        groupRef.current.position.y += (target - groupRef.current.position.y) * Math.min(delta * 5, 1);

        // Gentle idle Y rotation when hovered
        if (hovered) {
            groupRef.current.rotation.y += delta * 0.4;
        } else {
            groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * Math.min(delta * 3, 1);
        }
    });

    function handleClick() {
        if (animating || opened || !groupRef.current) return;
        setAnimating(true);

        const tl = gsap.timeline({
            onComplete: () => {
                setAnimating(false);
                setOpened(true);
                onOpen();
                // Hide the 3D book once overlay is shown
                if (groupRef.current) groupRef.current.visible = false;
            },
        });

        // 1. Rise up
        tl.to(groupRef.current.position, { y: baseY + 0.6, duration: 0.5, ease: "power2.inOut" })
            // 2. Slight rotation
            .to(groupRef.current.rotation, { y: Math.PI * 0.15, duration: 0.3, ease: "power1.inOut" }, "-=0.2")
            // 3. Scale up slightly
            .to(groupRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3, ease: "power2.out" }, "<")
            // 4. Flash out
            .to(groupRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.25, ease: "power2.in" });
    }

    const bookW = 0.4;
    const bookH = 0.55;
    const bookD = 0.07;

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={handleClick}
            onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
            onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
            {/* Book body */}
            <mesh castShadow receiveShadow ref={coverRef}>
                <boxGeometry args={[bookW, bookH, bookD]} />
                <meshStandardMaterial
                    color={hovered ? 0xc84b2f : 0x8b1a0a}
                    roughness={0.9}
                    metalness={0.05}
                    emissive={hovered ? 0x4a0f04 : 0x000000}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Spine highlight */}
            <mesh position={[-bookW / 2 + 0.004, 0, 0]}>
                <boxGeometry args={[0.008, bookH - 0.01, bookD - 0.01]} />
                <meshStandardMaterial color={0xb8860b} roughness={0.6} metalness={0.3} />
            </mesh>

            {/* Pages side */}
            <mesh position={[bookW / 2 - 0.008, 0, 0]}>
                <boxGeometry args={[0.012, bookH - 0.02, bookD - 0.015]} />
                <meshStandardMaterial color={0xfaf7f2} roughness={1} metalness={0} />
            </mesh>

            {/* Cover embossed title (thin box) */}
            <mesh position={[0, 0.08, bookD / 2 + 0.001]}>
                <boxGeometry args={[0.22, 0.04, 0.002]} />
                <meshStandardMaterial color={0xb8860b} roughness={0.5} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0, bookD / 2 + 0.001]}>
                <boxGeometry args={[0.28, 0.015, 0.002]} />
                <meshStandardMaterial color={0xb8860b} roughness={0.5} metalness={0.4} />
            </mesh>
        </group>
    );
}
