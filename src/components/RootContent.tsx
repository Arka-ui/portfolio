"use client";

import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";
import { BlueprintProvider } from "@/context/BlueprintContext";
import Footer from "@/components/Footer";
import BlueprintOverlay from "@/components/BlueprintOverlay";
import BlueprintCursor from "@/components/BlueprintCursor";
import BlueprintGrid from "@/components/BlueprintGrid";
import SystemFailure from "@/components/ui/SystemFailure";
import { useSystemTelemetry } from "@/lib/sys-core";

export default function RootContent({ children }: { children: React.ReactNode }) {
    const health = useSystemTelemetry();

    if (health.status === 'critical') {
        return <SystemFailure />;
    }

    return (
        <BlueprintProvider>
            <BlueprintOverlay />
            <BlueprintCursor />
            <BlueprintGrid />
            <InteractiveBackground />
            <Navbar />
            <main className="min-h-screen pt-16">
                {children}
            </main>
            <Footer />
        </BlueprintProvider>
    );
}
