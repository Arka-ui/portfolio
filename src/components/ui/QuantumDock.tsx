"use client";

import { MotionValue, motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuantumDockProps {
    items: {
        title: string;
        icon: React.ReactNode;
        href: string;
    }[];
    className?: string;
    activeTab?: string;
    onWarp: (href: string) => void;
}

export default function QuantumDock({ items, className, activeTab, onWarp }: QuantumDockProps) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-slate-900/50 px-4 pb-3 backdrop-blur-2xl border border-white/5",
                className
            )}
        >
            {items.map((item) => (
                <DockItem
                    key={item.title}
                    mouseX={mouseX}
                    title={item.title}
                    icon={item.icon}
                    href={item.href}
                    isActive={activeTab === item.title}
                    onWarp={onWarp}
                />
            ))}
        </motion.div>
    );
}

function DockItem({
    mouseX,
    title,
    icon,
    href,
    isActive,
    onWarp,
}: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    href: string;
    isActive: boolean;
    onWarp: (href: string) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const ySync = useTransform(distance, [-150, 0, 150], [0, -10, 0]);
    const y = useSpring(ySync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <button
            onClick={() => onWarp(href)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 group"
        >
            {/* Plasma Pool (Active Background) */}
            {isActive && (
                <motion.div
                    layoutId="plasma-pool"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-indigo-500/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            {/* Icon Container */}
            <div className={cn(
                "relative z-10 flex items-center gap-2 transition-colors duration-300",
                isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-slate-400 group-hover:text-slate-200"
            )}>
                <motion.div
                    animate={isActive || hovered ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                >
                    {icon}
                </motion.div>

                {/* Text Label (Visible on Hover or Active) */}
                <AnimatePresence>
                    {(hovered || isActive) && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm font-medium whitespace-nowrap overflow-hidden ml-2"
                        >
                            {title}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Holographic Reflection (Bottom) */}
            {isActive && (
                <motion.div
                    layoutId="plasma-reflection"
                    className="absolute -bottom-1 left-2 right-2 h-[1px] bg-cyan-400/50 blur-[2px]"
                />
            )}
        </button>
    );
}
