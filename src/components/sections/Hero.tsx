"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp = {
    hidden: { y: 40, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Hero() {
    const { warpTo } = useWarp();
    const { t } = useLanguage();

    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
            {/* Mesh background */}
            <div className="absolute inset-0 mesh-gradient pointer-events-none" aria-hidden />

            {/* Floating orb — conic gradient, GPU-composited */}
            <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="show"
                className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[500px] h-[500px] md:w-[650px] md:h-[650px] hero-orb rounded-full opacity-30 pointer-events-none hidden md:block"
            />

            {/* Subtle grid lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden>
                <div className="absolute left-[20%] top-0 bottom-0 w-px bg-white" />
                <div className="absolute left-[40%] top-0 bottom-0 w-px bg-white" />
                <div className="absolute left-[60%] top-0 bottom-0 w-px bg-white" />
                <div className="absolute left-[80%] top-0 bottom-0 w-px bg-white" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="max-w-4xl"
                >
                    {/* Top label */}
                    <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                            </span>
                            <span className="text-amber-300/90 text-xs font-mono tracking-wider">{t("hero.available")}</span>
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent hidden sm:block" />
                    </motion.div>

                    {/* Giant headline — asymmetric, gradient middle line */}
                    <div className="space-y-0">
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-heading font-black text-[clamp(48px,11vw,160px)] leading-[0.88] tracking-tighter">
                                {t("hero.line_1")}
                            </h1>
                        </motion.div>
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-heading font-black text-[clamp(48px,11vw,160px)] leading-[0.88] tracking-tighter text-gradient">
                                {t("hero.line_2")}
                            </h1>
                        </motion.div>
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-heading font-black text-[clamp(48px,11vw,160px)] leading-[0.88] tracking-tighter text-white/90">
                                {t("hero.line_3")}
                            </h1>
                        </motion.div>
                    </div>

                    {/* Bottom bar: bio + CTA — deliberately offset from heading */}
                    <motion.div
                        variants={fadeUp}
                        className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-8 sm:gap-16"
                    >
                        <p className="text-base md:text-lg text-white/40 max-w-md leading-relaxed font-light">
                            {t("hero.bio")}
                        </p>

                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => warpTo("#projects")}
                                className="group relative inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white text-black text-sm font-bold tracking-tight overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_8px_rgba(245,158,11,0.15)] active:scale-[0.97]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {t("hero.cta_projects")}
                                    <Sparkles className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                                </span>
                                {/* Hover gradient sweep */}
                                <span className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </button>
                            <button
                                onClick={() => warpTo("#contact")}
                                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/[0.1] text-white/60 text-sm font-medium hover:text-white hover:bg-white/[0.05] hover:border-amber-500/25 transition-all duration-300 active:scale-[0.97]"
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
                            <ArrowDown className="w-4 h-4 text-white/20" />
                        </motion.div>
                        <span className="label-mono text-white/15">Scroll to explore</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
