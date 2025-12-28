"use client";

import { useWarp } from "@/context/WarpContext";
import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion, useTransform } from "framer-motion";

export default function KineticBlur() {
    const { lenis } = useWarp();
    const blurAmount = useMotionValue(0);
    const smoothBlur = useSpring(blurAmount, { damping: 20, stiffness: 200, mass: 0.5 });

    useEffect(() => {
        if (!lenis) return;

        const handleScroll = (e: any) => {
            // e.velocity is the scroll velocity
            const velocity = Math.abs(e.velocity);
            // Map velocity to blur amount (0 to 10px max)
            // Default max velocity on glide can be high (~50-100)
            const calculatedBlur = Math.min(velocity * 0.05, 8);
            blurAmount.set(calculatedBlur);
        };

        lenis.on('scroll', handleScroll);

        return () => {
            lenis.off('scroll', handleScroll);
        };
    }, [lenis, blurAmount]);

    // We apply this as a fixed overlay that uses backdrop-filter?
    // OR we inject a style to the body/main?
    // Backdrop filter on a top layer is easiest but might have perf cost.
    // Actually, blurring the whole screen via backdrop filter might look like a "fog".
    // A better "Motion Blur" effect is hard in CSS (needs SVG filters for direction).
    // Simple vertical blur:

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[40]"
            style={{
                backdropFilter: useTransform(smoothBlur, (v) => `blur(${v}px)`),
                WebkitBackdropFilter: useTransform(smoothBlur, (v) => `blur(${v}px)`),
            }}
        />
    );
}
