"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

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
    const { t } = useLanguage();

    return (
        <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-20 md:pt-28 pb-0 overflow-hidden">
            {/* CSS @property animated mesh gradient — zero JS cost, GPU composited */}
            <div className="absolute inset-0 mesh-gradient pointer-events-none" aria-hidden />

            {/* Ambient blobs for additional depth — only on desktop */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-indigo-600/[0.06] rounded-full blur-[160px] pointer-events-none hidden md:block"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.4, ease: "easeOut" }}
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-600/[0.04] rounded-full blur-[140px] pointer-events-none hidden md:block"
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
                        {t("hero.available")}
                    </span>
                </motion.div>

                {/* Main heading — editorial, massive */}
                <motion.h1
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="font-heading font-black leading-[0.9] tracking-tighter text-[clamp(42px,10.5vw,148px)] mb-14"
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
                    className="flex flex-col md:flex-row md:items-end gap-8 md:gap-0 justify-between pb-12 md:pb-24"
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
                            {t("hero.cta_projects")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <button
                            onClick={() => warpTo("#contact")}
                            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/[0.12] text-white/70 text-sm font-medium hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 active:scale-[0.97]"
                        >
                            {t("hero.cta_contact")}
                            <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                        </button>
                    </div>
                </motion.div>
            </div>

        </section>
    );
}
