"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_SEQUENCE = [
    "INITIALIZING_KERNEL...",
    "LOADING_NEURAL_INTERFACE...",
    "CONNECTING_TO_MAINFRAME...",
    "DECRYPTING_SECURE_DATA...",
    "OPTIMIZING_QUANTUM_FLUX...",
    "SYSTEM_ONLINE"
];

export default function Preloader() {
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => {
                if (prev >= BOOT_SEQUENCE.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 800);
                    return prev;
                }
                return prev + 1;
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[10000] bg-black flex items-center justify-center font-mono text-cyan-500"
                >
                    <div className="w-full max-w-md p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-2">
                            <span className="text-xs">BIOS_V.2.0.24</span>
                            <span className="text-xs animate-pulse">BOOTING...</span>
                        </div>

                        {/* Sequence */}
                        <div className="space-y-2 h-48">
                            {BOOT_SEQUENCE.slice(0, step + 1).map((text, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-cyan-500/50">[{index < 10 ? `0${index}` : index}]</span>
                                    <span className={index === step ? "text-white" : "text-cyan-400/80"}>
                                        {text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-8 relative h-1 bg-cyan-900/50 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-cyan-400 box-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${((step + 1) / BOOT_SEQUENCE.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <div className="mt-2 flex justify-between text-[10px] text-cyan-500/50 uppercase">
                            <span>Memory: 64TB OK</span>
                            <span>CPU: QUANTUM-9 OK</span>
                        </div>
                    </div>

                    {/* Background Grid */}
                    <div
                        className="absolute inset-0 pointer-events-none z-[-1] opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
