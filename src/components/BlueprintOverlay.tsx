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
            const timer = setTimeout(() => setShowOverlay(false), 2500);
            return () => clearTimeout(timer);
        } else {
            setShowOverlay(false);
        }
    }, [isBlueprintMode]);

    return (
        <AnimatePresence>
            {isBlueprintMode && showOverlay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] bg-[#001529] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Scanning Line */}
                    <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ duration: 2, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-10"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-cyan-400 font-mono text-center relative z-20"
                    >
                        <div className="border border-cyan-500/30 p-8 bg-[#001529]/90 backdrop-blur-sm">
                            <h1 className="text-6xl font-bold mb-4 tracking-widest glitch-text">SYSTEM BOOT</h1>
                            <div className="flex flex-col items-start space-y-2 text-sm opacity-80">
                                <TypewriterLine text="> INITIALIZING ARCHITECTURE..." delay={0} />
                                <TypewriterLine text="> LOADING GRID SYSTEMS..." delay={0.5} />
                                <TypewriterLine text="> CALIBRATING SENSORS..." delay={1.0} />
                                <TypewriterLine text="> BLUEPRINT MODE ACTIVE" delay={1.5} />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function TypewriterLine({ text, delay }: { text: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="flex items-center"
        >
            <span className="mr-2 text-cyan-600">➜</span>
            {text}
        </motion.div>
    );
}
