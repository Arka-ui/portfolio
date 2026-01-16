"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useOptimizationConfig } from "@/lib/optimization";
import BlueprintWrapper from "@/components/BlueprintWrapper";
import MagneticButton from "@/components/ui/MagneticButton";
import GlitchText from "@/components/ui/GlitchText";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
    const config = useOptimizationConfig();
    const { t } = useLanguage();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="hero">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <BlueprintWrapper
                        label="ROLE_ID"
                        description="Professional Identity"
                        direction="top"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-indigo-300 text-xs font-mono mb-8 hover:bg-indigo-500/20 transition-colors">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            {t("hero.role")}
                        </div>
                    </BlueprintWrapper>

                    <h1 className="font-heading font-black text-5xl md:text-8xl lg:text-9xl tracking-tighter mb-8 leading-[0.9]">
                        <div className="overflow-hidden">
                            <motion.span
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500"
                            >
                                Creative
                            </motion.span>
                        </div>
                        <div className="overflow-hidden">
                            <motion.span
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="block text-white"
                            >
                                <GlitchText text="Developer" />
                            </motion.span>
                        </div>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        {t("hero.description")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <MagneticButton>
                            <Link
                                href="#projects"
                                className="relative group px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] flex items-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">{t("hero.cta_projects")}</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
                                <div className="absolute inset-0 bg-indigo-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                        </MagneticButton>

                        <MagneticButton>
                            <Link
                                href="#contact"
                                className="group px-8 py-4 bg-transparent border border-white/10 text-white rounded-full font-medium text-lg transition-all hover:bg-white/5 backdrop-blur-sm"
                            >
                                {t("hero.cta_contact")}
                            </Link>
                        </MagneticButton>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
