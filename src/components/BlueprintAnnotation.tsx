"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBlueprint } from "@/context/BlueprintContext";
import { cn } from "@/lib/utils";

interface BlueprintAnnotationProps {
    label: string;
    description?: string;
    direction?: "top" | "bottom" | "left" | "right";
    className?: string;
    children?: React.ReactNode;
}

export default function BlueprintAnnotation({
    label,
    description,
    direction = "right",
    className,
    children
}: BlueprintAnnotationProps) {
    const { isBlueprintMode } = useBlueprint();

    if (!isBlueprintMode) return <>{children}</>;

    const getPositionStyles = () => {
        switch (direction) {
            case "top":
                return "bottom-full left-1/2 -translate-x-1/2 mb-4";
            case "bottom":
                return "top-full left-1/2 -translate-x-1/2 mt-4";
            case "left":
                return "right-full top-1/2 -translate-y-1/2 mr-4";
            case "right":
                return "left-full top-1/2 -translate-y-1/2 ml-4";
            default:
                return "left-full top-1/2 -translate-y-1/2 ml-4";
        }
    };

    const getConnectorStyles = () => {
        switch (direction) {
            case "top":
                return "top-full left-1/2 -translate-x-1/2 h-4 w-[1px]";
            case "bottom":
                return "bottom-full left-1/2 -translate-x-1/2 h-4 w-[1px]";
            case "left":
                return "left-full top-1/2 -translate-y-1/2 w-4 h-[1px]";
            case "right":
                return "right-full top-1/2 -translate-y-1/2 w-4 h-[1px]";
        }
    };

    return (
        <div className={cn("relative group", className)}>
            {children}
            <AnimatePresence>
                {isBlueprintMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "absolute z-50 pointer-events-none whitespace-nowrap",
                            getPositionStyles()
                        )}
                    >
                        {/* Connector Line */}
                        <div className={cn("absolute bg-blue-500/50", getConnectorStyles())}>
                            <div className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full top-0 left-0" />
                        </div>

                        {/* Label Box */}
                        <div className="bg-blue-900/80 backdrop-blur-sm border border-blue-500/50 p-2 rounded text-xs font-mono text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <div className="font-bold uppercase tracking-wider text-[10px] text-blue-300 mb-0.5">
                                {label}
                            </div>
                            {description && (
                                <div className="text-[9px] opacity-80 max-w-[150px] whitespace-normal">
                                    {description}
                                </div>
                            )}
                            {/* Technical decorative corners */}
                            <div className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-blue-400" />
                            <div className="absolute -top-px -right-px w-1.5 h-1.5 border-t border-r border-blue-400" />
                            <div className="absolute -bottom-px -left-px w-1.5 h-1.5 border-b border-l border-blue-400" />
                            <div className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-blue-400" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
