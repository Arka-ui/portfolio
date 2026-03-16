"use client";

import { SWRConfig } from "swr";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileHUD from "@/components/layout/MobileHUD";
import ScrollProgress from "@/components/ui/ScrollProgress";

// Global SWR config: never refetch on focus/reconnect (data doesn't change often)
// and cache for 5 minutes to avoid hammering the GitHub API on every tab visit
const SWR_CONFIG = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300_000, // 5 minutes
};

export default function RootContent({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={SWR_CONFIG}>
            <ScrollProgress />
            <Navbar />
            <MobileHUD />
            <main className="min-h-screen pb-mobile-hud md:pb-0">
                {children}
            </main>
            <Footer />
        </SWRConfig>
    );
}
