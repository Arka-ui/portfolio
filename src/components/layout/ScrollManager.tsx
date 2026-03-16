"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useWarp } from "@/context/WarpContext";

export default function ScrollManager() {
    const { registerLenis } = useWarp();

    useEffect(() => {
        const mobile = window.innerWidth < 768;

        const lenis = new Lenis({
            // Mobile: shorter duration feels native; desktop: cinematic 1.2s
            duration: mobile ? 0.8 : 1.2,
            // Mobile: cubic ease-out (feels like native iOS momentum)
            // Desktop: expo-out (editorial snap)
            easing: mobile
                ? (t: number) => 1 - Math.pow(1 - t, 3)
                : (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: !mobile,
            wheelMultiplier: 1,
        });

        registerLenis(lenis);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
