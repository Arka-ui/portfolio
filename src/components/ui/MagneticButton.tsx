"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useRef, MouseEvent, ReactNode } from "react";

export default function MagneticButton({ children, className = "" }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: MouseEvent) => {
        // Skip on touch devices — mousemove fires on touchmove and conflicts with scroll
        if (window.matchMedia("(hover: none)").matches) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        x.set((clientX - (left + width / 2)) * 0.35);
        y.set((clientY - (top + height / 2)) * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
