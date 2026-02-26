"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileHUD from "@/components/layout/MobileHUD";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CursorGlow from "@/components/ui/CursorGlow";

export default function RootContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollProgress />
            <CursorGlow />
            <Navbar />
            <MobileHUD />
            <main className="min-h-screen pb-mobile-hud md:pb-0">
                {children}
            </main>
            <Footer />
        </>
    );
}
