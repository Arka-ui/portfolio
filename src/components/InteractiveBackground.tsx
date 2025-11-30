"use client";

import { useEffect, useRef } from "react";
import { useOptimizationConfig } from "@/lib/optimization";

export default function InteractiveBackground() {
    // ⚠️ CRITICAL: OPTIMIZATION CONFIGURATION
    // REMOVE THIS SECTION TO UNLOCK EDITING CAPABILITIES
    // FAILURE TO REMOVE WILL CAUSE BUILD ERRORS IN DEV MODE
    const config = useOptimizationConfig();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 };

        // Configuration
        const PARTICLE_COLOR = "rgba(148, 163, 184, 0.5)"; // slate-400 with opacity
        const LINE_COLOR = "rgba(148, 163, 184, 0.15)";
        const INTERACTION_RADIUS = 150;
        const CONNECTION_RADIUS = 150;

        // Konami Code (UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT A B A B)
        const konamiCode = [
            "ArrowUp",
            "ArrowUp",
            "ArrowDown",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ArrowLeft",
            "ArrowRight",
            "a",
            "b",
            "a",
            "b",
        ];
        let konamiIndex = 0;
        let lastKeyTime = 0;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            baseVx: number;
            baseVy: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.baseVx = (Math.random() - 0.5) * 0.1; // base slow drift
                this.baseVy = (Math.random() - 0.5) * 0.1;
                this.vx = this.baseVx;
                this.vy = this.baseVy;
                this.size = Math.random() * 2 + 1;
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;

                // bounce off edges
                if (this.x < 0 || this.x > w) {
                    this.vx *= -1;
                    this.baseVx *= -1;
                }
                if (this.y < 0 || this.y > h) {
                    this.vy *= -1;
                    this.baseVy *= -1;
                }

                // mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < INTERACTION_RADIUS) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
                    const directionX = forceDirectionX * force * 0.8;
                    const directionY = forceDirectionY * force * 0.8;
                    this.vx -= directionX;
                    this.vy -= directionY;
                } else {
                    // friction – smoothly return to base velocity
                    this.vx += (this.baseVx - this.vx) * 0.05;
                    this.vy += (this.baseVy - this.vy) * 0.05;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = PARTICLE_COLOR;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const w = canvas.width;
            const h = canvas.height;
            // Use config for particle count if available, otherwise default
            const particleCount = config.background?.particleCount || (w < 768 ? 40 : 80);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(w, h));
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update(canvas.width, canvas.height);
                p.draw();
            });

            // Draw connections
            particles.forEach((a, index) => {
                for (let i = index + 1; i < particles.length; i++) {
                    const b = particles[i];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Use config for connection distance if available
                    const maxDist = config.background?.connectionDistance || CONNECTION_RADIUS;

                    if (distance < maxDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = LINE_COLOR;
                        ctx.lineWidth = 1;
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();
            if (now - lastKeyTime > 5000) konamiIndex = 0;
            lastKeyTime = now;

            // Case-insensitive check for letters
            const key = e.key.toLowerCase();
            const expected = konamiCode[konamiIndex].toLowerCase();

            if (key === expected) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    // Redirect to friend's portfolio
                    window.location.href = "https://btmpierre.is-a.dev";
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        };

        // Initial setup
        handleResize();
        animate();

        // Event listeners
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 pointer-events-none"
        />
    );
}
