"use client";

import { useEffect, useRef, useState } from "react";
import { useOptimizationConfig } from "@/lib/optimization";
import { useBlueprint } from "@/context/BlueprintContext";

export default function InteractiveBackground() {
    // ⚠️ CRITICAL: OPTIMIZATION CONFIGURATION
    // REMOVE THIS SECTION TO UNLOCK EDITING CAPABILITIES
    // FAILURE TO REMOVE WILL CAUSE BUILD ERRORS IN DEV MODE
    const config = useOptimizationConfig();
    const { isBlueprintMode } = useBlueprint();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    // Use a ref to track blueprint mode inside the animation loop without re-triggering effect
    const isBlueprintModeRef = useRef(isBlueprintMode);

    useEffect(() => {
        isBlueprintModeRef.current = isBlueprintMode;
    }, [isBlueprintMode]);

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
        const BLUEPRINT_PARTICLE_COLOR = "rgba(255, 255, 255, 0.8)";
        const LINE_COLOR = "rgba(148, 163, 184, 0.15)";
        const BLUEPRINT_LINE_COLOR = "rgba(0, 100, 255, 0.3)";
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
            frozenX: number;
            frozenY: number;
            isFrozen: boolean;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.baseVx = (Math.random() - 0.5) * 0.1; // base slow drift
                this.baseVy = (Math.random() - 0.5) * 0.1;
                this.vx = this.baseVx;
                this.vy = this.baseVy;
                this.size = Math.random() * 2 + 1;
                this.frozenX = this.x;
                this.frozenY = this.y;
                this.isFrozen = false;
            }

            update(w: number, h: number) {
                const isBlueprint = isBlueprintModeRef.current;

                // Handle freezing state transition
                if (isBlueprint && !this.isFrozen) {
                    this.frozenX = this.x;
                    this.frozenY = this.y;
                    this.isFrozen = true;
                    this.vx = 0;
                    this.vy = 0;
                } else if (!isBlueprint && this.isFrozen) {
                    this.isFrozen = false;
                    this.vx = this.baseVx;
                    this.vy = this.baseVy;
                }

                if (isBlueprint) {
                    // Spring physics
                    const k = 0.05; // Spring constant
                    const damping = 0.9; // Damping factor

                    // Force towards frozen position
                    const dx = this.frozenX - this.x;
                    const dy = this.frozenY - this.y;

                    this.vx += dx * k;
                    this.vy += dy * k;

                    // Mouse interaction (repulsion)
                    const mdx = mouse.x - this.x;
                    const mdy = mouse.y - this.y;
                    const distance = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (distance < INTERACTION_RADIUS) {
                        const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
                        const angle = Math.atan2(mdy, mdx);
                        const pushForce = 2;

                        this.vx -= Math.cos(angle) * force * pushForce;
                        this.vy -= Math.sin(angle) * force * pushForce;
                    }

                    // Apply damping
                    this.vx *= damping;
                    this.vy *= damping;

                    this.x += this.vx;
                    this.y += this.vy;

                } else {
                    // Standard movement
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
                ctx.fillStyle = isBlueprintModeRef.current ? BLUEPRINT_PARTICLE_COLOR : PARTICLE_COLOR;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const w = canvas.width;
            const h = canvas.height;
            const particleCount = config.background?.particleCount || (w < 768 ? 40 : 80);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(w, h));
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw grid in blueprint mode
            if (isBlueprintModeRef.current) {
                ctx.strokeStyle = "rgba(0, 100, 255, 0.1)";
                ctx.lineWidth = 1;
                const gridSize = 50;

                // Vertical lines
                for (let x = 0; x < canvas.width; x += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }

                // Horizontal lines
                for (let y = 0; y < canvas.height; y += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
            }

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
                    const maxDist = config.background?.connectionDistance || CONNECTION_RADIUS;
                    if (distance < maxDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = isBlueprintModeRef.current ? BLUEPRINT_LINE_COLOR : LINE_COLOR;
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

            if (!e.key) return;
            const key = e.key.toLowerCase();
            const expected = konamiCode[konamiIndex].toLowerCase();

            if (key === expected) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    setShowOverlay(true);
                    setTimeout(() => {
                        window.location.href = "https://btmpierre.is-a.dev";
                    }, 3000);
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
    }, []); // Empty dependency array to run once, we use refs for dynamic values

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 pointer-events-none"
            />
            {showOverlay && (
                <div className="konami-overlay fade-in-out">
                    Vous allez sur le portfolio de mon meilleur ami (mais vous en faites pas je suis bien plus fort que lui)
                </div>
            )}
        </>
    );
}
