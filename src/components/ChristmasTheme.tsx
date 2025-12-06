"use client";

import React, { useEffect, useRef, useState } from "react";
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
    colorIndex: number;
    isFalling: boolean;
};

export default function ChristmasTheme() {
    const { isChristmasTime } = useChristmas();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lights, setLights] = useState<Light[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize Lights
    useEffect(() => {
        if (!isChristmasTime || !containerRef.current) return;

        const width = window.innerWidth;
        const count = Math.floor(width / 60); // One light every 60px
        const newLights: Light[] = [];

        for (let i = 0; i < count; i++) {
            // Calculate position on a catenary curve (simple parabola for now)
            // y = a * (x - h)^2 + k
            // Let's just do a sine wave or a simple droop
            const x = (width / (count + 1)) * (i + 1);
            // Normalized X from -1 to 1
            const nx = (i / (count - 1)) * 2 - 1;
            // y = x^2 * scale
            const y = Math.pow(nx, 2) * 50 + 10; // 10px padding from top

            newLights.push({
                id: i,
                x,
                y: y,
                colorIndex: i % LIGHT_COLORS.length,
                isFalling: false,
            });
        }
        setLights(newLights);
    }, [isChristmasTime]);

    const handleLightClick = (id: number) => {
        setLights((prev) =>
            prev.map((l) => {
                if (l.id !== id) return l;

                // If it's already falling, do nothing (or maybe reset?)
                if (l.isFalling) return l;

                // If we want a "drop" on first click, strict interpretation:
                // "click one time on each one the light drop"
                // Let's say: Click = Drop. Double click or hover = Change color? 
                // User said: "clicking on the lights change their colors but when we click one time on each one the light drop"
                // This is contradictory. Maybe "click... change color", "click one time on each one" (maybe meaning a specific action or sequence?).
                // Interpretation: Click -> Change Color. Long press or modifier + click -> Drop? 
                // OR: It changes color on click, but if you click it *while* it's a specific color or state, it drops?
                // Let's try: Click changes color. If you click it quickly (double click logic manually implemented?) or maybe regular click drops it, and hover changes color?
                // User phrasing: "clicking on the lights change their colors BUT when we click one time on each one the light drop with the rope"
                // Maybe he means: "Make it so clicking changes color, BUT [separately] make an animation where they drop".
                // Let's go with: Click changes color. Double Click drops.

                const nextColorIndex = (l.colorIndex + 1) % LIGHT_COLORS.length;
                return { ...l, colorIndex: nextColorIndex };
            })
        );
    };

    const handleLightDrop = (id: number) => {
        setLights((prev) => prev.map(l => l.id === id ? { ...l, isFalling: true } : l));
    }

    // Snowfall Effect (Same as before but refined)
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
            <svg className="absolute top-0 left-0 w-full h-32 overflow-visible pointer-events-none">
                <path
                    d={`M0,0 Q${typeof window !== 'undefined' ? window.innerWidth / 2 : 500},100 ${typeof window !== 'undefined' ? window.innerWidth : 1000},0`}
                    fill="none"
                    stroke="#166534"
                    strokeWidth="3"
                    className="opacity-80 drop-shadow-sm"
                />
            </svg>

            {/* Lights */}
            {lights.map((light) => (
                <div
                    key={light.id}
                    className={`absolute w-6 h-6 rounded-full cursor-pointer pointer-events-auto transition-transform hover:scale-125 hover:rotate-12 ${light.isFalling ? 'animate-[fall_1.5s_ease-in_forwards]' : 'animate-[swing_3s_ease-in-out_infinite]'}`}
                    style={{
                        left: light.x - 12, // center
                        top: light.y,
                        backgroundColor: LIGHT_COLORS[light.colorIndex],
                        boxShadow: `0 0 15px 5px ${LIGHT_COLORS[light.colorIndex]}`,
                        animationDelay: `${light.id * 0.1}s`, // Stagger swing
                    }}
                    onClick={() => handleLightClick(light.id)}
                    onDoubleClick={() => handleLightDrop(light.id)}
                >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-800" /> {/* Socket */}
                </div>
            ))}

            {/* Santa Animation */}
            <div className="absolute top-20 left-0 w-32 h-20 animate-[santa-fly_30s_linear_infinite_10s] opacity-80 pointer-events-none">
                {/* Simple Santa Silhouette for CSS only */}
                <div className="w-full h-full bg-contain bg-no-repeat" style={{ backgroundImage: 'url("/santa.png")' }}>
                    {/* If we had an image. Since we don't, let's make a rudimentary CSS shape or just text for now? 
                 Let's stay safer and use emojis transform or a simple SVGs within */}
                    <span className="text-6xl filter drop-shadow-lg">🎅🛷🦌</span>
                </div>
            </div>
        </div>
    );
}
