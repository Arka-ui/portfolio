"use client";

import React, { useEffect, useRef } from "react";
import { useChristmas } from "@/context/ChristmasContext";

export default function ChristmasTheme() {
    const { isChristmasTime } = useChristmas();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Apply christmas-mode class to body
    useEffect(() => {
        if (isChristmasTime) {
            document.body.classList.add("christmas-mode");
        } else {
            document.body.classList.remove("christmas-mode");
        }
    }, [isChristmasTime]);

    // Snowfall Effect
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
            const count = Math.floor(window.innerWidth / 4); // Adjust density
            for (let i = 0; i < count; i++) {
                snowflakes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * 1 + 0.5,
                    wind: Math.random() * 0.5 - 0.25,
                });
            }
        };

        const drawSnowflakes = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            snowflakes.forEach((flake) => {
                ctx.moveTo(flake.x, flake.y);
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            });
            ctx.fill();
        };

        const updateSnowflakes = () => {
            snowflakes.forEach((flake) => {
                flake.y += flake.speed;
                flake.x += flake.wind;

                if (flake.y > canvas.height) {
                    flake.y = 0;
                    flake.x = Math.random() * canvas.width;
                }
                if (flake.x > canvas.width) {
                    flake.x = 0;
                } else if (flake.x < 0) {
                    flake.x = canvas.width;
                }
            });
        };

        const loop = () => {
            drawSnowflakes();
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

    if (!isChristmasTime) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Snowfall Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Top Decoration - Garland/Lights */}
            <div className="absolute top-0 left-0 w-full h-16 flex justify-between items-start overflow-hidden opacity-90">
                <div className="w-full h-4 bg-gradient-to-r from-red-600 via-green-700 to-red-600 blur-sm opacity-50 absolute top-0" />
                {/* Simple CSS-based lights */}
                <div className="w-full flex justify-around -mt-2">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] ${i % 2 === 0 ? 'bg-red-500 animate-[twinkle_2s_infinite]' : 'bg-yellow-400 animate-[twinkle_3s_infinite_0.5s]'
                                }`}
                            style={{ animationDelay: `${Math.random() * 2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
