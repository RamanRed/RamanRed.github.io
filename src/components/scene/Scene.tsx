"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Desk } from "./Desk";
import { Book } from "./Book";
import { CoffeeCup } from "./CoffeeCup";
import { DeskItems } from "./DeskItems";
import { useBookState } from "@/hooks/useBookState";

export default function Scene() {
    const { openBook, openContact } = useBookState();

    useEffect(() => {
        // Signal loading screen to fade out after scene mounts
        const timer = setTimeout(() => {
            // Dismiss whichever loading screen variant is present
            document.querySelector(".loading-screen")?.classList.add("hidden");
            document.querySelector(".loading-screen-v2")?.classList.add("hidden");
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Canvas
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 2.8, 5.5], fov: 42 }}
            shadows
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => {
                gl.setClearColor(0x0a0a0f, 1);
            }}
        >
            {/* Lighting — no external HDR/env map needed */}
            <ambientLight intensity={0.45} />
            {/* Hemisphere light: sky colour from above, ground colour below */}
            <hemisphereLight args={[0x223366, 0x3d2010, 0.6]} />
            <directionalLight
                position={[5, 8, 3]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={0.1}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            {/* Warm desk lamp fill */}
            <pointLight position={[-1.5, 2.2, 0.5]} color="#ffaa44" intensity={0.9} distance={6} decay={2} />
            {/* Cool backlight */}
            <pointLight position={[2, 1, -2]} color="#4488ff" intensity={0.3} distance={8} decay={2} />
            {/* Rim light */}
            <pointLight position={[0, 4, -3]} color="#ffffff" intensity={0.4} distance={10} decay={2} />

            <Suspense fallback={null}>
                {/* Scene objects */}
                <Desk />
                <Book position={[0.3, 0.78, 0.1]} onOpen={openBook} />
                <CoffeeCup position={[-0.85, 0.78, 0.3]} onContactOpen={openContact} />
                <DeskItems />
            </Suspense>
        </Canvas>
    );
}
