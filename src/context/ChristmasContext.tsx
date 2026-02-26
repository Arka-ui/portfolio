"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ChristmasContextType {
    isChristmasTime: boolean;
}

const ChristmasContext = createContext<ChristmasContextType | undefined>(undefined);

export function ChristmasProvider({ children }: { children: React.ReactNode }) {
    const [isChristmasTime, setIsChristmasTime] = useState(false);

    useEffect(() => {
        const checkDate = () => {
            const now = new Date();
            const month = now.getMonth(); // 0-indexed, 11 is December
            const day = now.getDate();

            // Check if it's December (11) and between 1st and 31st
            // For testing purposes, hardcode to true here if you want to see it immediately
            // Change `false` to `true` in the first condition to force-enable
            if (month === 11 && day >= 1 && day <= 31) {
                setIsChristmasTime(true);
            } else {
                setIsChristmasTime(false);
            }
        };

        checkDate();
        // Optional: Check periodically if the app needs to handle date change while open (unlikely to matter much)
    }, []);

    return (
        <ChristmasContext.Provider value={{ isChristmasTime }}>
            {children}
        </ChristmasContext.Provider>
    );
}

export function useChristmas() {
    const context = useContext(ChristmasContext);
    if (context === undefined) {
        throw new Error("useChristmas must be used within a ChristmasProvider");
    }
    return context;
}
