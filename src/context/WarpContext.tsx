"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Lenis from "lenis";

interface WarpContextType {
    isWarping: boolean;
    warpTo: (targetId: string) => void;
    lenis: Lenis | null;
    registerLenis: (instance: Lenis) => void;
}

const WarpContext = createContext<WarpContextType | undefined>(undefined);

export function WarpProvider({ children }: { children: ReactNode }) {
    const [isWarping, setIsWarping] = useState(false);
    const [lenis, setLenis] = useState<Lenis | null>(null);

    const warpTo = (targetId: string) => {
        if (!lenis) {
            // Fallback for no Lenis
            const el = document.querySelector(targetId);
            el?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // 1. Engage Warp
        setIsWarping(true);

        // 2. Calculate time based on distance (Basic) or fixed duration
        // We want a "Cinematic" long scroll for the warp effect
        const target = document.querySelector(targetId) as HTMLElement;
        if (!target) {
            setIsWarping(false);
            return;
        }

        setTimeout(() => {
            lenis.scrollTo(target, {
                duration: 2.0,
                lock: true, // Lock user interaction during warp
                easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 // EaseInOutCubic
            });
        }, 100); // Slight delay for entrance animation

        // 3. Disengage Warp after arrival
        setTimeout(() => {
            setIsWarping(false);
        }, 2200); // 2.0s duration + 200ms buffer
    };

    const registerLenis = (instance: Lenis) => {
        setLenis(instance);
    };

    return (
        <WarpContext.Provider value={{ isWarping, warpTo, lenis, registerLenis }}>
            {children}
        </WarpContext.Provider>
    );
}

export function useWarp() {
    const context = useContext(WarpContext);
    if (!context) throw new Error("useWarp must be used within a WarpProvider");
    return context;
}
