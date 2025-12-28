"use client";

import { MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
        >
            <motion.div
                ref={ref}
                style={{ width, y }}
                className={cn(
                    "relative flex aspect-square items-center justify-center rounded-full transition-colors",
                    isActive ? "bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-500/30" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                )}
            >
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {/* Icon Scaling */}
                    <motion.div
                        style={{ scale: useTransform(width, [40, 80], [1, 2]) }}
                        className="flex items-center justify-center"
                    >
                        {icon}
                    </motion.div>
                </div>

                {/* Holographic Tooltip */}
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-indigo-500/30 bg-slate-900/90 px-2 py-0.5 text-xs text-indigo-300 backdrop-blur-md pointer-events-none"
                    >
                        {title}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-500/30" />
                    </motion.div>
                )}

                {/* Active Dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeDockDot"
                        className="absolute -bottom-2 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"
                    />
                )}
            </motion.div>
        </button>
    );
}
