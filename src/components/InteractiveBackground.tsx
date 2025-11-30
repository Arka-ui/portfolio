"use client";

import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 };
        let isOrionMode = false;

        // Configuration
        const PARTICLE_COLOR = "rgba(148, 163, 184, 0.5)"; // slate-400 with opacity
        const LINE_COLOR = "rgba(148, 163, 184, 0.15)";
        const INTERACTION_RADIUS = 150;
        const CONNECTION_RADIUS = 150;

        // Konami Code (user‑requested order)
        const konamiCode = [
            "ArrowUp",
            "ArrowDown",
            "ArrowUp",
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

        // Orion constellation – detailed version with brightness and names
        const orionStars = [
            // Tête et épaules (5 étoiles)
            { x: 0.25, y: 0.15, brightness: 1.0, name: "Betelgeuse (α Ori)" }, // 0
            { x: 0.75, y: 0.1, brightness: 0.9, name: "Bellatrix (γ Ori)" },   // 1
            { x: 0.5, y: 0.05, brightness: 0.8, name: "Meissa (λ Ori)" },    // 2
            { x: 0.4, y: 0.12, brightness: 0.6, name: "φ¹ Ori" },            // 3
            { x: 0.6, y: 0.08, brightness: 0.5, name: "φ² Ori" },            // 4

            // Ceinture (3 étoiles)
            { x: 0.3, y: 0.45, brightness: 0.9, name: "Alnitak (ζ Ori)" },   // 5
            { x: 0.5, y: 0.5, brightness: 1.0, name: "Alnilam (ε Ori)" },    // 6
            { x: 0.7, y: 0.56, brightness: 0.9, name: "Mintaka (δ Ori)" },   // 7

            // Épée et jambes (7 étoiles)
            { x: 0.45, y: 0.65, brightness: 0.7, name: "ι Ori" },            // 8
            { x: 0.55, y: 0.7, brightness: 0.6, name: "θ¹ Ori" },            // 9
            { x: 0.52, y: 0.72, brightness: 0.5, name: "θ² Ori" },           // 10
            { x: 0.58, y: 0.66, brightness: 0.4, name: "44 Orionis" },       // 11
            { x: 0.18, y: 0.82, brightness: 0.8, name: "Saiph (κ Ori)" },    // 12
            { x: 0.82, y: 0.88, brightness: 1.0, name: "Rigel (β Ori)" },    // 13
            { x: 0.40, y: 0.78, brightness: 0.4, name: "χ¹ Ori" }            // 14
        ];

        // Connections for the detailed Orion constellation (indices correspond to orionStars array)
        const orionConnections: [number, number][] = [
            // Tête et épaules
            [0, 1], [0, 3], [1, 4], [0, 2], [1, 2],
            // Bras
            [1, 5], [5, 7],
            // Torse (connecting shoulders to belt)
            [1, 9], [2, 11], [3, 9], [4, 11],
            // Ceinture
            [5, 6], [6, 7],
            // Épée
            [5, 8], [6, 8], [6, 9], [7, 9],
            // Jambes
            [5, 10], [7, 11],
            [8, 10], [9, 11]
        ];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            baseVx: number;
            baseVy: number;
            targetX?: number;
            targetY?: number;
            name?: string;

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
                if (isOrionMode && this.targetX !== undefined && this.targetY !== undefined) {
                    const dx = this.targetX - this.x;
                    const dy = this.targetY - this.y;
                    this.x += dx * 0.05;
                    this.y += dy * 0.05;
                    this.vx = 0;
                    this.vy = 0;
                } else {
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
            const particleCount = w < 768 ? 40 : 80;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(w, h));
            }
        };

        const triggerOrion = () => {
            isOrionMode = true;
            const w = canvas.width;
            const h = canvas.height;
            const boxWidth = Math.min(350, w * 0.5);
            const boxHeight = Math.min(500, h * 0.7);
            const startX = w * 0.1;
            const startY = (h - boxHeight) / 2;

            orionStars.forEach((star, idx) => {
                if (particles[idx]) {
                    particles[idx].targetX = startX + star.x * boxWidth;
                    particles[idx].targetY = startY + star.y * boxHeight;
                    // Use brightness to influence visual size (optional)
                    particles[idx].size = Math.max(2, star.brightness * 2);
                    particles[idx].name = star.name;
                }
            });
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
                if (isOrionMode && index < orionStars.length) {
                    // Orion specific connections
                    orionConnections.forEach(([i, j]) => {
                        if (index === i && particles[j]) {
                            const b = particles[j];
                            ctx.beginPath();
                            ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
                            ctx.lineWidth = 1.5;
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    });

                    // Hover label
                    if (a.name) {
                        const dx = mouse.x - a.x;
                        const dy = mouse.y - a.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 30) {
                            ctx.font = "14px Inter, sans-serif";
                            ctx.fillStyle = "rgba(255,255,255,0.9)";
                            ctx.textAlign = "center";
                            ctx.fillText(a.name, a.x, a.y - 15);
                        }
                    }
                }

                // Standard connections for non‑Orion particles
                for (let i = index + 1; i < particles.length; i++) {
                    // skip drawing between two Orion particles (already handled above)
                    if (isOrionMode && index < orionStars.length && i < orionStars.length) continue;
                    const b = particles[i];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < CONNECTION_RADIUS) {
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
            if (isOrionMode) triggerOrion();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();
            if (now - lastKeyTime > 5000) konamiIndex = 0;
            lastKeyTime = now;
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    triggerOrion();
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
            className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
        />
    );
}
