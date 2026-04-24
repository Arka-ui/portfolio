"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { useWarp } from "@/context/WarpContext";
import { useState } from "react";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const { lenis } = useWarp();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });
    const [hoverX, setHoverX] = useState<number | null>(null);

    const handleJump = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const target = pct * max;
        if (lenis) {
            lenis.scrollTo(target, {
                duration: 1.4,
                easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            });
        } else {
            window.scrollTo({ top: target, behavior: "smooth" });
        }
    };

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverX(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
    };

    return (
        <div
            role="slider"
            aria-label="Page scroll progress — click to jump"
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={-1}
            onClick={handleJump}
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverX(null)}
            className="hidden md:block fixed top-0 left-0 right-0 h-4 z-[200] cursor-pointer group"
        >
            {/* Hit-area is 16px tall, visible bar is 2px */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#493B33]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] origin-left pointer-events-none"
                style={{
                    scaleX,
                    background: "linear-gradient(135deg, #DBC7A6 0%, #B39F85 28%, #7D6B56 55%, #B39F85 78%, #DBC7A6 100%)",
                }}
            />
            {/* Hover preview dot */}
            {hoverX !== null && (
                <div
                    className="absolute top-[1px] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DBC7A6] shadow-[0_0_10px_rgba(219,199,166,0.7)] pointer-events-none transition-opacity"
                    style={{ left: `${hoverX * 100}%` }}
                />
            )}
        </div>
    );
}
