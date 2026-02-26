"use client";

import { useScroll, useSpring, motion } from "framer-motion";

/**
 * Thin gradient progress bar pinned to the very top of the viewport.
 * Grows left-to-right as the user scrolls the page.
 */
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200] pointer-events-none"
            style={{
                scaleX,
                background: "linear-gradient(to right, #6366f1, #8b5cf6, #a78bfa)",
            }}
        />
    );
}
