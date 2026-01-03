"use client";

import Navbar from "@/components/layout/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";
import Footer from "@/components/layout/Footer";
import BlueprintOverlay from "@/components/BlueprintOverlay";
import BlueprintCursor from "@/components/BlueprintCursor";
import BlueprintGrid from "@/components/BlueprintGrid";
import { ChristmasProvider } from "@/context/ChristmasContext";
import ChristmasTheme from "@/components/ChristmasTheme";
import SystemFailure from "@/components/ui/SystemFailure";
import Preloader from "@/components/ui/Preloader";
import { useSystemTelemetry } from "@/lib/sys-core";

export default function RootContent({ children }: { children: React.ReactNode }) {
    const health = useSystemTelemetry();

    if (health.status === 'critical') {
        return <SystemFailure />;
    }

    return (
        <ChristmasProvider>
            <ChristmasTheme />
            <Preloader />
            <BlueprintOverlay />
            <BlueprintCursor />
            <BlueprintGrid />
            <InteractiveBackground />
            <Navbar />
            <main className="min-h-screen pt-16">
                {children}
            </main>
            <Footer />
        </ChristmasProvider>
    );
}
