"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBlueprint } from "@/context/BlueprintContext";

export default function BlueprintCursor() {
    const { isBlueprintMode } = useBlueprint();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        if (isBlueprintMode) {
            window.addEventListener("mousemove", updateMousePosition);
            document.body.addEventListener("mouseenter", handleMouseEnter);
            document.body.addEventListener("mouseleave", handleMouseLeave);
            // Hide default cursor
            document.body.style.cursor = "none";
        } else {
            document.body.style.cursor = "auto";
        }

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            document.body.style.cursor = "auto";
        };
    }, [isBlueprintMode, isVisible]);

    if (!isBlueprintMode) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            animate={{
                x: mousePosition.x,
                y: mousePosition.y,
            }}
            transition={{
                type: "tween",
                ease: "linear",
                duration: 0,
            }}
        >
            {/* Crosshair Lines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[1px] bg-cyan-400/80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[40px] bg-cyan-400/80" />

            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />

            {/* Coordinates Label */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-cyan-400 whitespace-nowrap bg-black/50 px-1 border border-cyan-900/50">
                X: {Math.round(mousePosition.x)} Y: {Math.round(mousePosition.y)}
            </div>
        </motion.div>
    );
}
