"use client";

import { createContext, useContext, ReactNode } from "react";

interface WarpContextType {
    warpTo: (targetId: string) => void;
}

const WarpContext = createContext<WarpContextType | undefined>(undefined);

export function WarpProvider({ children }: { children: ReactNode }) {
    // Native scrolling only — no smooth-scroll library. The browser handles
    // easing; reduced-motion users get an instant jump.
    const warpTo = (targetId: string) => {
        const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth";

        if (targetId === "#" || targetId === "/") {
            window.scrollTo({ top: 0, behavior });
            return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
            console.warn(`Target ${targetId} not found`);
            return;
        }
        target.scrollIntoView({ behavior, block: "start" });
    };

    return (
        <WarpContext.Provider value={{ warpTo }}>
            {children}
        </WarpContext.Provider>
    );
}

export function useWarp() {
    const context = useContext(WarpContext);
    if (!context) throw new Error("useWarp must be used within a WarpProvider");
    return context;
}
