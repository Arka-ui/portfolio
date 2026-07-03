"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useWarp } from "@/context/WarpContext";

export default function ScrollManager() {
    const { registerLenis } = useWarp();

    useEffect(() => {
        const desktopQuery = window.matchMedia("(min-width: 768px)");
        let lenis: Lenis | null = null;
        let rafId = 0;

        const raf = (time: number) => {
            lenis?.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        const init = () => {
            lenis?.destroy();
            const mobile = !desktopQuery.matches;
            lenis = new Lenis({
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
        };

        init();
        rafId = requestAnimationFrame(raf);
        desktopQuery.addEventListener("change", init);

        return () => {
            desktopQuery.removeEventListener("change", init);
            cancelAnimationFrame(rafId);
            lenis?.destroy();
            lenis = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
