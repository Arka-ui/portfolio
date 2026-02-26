"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useChristmas } from "@/context/ChristmasContext";

const LIGHT_COLORS = [
    "#ef4444", // Red
    "#22c55e", // Green
    "#3b82f6", // Blue
    "#eab308", // Gold/Yellow
    "#a855f7", // Purple
];

type Light = {
    id: number;
    x: number;
    y: number;
    rotation: number;
    colorIndex: number;
    isFalling: boolean;
};

export default function ChristmasTheme() {
    const { isChristmasTime } = useChristmas();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lights, setLights] = useState<Light[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize & Resize Handler
    useEffect(() => {
        if (!isChristmasTime) return;

        const handleResize = () => {
            if (!containerRef.current) return;
            // Ensure window exists
            if (typeof window === 'undefined') return;

            const width = window.innerWidth;

            // Curve parameters (same as before)
            const h = 80; // Sag height
            const w = width;

            const P0 = { x: 0, y: 0 };
            const P1 = { x: w / 2, y: 150 };
            const P2 = { x: w, y: 0 };

            const count = Math.floor(w / 60);
            const newLights: Light[] = [];

            for (let i = 0; i < count; i++) {
                const t = (i + 1) / (count + 1);
                // Position
                const lx = (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x;
                const ly = (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y;

                // Derivative (Tangent vector)
                const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
                const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);

                const angle = Math.atan2(dy, dx);
                const rotationDeg = (angle * 180) / Math.PI;

                newLights.push({
                    id: i,
                    x: lx,
                    y: ly,
                    rotation: rotationDeg + 90,
                    colorIndex: i % LIGHT_COLORS.length,
                    isFalling: false,
                });
            }

            setLights(prev => {
                if (prev.length === 0) return newLights;
                // Simple reset on resize
                return newLights;
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isChristmasTime]);


    const handleLightClick = (id: number) => {
        setLights((prev) =>
            prev.map((l) => {
                if (l.id !== id || l.isFalling) return l;
                const nextColorIndex = (l.colorIndex + 1) % LIGHT_COLORS.length;
                return { ...l, colorIndex: nextColorIndex };
            })
        );
    };

    const handleLightDrop = (id: number) => {
        setLights((prev) => prev.map(l => l.id === id ? { ...l, isFalling: true } : l));
    }

    // Snowfall Logic
    useEffect(() => {
        if (!isChristmasTime || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const snowflakes: { x: number; y: number; radius: number; speed: number; wind: number }[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createSnowflakes = () => {
            const count = Math.floor(window.innerWidth / 3);
            snowflakes.length = 0;
            for (let i = 0; i < count; i++) {
                snowflakes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    speed: Math.random() * 1.5 + 0.5,
                    wind: Math.random() * 0.5 - 0.25,
                });
            }
        };

        const updateSnowflakes = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.beginPath();
            snowflakes.forEach((flake) => {
                flake.y += flake.speed;
                flake.x += flake.wind;
                if (flake.y > canvas.height) {
                    flake.y = 0;
                    flake.x = Math.random() * canvas.width;
                }
                if (flake.x > canvas.width) flake.x = 0;
                else if (flake.x < 0) flake.x = canvas.width;

                ctx.moveTo(flake.x, flake.y);
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            });
            ctx.fill();
        };

        const loop = () => {
            updateSnowflakes();
            animationFrameId = requestAnimationFrame(loop);
        };

        resizeCanvas();
        createSnowflakes();
        loop();
        window.addEventListener("resize", resizeCanvas);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [isChristmasTime]);

    // Apply christmas-mode class
    useEffect(() => {
        if (isChristmasTime) {
            document.body.classList.add("christmas-mode");
        } else {
            document.body.classList.remove("christmas-mode");
        }
    }, [isChristmasTime]);

    if (!isChristmasTime) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" ref={containerRef}>
            {/* Frost Vignette */}
            <div className="absolute inset-0 frost-vignette opacity-50" />

            {/* Snowfall Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Light Rope SVG */}
            <svg className="absolute top-0 left-0 w-full h-40 overflow-visible pointer-events-none">
                <path
                    // M 0,0 Q w/2,150 w,0
                    d={`M0,0 Q${typeof window !== 'undefined' ? window.innerWidth / 2 : 500},150 ${typeof window !== 'undefined' ? window.innerWidth : 1000},0`}
                    fill="none"
                    stroke="#166534"
                    strokeWidth="3"
                    className="opacity-90 drop-shadow-md"
                />
            </svg>

            {/* Lights */}
            {lights.map((light) => (
                <div
                    key={light.id}
                    className={`absolute w-6 h-6 rounded-full cursor-pointer pointer-events-auto transition-transform hover:scale-125 hover:brightness-125 ${light.isFalling ? 'animate-[fall_1.5s_ease-in_forwards]' : ''}`}
                    style={{
                        left: light.x - 12,
                        top: light.y,
                        backgroundColor: LIGHT_COLORS[light.colorIndex],
                        boxShadow: `0 0 15px 5px ${LIGHT_COLORS[light.colorIndex]}`,
                        // Apply calculated rotation
                        // Note: If falling, animation controls transform. If not falling, we apply static rotation + swing
                        // But we can combine them or just set initial rotation?
                        // Since we want them "rigidly attached" per user request (opposite curve), let's rely on transform.
                        transform: light.isFalling ? undefined : `rotate(${light.rotation}deg)`,
                    }}
                    onClick={() => handleLightClick(light.id)}
                    onDoubleClick={() => handleLightDrop(light.id)}
                >
                    {/* Socket */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-3 bg-gray-800 rounded-sm" />
                </div>
            ))}
        </div>
    );
}
