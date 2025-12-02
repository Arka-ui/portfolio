"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlueprint } from "@/context/BlueprintContext";

export default function BlueprintOverlay() {
    const { isBlueprintMode } = useBlueprint();
    const [showOverlay, setShowOverlay] = useState(false);

    // Show overlay for a short duration when entering blueprint mode
    useEffect(() => {
        if (isBlueprintMode) {
            setShowOverlay(true);
            const timer = setTimeout(() => setShowOverlay(false), 3000); // 3 seconds
            return () => clearTimeout(timer);
        } else {
            setShowOverlay(false);
        }
    }, [isBlueprintMode]);

    return (
        <AnimatePresence>
            {isBlueprintMode && showOverlay && (
                <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] bg-black pointer-events-none flex items-center justify-center overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-white font-mono text-center"
                    >
                        <h1 className="text-6xl font-bold mb-4">BLUEPRINT MODE</h1>
                        <p className="text-xl opacity-80">INITIALIZING SYSTEM ARCHITECTURE...</p>
                        <div className="mt-8 w-64 h-2 bg-white/20 mx-auto rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
