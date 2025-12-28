"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLanyard } from "@/hooks/useLanyard";

// DISCORD ID for Lanyard
const DISCORD_ID = "871084043838566400";

interface SpectralBorderProps {
    className?: string;
    children?: React.ReactNode;
}

export default function SpectralBorder({ className, children }: SpectralBorderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { data } = useLanyard(DISCORD_ID);
    const isPlaying = !!data?.spotify;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const animate = () => {
            if (!ctx) return;
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Only draw explicit visualizer if playing music, otherwise subtle pulse
            const amplitude = isPlaying ? 5 : 2;
            const speed = isPlaying ? 0.2 : 0.05;
            const color = isPlaying ? "rgba(34, 211, 238, 0.5)" : "rgba(255, 255, 255, 0.1)"; // Cyan vs White

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            // Draw a rounded rectangle path that undulates
            const r = 24; // border radius approx

            // Top edge
            for (let x = r; x < w - r; x += 5) {
                const yOffset = Math.sin(x * 0.05 + time) * amplitude * (x % 10 === 0 ? 1 : 0.5);
                if (x === r) ctx.moveTo(x, yOffset);
                else ctx.lineTo(x, yOffset);
            }

            // Just a simple line for now to simulate the border effect "leaking"
            // Implementing a full path following border is complex, so we'll do a glow effect instead using shadow

            ctx.stroke();

            time += speed;
            animationId = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            animate();
        } else {
            // Static clear or subtle breathe
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, [isPlaying]);

    return (
        <div className={`relative ${className}`}>
            {/* The actual border visualizer layer */}
            {isPlaying && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-[inherit] z-[-1] blur-sm animate-pulse"
                />
            )}

            <motion.div
                className="relative z-10"
                animate={{
                    boxShadow: isPlaying ? "0 0 20px rgba(34, 211, 238, 0.2)" : "none"
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
