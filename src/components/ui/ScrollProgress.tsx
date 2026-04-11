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
                background: "linear-gradient(135deg, #DBC7A6 0%, #B39F85 28%, #7D6B56 55%, #B39F85 78%, #DBC7A6 100%)",
            }}
        />
    );
}
