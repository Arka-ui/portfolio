"use client";

import { useScroll, useSpring, motion } from "framer-motion";

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
                background: "linear-gradient(to right, #f59e0b, #ea580c, #14b8a6)",
            }}
        />
    );
}
