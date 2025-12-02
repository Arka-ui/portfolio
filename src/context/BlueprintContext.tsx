"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BlueprintContextType {
    isBlueprintMode: boolean;
    toggleBlueprintMode: () => void;
}

const BlueprintContext = createContext<BlueprintContextType | undefined>(undefined);

export function BlueprintProvider({ children }: { children: React.ReactNode }) {
    const [isBlueprintMode, setIsBlueprintMode] = useState(false);

    const toggleBlueprintMode = () => {
        setIsBlueprintMode((prev) => !prev);
    };

    // Add/remove class from body for global styling
    useEffect(() => {
        if (isBlueprintMode) {
            document.body.classList.add("blueprint-mode");
        } else {
            document.body.classList.remove("blueprint-mode");
        }
    }, [isBlueprintMode]);

    return (
        <BlueprintContext.Provider value={{ isBlueprintMode, toggleBlueprintMode }}>
            {children}
        </BlueprintContext.Provider>
    );
}

export function useBlueprint() {
    const context = useContext(BlueprintContext);
    if (context === undefined) {
        throw new Error("useBlueprint must be used within a BlueprintProvider");
    }
    return context;
}
