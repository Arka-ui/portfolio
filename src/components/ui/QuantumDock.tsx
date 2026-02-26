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
            className="relative px-4 py-3 flex flex-col items-center justify-center transition-all duration-300 group"
        >
            {/* Icon Container */}
            <div className={cn(
                "relative z-10 flex items-center justify-center p-2 rounded-full transition-all duration-300",
                isActive ? "text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-110" : "text-slate-400 group-hover:text-slate-200 group-hover:bg-white/5 scale-100"
            )}>
                <motion.div
                    animate={hovered ? { y: -2 } : { y: 0 }}
                >
                    {icon}
                </motion.div>
            </div>

            {/* Tooltip (Holographic Label) */}
            <AnimatePresence>
                {(hovered && !isActive) && (
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -bottom-6 text-[10px] font-mono tracking-widest text-cyan-500 uppercase pointer-events-none"
                    >
                        {title}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Active Scanner Underline */}
            {isActive && (
                <motion.div
                    layoutId="scanner-line"
                    className="absolute -bottom-1 w-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </button>
    );
}
