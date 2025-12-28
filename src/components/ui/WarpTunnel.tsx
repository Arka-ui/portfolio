"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWarp } from "@/context/WarpContext";
import { useEffect, useRef } from "react";

export default function WarpTunnel() {
    const { isWarping } = useWarp();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isWarping) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrame: number;

        // Speed Line Particle
        class Star {
            x: number;
            y: number;
            z: number;

            constructor() {
                this.x = (Math.random() - 0.5) * canvas!.width * 2;
                this.y = (Math.random() - 0.5) * canvas!.height * 2;
                this.z = Math.random() * 1000; // Depth
            }

            update(speed: number) {
                this.z -= speed;
                if (this.z <= 1) {
                    this.z = 1000;
                    this.x = (Math.random() - 0.5) * canvas!.width * 2;
                    this.y = (Math.random() - 0.5) * canvas!.height * 2;
                }
            }

            draw() {
                if (!ctx) return;
                const centerW = canvas!.width / 2;
                const centerH = canvas!.height / 2;

                const sx = (this.x / this.z) * 100 + centerW;
                const sy = (this.y / this.z) * 100 + centerH;

                // Trail effect
                const size = (1000 - this.z) / 1000 * 2;
                const oldX = (this.x / (this.z + 20)) * 100 + centerW;
                const oldY = (this.y / (this.z + 20)) * 100 + centerH;

                ctx.lineWidth = size;
                ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, (1000 - this.z) / 500)})`;
                ctx.beginPath();
                ctx.moveTo(oldX, oldY);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const stars = Array.from({ length: 400 }, () => new Star());
        let speed = 20;

        const render = () => {
            if (!ctx) return;
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // Trail fade
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Accel/Decel simulation
            speed = 50; // Constant high speed for the warp duration

            stars.forEach(star => {
                star.update(speed);
                star.draw();
            });

            animationFrame = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [isWarping]);

    return (
        <AnimatePresence>
            {isWarping && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] pointer-events-none"
                >
                    {/* FOV Distortion / Chromatic Aberration Overlay */}
                    <div className="absolute inset-0 bg-black/50 mix-blend-overlay" />

                    {/* Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />

                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />

                    {/* Motion Blur Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-4xl md:text-9xl font-black text-white/5 uppercase tracking-widest animate-pulse scale-150 blur-sm">Warp Active</h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
