"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
};

const lineReveal = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const, delay: 0.6 } },
};

export default function Hero() {
    const { warpTo } = useWarp();
    const { t } = useLanguage();

    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
            {/* Mesh background */}
            <div className="absolute inset-0 mesh-gradient pointer-events-none" aria-hidden />

            {/* Diagonal accent lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] md:w-[900px] md:h-[900px] border border-[#ff6b35]/[0.04] rounded-full" />
                <div className="absolute -top-[25%] -right-[15%] w-[700px] h-[700px] md:w-[1100px] md:h-[1100px] border border-[#ff6b35]/[0.02] rounded-full" />
            </div>

            {/* Subtle grid dots */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden>
                <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white" />
                <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white" />
                <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="max-w-5xl"
                >
                    {/* Top label row */}
                    <motion.div variants={fadeUp} className="mb-10 flex items-center gap-5">
                        <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#ff6b35]/20 bg-[#ff6b35]/[0.05]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b35] opacity-40" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b35]" />
                            </span>
                            <span className="text-[#ff6b35]/90 text-xs font-mono tracking-wider">{t("hero.available")}</span>
                        </span>
                        <span className="text-white/20 text-xs font-mono tracking-widest hidden sm:block">{t("hero.role")}</span>
                        <motion.div variants={lineReveal} className="h-px flex-1 bg-gradient-to-r from-[#ff6b35]/20 to-transparent origin-left hidden sm:block" />
                    </motion.div>

                    {/* Giant headline — editorial stacked type */}
                    <div className="space-y-1 md:space-y-0">
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-heading font-bold text-[clamp(52px,12vw,170px)] leading-[0.85] tracking-tighter text-white/90">
                                {t("hero.line_1")}
                            </h1>
                        </motion.div>
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-heading font-bold text-[clamp(52px,12vw,170px)] leading-[0.85] tracking-tighter text-[#ff6b35]">
                                {t("hero.line_2")}
                            </h1>
                        </motion.div>
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-heading font-bold text-[clamp(52px,12vw,170px)] leading-[0.85] tracking-tighter text-white/50">
                                {t("hero.line_3")}
                            </h1>
                        </motion.div>
                    </div>

                    {/* Accent rule */}
                    <motion.div variants={lineReveal} className="mt-10 md:mt-14 rule-line origin-left" />

                    {/* Bottom bar: bio + CTA */}
                    <motion.div
                        variants={fadeUp}
                        className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-end gap-8 sm:gap-16"
                    >
                        <p className="text-base md:text-lg text-white/35 max-w-md leading-relaxed">
                            {t("hero.bio")}
                        </p>

                        <div className="flex items-center gap-4 shrink-0">
                            <button
                                onClick={() => warpTo("#projects")}
                                className="group relative inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#ff6b35] text-[#060d1f] text-sm font-bold tracking-tight overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_8px_rgba(255,107,53,0.15)] active:scale-[0.97]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {t("hero.cta_projects")}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>
                            <button
                                onClick={() => warpTo("#contact")}
                                className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/[0.1] text-white/50 text-sm font-medium hover:text-white hover:bg-white/[0.04] hover:border-[#ff6b35]/20 transition-all duration-300 active:scale-[0.97]"
                            >
                                {t("hero.cta_contact")}
                            </button>
                        </div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        variants={fadeUp}
                        className="mt-20 md:mt-28 flex items-center gap-3"
                    >
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ArrowDown className="w-4 h-4 text-white/15" />
                        </motion.div>
                        <span className="label-mono text-white/10">Scroll to explore</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
