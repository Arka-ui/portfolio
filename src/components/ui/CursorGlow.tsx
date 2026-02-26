"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Dual-layer ambient cursor glow — Arka's signature depth effect.
 *
 * Outer: large (~720px), dim, drifts lazily behind the cursor.
 * Inner: small (~180px), more vivid, tracks more closely.
 * When hovering interactive elements, the inner layer expands and brightens.
 * Desktop only.
 */
export default function CursorGlow() {
    const rawX = useMotionValue(-800);
    const rawY = useMotionValue(-800);
    const [near, setNear] = useState(false);

    // Outer — very laggy, dreamy drift
    const outerX = useSpring(rawX, { stiffness: 38, damping: 20, restDelta: 0.5 });
    const outerY = useSpring(rawY, { stiffness: 38, damping: 20, restDelta: 0.5 });

    // Inner — responsive but still cushioned
    const innerX = useSpring(rawX, { stiffness: 170, damping: 28, restDelta: 0.3 });
    const innerY = useSpring(rawY, { stiffness: 170, damping: 28, restDelta: 0.3 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            rawX.set(e.clientX);
            rawY.set(e.clientY);
            const el = document.elementFromPoint(e.clientX, e.clientY);
            setNear(!!el?.closest("a, button, [role='button'], input, textarea"));
        };
        window.addEventListener("mousemove", move, { passive: true });
        return () => window.removeEventListener("mousemove", move);
    }, [rawX, rawY]);

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[1] hidden md:block overflow-hidden"
        >
            {/* Outer — large drifting orb */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    x: outerX,
                    y: outerY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: 720,
                    height: 720,
                    background:
                        "radial-gradient(circle, rgba(99,102,241,0.065) 0%, rgba(139,92,246,0.03) 40%, transparent 68%)",
                    filter: "blur(30px)",
                }}
            />

            {/* Inner — small reactive spot */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    x: innerX,
                    y: innerY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: near ? 280 : 190,
                    height: near ? 280 : 190,
                    background: near
                        ? "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(167,139,250,0.12) 40%, transparent 70%)"
                        : "radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(139,92,246,0.07) 50%, transparent 70%)",
                    filter: "blur(20px)",
                    transition: "width 0.35s ease, height 0.35s ease, background 0.35s ease",
                }}
            />
        </div>
    );
}
