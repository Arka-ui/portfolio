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
            if (targetId === "#" || targetId === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            const el = document.querySelector(targetId);
            el?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Kinetic Glide Logic
        // 1. Handle Home / Top
        if (targetId === "#" || targetId === "/") {
            lenis.scrollTo(0, {
                duration: 1.5,
                easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // ExpoOut for "Glide"
            });
            return;
        }

        // 2. Locate Target
        const target = document.querySelector(targetId) as HTMLElement;
        if (!target) {
            console.warn(`Target ${targetId} not found`);
            return;
        }

        // 3. Glide
        lenis.scrollTo(target, {
            duration: 1.5,
            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // ExpoOut for "Glide"
        });
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
