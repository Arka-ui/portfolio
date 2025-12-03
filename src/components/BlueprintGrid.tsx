"use client";

import { useBlueprint } from "@/context/BlueprintContext";

export default function BlueprintGrid() {
    const { isBlueprintMode } = useBlueprint();

    if (!isBlueprintMode) return null;

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#001529]">
            {/* Major Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, #00f2ff 1px, transparent 1px),
                                      linear-gradient(to bottom, #00f2ff 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Minor Grid */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #00f2ff 1px, transparent 1px),
                                      linear-gradient(to bottom, #00f2ff 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-60" />
        </div>
    );
}
