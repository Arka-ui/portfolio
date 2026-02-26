"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBlueprint } from "@/context/BlueprintContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface BlueprintAnnotationProps {
    label: string;
    description?: string;
    techSpecs?: Record<string, string>;
    direction?: "top" | "bottom" | "left" | "right";
    className?: string;
    children?: React.ReactNode;
    offset?: number;
}

export default function BlueprintAnnotation({
    label,
    description,
    techSpecs,
    direction = "right",
    className,
    children,
    offset = 0
}: BlueprintAnnotationProps) {
    const { isBlueprintMode } = useBlueprint();
    const [id, setId] = useState("0000");

    useEffect(() => {
        setId(Math.random().toString(36).substr(2, 4).toUpperCase());
    }, []);

    if (!isBlueprintMode) return <>{children}</>;

    const getPositionStyles = () => {
        const baseOffset = 24; // 6 * 4px = 24px (mb-6/mt-6 etc)
        const totalOffset = baseOffset + offset;

        switch (direction) {
            case "top":
                return `bottom-full left-1/2 -translate-x-1/2 mb-[${totalOffset}px]`;
            case "bottom":
                return `top-full left-1/2 -translate-x-1/2 mt-[${totalOffset}px]`;
            case "left":
                return `right-full top-1/2 -translate-y-1/2 mr-[${totalOffset}px]`;
            case "right":
                return `left-full top-1/2 -translate-y-1/2 ml-[${totalOffset}px]`;
            default:
                return `left-full top-1/2 -translate-y-1/2 ml-[${totalOffset}px]`;
        }
    };

    const getConnectorStyles = () => {
        const baseLength = 24; // 6 * 4px = 24px
        const totalLength = baseLength + offset;

        switch (direction) {
            case "top":
                return `top-full left-1/2 -translate-x-1/2 h-[${totalLength}px] w-[1px]`;
            case "bottom":
                return `bottom-full left-1/2 -translate-x-1/2 h-[${totalLength}px] w-[1px]`;
            case "left":
                return `left-full top-1/2 -translate-y-1/2 w-[${totalLength}px] h-[1px]`;
            case "right":
                return `right-full top-1/2 -translate-y-1/2 w-[${totalLength}px] h-[1px]`;
        }
    };

    return (
        <div className={cn("relative group", className)}>
            {children}
            <AnimatePresence>
                {isBlueprintMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={cn(
                            "absolute z-50 pointer-events-none whitespace-nowrap",
                            getPositionStyles()
                        )}
                    >
                        {/* Connector Line */}
                        <div className={cn("absolute bg-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.5)]", getConnectorStyles())}>
                            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        </div>

                        {/* Label Box */}
                        <div className="bg-[#001529]/95 backdrop-blur-md border border-cyan-500/60 p-3 rounded-sm text-xs font-mono text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)] min-w-[200px]">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-2">
                                <div className="font-bold uppercase tracking-widest text-[11px] text-cyan-300">
                                    {label}
                                </div>
                                <div className="text-[9px] text-cyan-600">ID: {id}</div>
                            </div>

                            {/* Description */}
                            {description && (
                                <div className="text-[10px] leading-relaxed opacity-90 whitespace-normal mb-3 text-cyan-50">
                                    {description}
                                </div>
                            )}

                            {/* Tech Specs */}
                            {techSpecs && (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-cyan-500/30 pt-2 mt-2">
                                    {Object.entries(techSpecs).map(([key, value]) => (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-[8px] uppercase text-cyan-600 tracking-wider">{key}</span>
                                            <span className="text-[9px] text-cyan-300 font-bold">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Technical decorative corners */}
                            <div className="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                            <div className="absolute -top-px -right-px w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                            <div className="absolute -bottom-px -left-px w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                            <div className="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

                            {/* Scanning line effect */}
                            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400 animate-scan-line" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
