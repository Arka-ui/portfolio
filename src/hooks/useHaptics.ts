"use client";

import { useCallback } from "react";

type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "error";

export function useHaptics() {
    const triggerHaptic = useCallback((type: HapticType) => {
        // Check if vibration is supported
        if (typeof window === "undefined" || !window.navigator?.vibrate) return;

        switch (type) {
            case "light":
                window.navigator.vibrate(10); // Very subtle click
                break;
            case "medium":
                window.navigator.vibrate(20);
                break;
            case "heavy":
                window.navigator.vibrate(40);
                break;
            case "success":
                window.navigator.vibrate([10, 30, 10]); // Short-Long-Short pulse
                break;
            case "warning":
                window.navigator.vibrate([30, 50, 30]);
                break;
            case "error":
                window.navigator.vibrate([50, 50, 50, 50]); // Double strong vibration
                break;
        }
    }, []);

    return { triggerHaptic };
}
