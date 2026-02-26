"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A soft, slow-following radial glow that tracks the cursor.
 * Desktop only, invisible to screen readers and pointer events.
 * Gives the page a subtle depth — Arka's signature ambient layer.
 */
export default function CursorGlow() {
    const rawX = useMotionValue(-600);
    const rawY = useMotionValue(-600);

    // Soft spring — intentionally laggy for a dreamy feel
    const x = useSpring(rawX, { stiffness: 55, damping: 22, restDelta: 0.5 });
    const y = useSpring(rawY, { stiffness: 55, damping: 22, restDelta: 0.5 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            rawX.set(e.clientX);
            rawY.set(e.clientY);
        };
        window.addEventListener("mousemove", move, { passive: true });
        return () => window.removeEventListener("mousemove", move);
    }, [rawX, rawY]);

    return (
        <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[0] hidden md:block overflow-hidden"
        >
            <motion.div
                className="absolute"
                style={{
                    x,
                    y,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(99,102,241,0.055) 0%, rgba(139,92,246,0.03) 45%, transparent 70%)",
                    filter: "blur(8px)",
                }}
            />
        </motion.div>
    );
}
