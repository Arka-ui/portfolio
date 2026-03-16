"use client";

import { useEffect, useRef } from "react";
import { useBlueprint } from "@/context/BlueprintContext";
import { useSystemTelemetry } from "@/lib/sys-core";
import SystemFailure from "@/components/ui/SystemFailure";

export default function InteractiveBackground() {
    const { isBlueprintMode } = useBlueprint();
    const health = useSystemTelemetry();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // On mobile (<768px) skip the canvas entirely — use CSS gradient only
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    useEffect(() => {
        // Mobile: no canvas animation — static gradient is enough
        if (window.innerWidth < 768) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = 0;
        let height = 0;
        let paused = false;
        const mouse = { x: -1000, y: -1000 };

        const COLORS = {
            particle:     isBlueprintMode ? "rgba(255, 255, 255, 0.9)" : "rgba(99, 102, 241, 0.6)",
            particleGlow: isBlueprintMode ? "rgba(0, 100, 255, 0.4)"  : "rgba(34, 211, 238, 0.4)",
            line:         isBlueprintMode ? "rgba(0, 100, 255, 0.15)" : "rgba(99, 102, 241, 0.1)",
        };

        class Particle {
            x: number; y: number;
            vx: number; vy: number;
            size: number; baseSize: number;
            angle: number; spin: number;
            brightness: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.baseSize = Math.random() * 2;
                this.size = this.baseSize;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.02;
                this.brightness = Math.random();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const interactionRadius = 200;

                if (distance < interactionRadius) {
                    const force = (interactionRadius - distance) / interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    this.vx -= Math.cos(angle) * force * 0.02;
                    this.vy -= Math.sin(angle) * force * 0.02;
                    this.size = this.baseSize * (1 + force * 2);
                    this.brightness = Math.min(1, this.brightness + 0.1);
                } else {
                    this.size += (this.baseSize - this.size) * 0.05;
                    this.brightness += (Math.random() * 0.5 - this.brightness) * 0.01;
                }

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.globalAlpha = 0.4 + this.brightness * 0.4;

                if (!isBlueprintMode) {
                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 3);
                    gradient.addColorStop(0, COLORS.particleGlow);
                    gradient.addColorStop(1, "transparent");
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fillStyle = COLORS.particle;
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            particles = Array.from({ length: 100 }, () => new Particle());
        };

        const animate = () => {
            if (paused) return;
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = COLORS.line;
            ctx.lineWidth = 1;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw(ctx);

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.globalAlpha = (1 - dist / 120) * 0.3;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Pause RAF when tab is hidden — saves ~100% GPU on background tab
        const handleVisibility = () => {
            paused = document.hidden;
            if (!paused) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("visibilitychange", handleVisibility);

        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("visibilitychange", handleVisibility);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isBlueprintMode]);

    if (health.status === "critical") return <SystemFailure />;

    return (
        <div ref={containerRef} className="fixed inset-0 -z-10 bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950/50 to-slate-950 pointer-events-none" />
            {/* Canvas only rendered on desktop via the useEffect guard */}
            <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
        </div>
    );
}
