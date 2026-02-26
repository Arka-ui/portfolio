"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useWarp } from "@/context/WarpContext";

const MARQUEE_ROW_1 = [
    { label: "React", accent: true },
    { label: "TypeScript", accent: true },
    { label: "Next.js", accent: true },
    { label: "Node.js", accent: false },
    { label: "Python", accent: false },
    { label: "Java", accent: false },
    { label: "Tailwind CSS", accent: false },
    { label: "PostgreSQL", accent: false },
    { label: "Framer Motion", accent: false },
    { label: "Docker", accent: false },
];

const MARQUEE_ROW_2 = [
    "Open Source", "Clean Code", "Git", "Figma", "Redis",
    "Kotlin", "AWS", "Prisma", "API Design", "Performance", "CI/CD",
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const lineVariant = {
    hidden: { y: "110%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Hero() {
    const { warpTo } = useWarp();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-28 pb-0 overflow-hidden">
            {/* Ambient gradient — no CSS filter, GPU-friendly */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 55% at -5% -5%, rgba(99,102,241,0.09) 0%, transparent 60%), " +
                        "radial-gradient(ellipse 60% 50% at 105% 105%, rgba(139,92,246,0.06) 0%, transparent 60%)",
                }}
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">

                {/* Available badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-300 text-xs font-mono">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                        </span>
                        Available for work
                    </span>
                </motion.div>

                {/* Main heading — editorial, massive */}
                <motion.h1
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="font-heading font-black leading-[0.88] tracking-tighter text-[clamp(52px,10.5vw,148px)] mb-14"
                >
                    <div className="overflow-hidden">
                        <motion.span variants={lineVariant} className="block text-white">
                            Building
                        </motion.span>
                    </div>
                    <div className="overflow-hidden">
                        <motion.span variants={lineVariant} className="block text-white/20">
                            digital products
                        </motion.span>
                    </div>
                    <div className="overflow-hidden">
                        <motion.span variants={lineVariant} className="block text-white">
                            people remember.
                        </motion.span>
                    </div>
                </motion.h1>

                {/* Bottom row: bio + CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row md:items-end gap-10 md:gap-0 justify-between pb-24"
                >
                    <p className="text-[17px] text-white/50 max-w-sm leading-relaxed">
                        Full-stack developer from France. I build web experiences
                        and digital products — with attention to craft.
                    </p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => warpTo("#projects")}
                            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-indigo-100 transition-colors"
                        >
                            View work
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <button
                            onClick={() => warpTo("#contact")}
                            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Get in touch
                            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Dual marquee strip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="relative border-t border-white/[0.06] overflow-hidden py-5"
            >
                {/* Edge gradient fades */}
                <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                {/* Row 1 — scrolls left */}
                <div className="flex gap-5 w-max mb-2.5" style={{ animation: "marquee 32s linear infinite", willChange: "transform", transform: "translateZ(0)" }}>
                    {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((item, i) => (
                        <span
                            key={i}
                            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest whitespace-nowrap border ${
                                item.accent
                                    ? "border-indigo-500/30 text-indigo-300/60 bg-indigo-500/[0.07]"
                                    : "border-white/[0.06] text-white/25"
                            }`}
                        >
                            {item.label}
                        </span>
                    ))}
                </div>

                {/* Row 2 — scrolls right */}
                <div className="flex gap-5 w-max" style={{ animation: "marquee 24s linear infinite reverse", willChange: "transform", transform: "translateZ(0)" }}>
                    {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((label, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest whitespace-nowrap border border-white/[0.05] text-white/[0.18]"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
