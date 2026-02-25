"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useWarp } from "@/context/WarpContext";

const TECH_MARQUEE = [
    "React", "Next.js", "TypeScript", "Node.js", "Swift", "Java", "Python",
    "Tailwind CSS", "PostgreSQL", "Docker", "Figma", "Git",
    "React", "Next.js", "TypeScript", "Node.js", "Swift", "Java", "Python",
    "Tailwind CSS", "PostgreSQL", "Docker", "Figma", "Git",
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
            {/* Subtle gradient orb */}
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-indigo-600/[0.06] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

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
                        Full-stack developer from France. I design and build web experiences,
                        iOS apps, and everything in between — with attention to craft.
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

            {/* Tech marquee strip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="border-t border-white/[0.06] py-5 overflow-hidden"
            >
                <div
                    className="flex gap-12 w-max"
                    style={{ animation: "marquee 30s linear infinite" }}
                >
                    {TECH_MARQUEE.map((tech, i) => (
                        <span key={i} className="text-xs font-mono text-white/20 uppercase tracking-widest whitespace-nowrap">
                            {tech}
                        </span>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
