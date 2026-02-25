"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileHUD from "@/components/layout/MobileHUD";

export default function RootContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <MobileHUD />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
