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
    show: { transition: { staggerChildren: 0.13 } },
};

// Editorial "snap" — lines rise + shed a slight skew
const lineVariant = {
    hidden: { y: "115%", skewY: 3, opacity: 0 },
    show: {
        y: "0%",
        skewY: 0,
        opacity: 1,
        transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
};

export default function Hero() {
    const { warpTo } = useWarp();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-28 pb-0 overflow-hidden">
            {/* Ambient gradient orbs — entrance animated */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-indigo-600/[0.065] rounded-full blur-[160px] pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.4, ease: "easeOut" }}
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-600/[0.045] rounded-full blur-[140px] pointer-events-none"
            />
            {/* Subtle mid-page accent */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-500/[0.025] rounded-full blur-[100px] pointer-events-none"
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">

                {/* Available badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10"
                >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/[0.07] text-indigo-300 text-xs font-mono tracking-wide backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-55" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400 shadow-[0_0_8px_2px_rgba(99,102,241,0.7)]" />
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

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => warpTo("#projects")}
                            className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black text-sm font-bold transition-all duration-300 hover:shadow-[0_0_28px_4px_rgba(99,102,241,0.28)] hover:bg-indigo-50 active:scale-[0.97]"
                        >
                            View work
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <button
                            onClick={() => warpTo("#contact")}
                            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/[0.12] text-white/70 text-sm font-medium hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 active:scale-[0.97]"
                        >
                            Get in touch
                            <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
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
                <div className="flex gap-5 w-max mb-2.5" style={{ animation: "marquee 32s linear infinite" }}>
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
                <div className="flex gap-5 w-max" style={{ animation: "marquee 24s linear infinite reverse" }}>
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
