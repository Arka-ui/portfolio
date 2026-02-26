"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useWarp } from "@/context/WarpContext";

export default function ScrollManager() {
    const { registerLenis } = useWarp();

    useEffect(() => {
        // Skip smooth scroll on touch devices — native momentum is better
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        registerLenis(lenis);

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [registerLenis]);

    return null;
}
