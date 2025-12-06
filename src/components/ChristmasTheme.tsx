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

    // Resize Handler with RequestAnimationFrame for performance
    const handleResize = useCallback(() => {
        if (!containerRef.current) return;

        const width = window.innerWidth;
        // Recalculate curve params
        // Let's us a simple quadratic curve: y = a * x * (width - x) or y = 4h/w^2 * x * (w - x) (parabola opening down)
        // Wait, catenary is like a chain. A parabola is a good enough approximation.
        // Vertex at (w/2, h), passes through (0,0) and (w,0).
        const h = 80; // Sag height
        const w = width;

        // Parabola equation for sag: y = (4 * h / w^2) * x * (w - x)
        // Actually standard rope hangs down, so let's flip: y = (4 * h / w^2) * (x - w/2)^2 ?? 
        // Let's stick to standard y = a(x-h)^2 + k form
        // Vertex is (w/2, 100)
        // Passes through (0, 0)
        // 0 = a(-w/2)^2 + 100 => a = -100 / (w^2/4) = -400/w^2
        // y = -400/w^2 * (x - w/2)^2 + 100
        // Derivative y' = 2*a*(x - w/2)

        // BUT we want it to hang down from top (y=0).
        // So Vertex (w/2, 100) is the bottommost point? NO, that's max sag.
        // 0,0 is top left. w,0 is top right.
        // Vertex is (w/2, 100)
        // y = a(x - w/2)^2 + 100 is WRONG if it opens up. 
        // Rope hangs DOWN. So it opens UP.
        // y = a(x - w/2)^2 + k.
        // k = 100 (lowest point).
        // At x=0, y=0.
        // 0 = a(-w/2)^2 + 100 => -100 = a * w^2 / 4 => a = -400 / w^2.
        // Wait, if a is negative, it opens DOWN (hill). Rope is a Valley (opens UP).
        // So (0,0) and (w,0) are attachment points.
        // Vertex (w/2, 100).
        // 0 = a(0 - w/2)^2 + 100 is wrong if vertex is valley.
        // If attached at y=0, then vertex y must be > 0.
        // y(0) = 0.
        // y(w/2) = 100.
        // y = a(x - w/2)^2 + 100? No, that would mean y(w/2) is 100. And y(0) = a(-w/2)^2 + 100.
        // If a > 0. Then y(0) > 100. 
        // Let's set attachment points at y = -20 (slightly off screen) and sag to y = 80.

        // Let's keep it simple: Standard quadratic Bezier Q control point.
        // Path: M 0,0 Q w/2,150 w,0
        // We need to sample points along this Bezier curve.
        // Bezier point B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2, for t in [0,1]
        // P0=(0,0), P1=(w/2, 150), P2=(w, 0) (Assuming straight line attachment is 0, sag control 150)

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
            // B'(t) = 2(1-t)(P1 - P0) + 2t(P2 - P1)
            const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
            const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);

            // Angle of tangent
            const angle = Math.atan2(dy, dx);
            // We want the light to hang perpendicular to the rope?
            // Or "opposite of the curve". 
            // Usually lights hang straight down (gravity). 
            // User said "curved as the opposite of the curve of the rope".
            // If the rope slopes down (left side), tangent is positive (y increases as x increases - wait y is down).
            // Standard coord: y down is positive.
            // Left side: going right(x+), y goes down(increase). Slope > 0.
            // Right side: going right(x+), y goes up(decrease). Slope < 0.
            // Tangent angle: Left ~ +45deg. Right ~ -45deg.
            // If light hangs opposite, maybe normal vector?
            // Normal is tangent + 90deg?
            // Let's try rotation = angle + Math.PI / 2.

            const rotationDeg = (angle * 180) / Math.PI;
            // Adjust: Angle is tangent. Normal is +90.
            // However, if we simply want them to point "outward" or "inward".
            // Let's try Normal.

            newLights.push({
                id: i,
                x: lx,
                y: ly,
                rotation: rotationDeg + 90, // Perpendicular to the rope
                colorIndex: i % LIGHT_COLORS.length,
                isFalling: false,
            });
        }

        // Preserve falling status if re-generating (tricky with ID matching, simplistic approach for now: reset falling on full resize is acceptable, or mapped merge)
        // Let's just reset for smooth simplicity on resize, or better:
        setLights(prev => {
            if (prev.length === 0) return newLights;
            // Try to map old states to new lights if count is similar? 
            // Too complex for typical user resize. Reset is fine, or simple ID match if count same.
            return newLights;
        });

    }, []);

    // Initialize
    useEffect(() => {
        if (!isChristmasTime) return;

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isChristmasTime, handleResize]);


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

    // Snowfall Logic (Keeping same)
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
