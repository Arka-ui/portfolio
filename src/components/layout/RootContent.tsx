"use client";

import { SWRConfig } from "swr";
import { useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileHUD from "@/components/layout/MobileHUD";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { useBlueprint } from "@/context/BlueprintContext";

const SWR_CONFIG = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300_000,
};

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function KonamiListener() {
    const { toggleBlueprintMode } = useBlueprint();
    const bufferRef = useRef<string[]>([]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            bufferRef.current = [...bufferRef.current, key].slice(-KONAMI.length);
            if (bufferRef.current.length === KONAMI.length && bufferRef.current.every((k, i) => k === KONAMI[i])) {
                bufferRef.current = [];
                toggleBlueprintMode();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toggleBlueprintMode]);

    return null;
}

export default function RootContent({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={SWR_CONFIG}>
            <ScrollProgress />
            <KonamiListener />
            <Navbar />
            <MobileHUD />
            <main className="min-h-screen pb-mobile-hud md:pb-0">
                {children}
            </main>
            <Footer />
        </SWRConfig>
    );
}
