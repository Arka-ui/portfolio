"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

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

const ROLES = ["Full-Stack", "Creative", "Self-Taught"];

function useTypedRole() {
    const [idx, setIdx] = useState(0);
    const [text, setText] = useState("");
    const [phase, setPhase] = useState<"typing" | "hold" | "erasing">("typing");

    useEffect(() => {
        const full = ROLES[idx];
        let timer: ReturnType<typeof setTimeout>;
        if (phase === "typing") {
            if (text.length < full.length) {
                timer = setTimeout(() => setText(full.slice(0, text.length + 1)), 70);
            } else {
                timer = setTimeout(() => setPhase("hold"), 1600);
            }
        } else if (phase === "hold") {
            timer = setTimeout(() => setPhase("erasing"), 1200);
        } else {
            if (text.length > 0) {
                timer = setTimeout(() => setText(text.slice(0, -1)), 40);
            } else {
                setIdx((idx + 1) % ROLES.length);
                setPhase("typing");
            }
        }
        return () => clearTimeout(timer);
    }, [text, phase, idx]);

    return text;
}

export default function Hero() {
    const { warpTo } = useWarp();
    const { t } = useLanguage();
    const typed = useTypedRole();
    const [parallax, setParallax] = useState(0);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(max-width: 767px)").matches) return;
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                setParallax(Math.min(40, window.scrollY * 0.08));
                raf = 0;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-0 md:pl-[72px]">
            {/* Mesh background with parallax */}
            <div
                className="absolute inset-0 mesh-gradient pointer-events-none"
                style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
                aria-hidden
            />

            {/* Editorial warm serifs — faint decorative "A" backdrop */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <div
                    className="absolute -top-[10%] -right-[5%] font-display font-bold text-[clamp(400px,55vw,900px)] leading-none text-[#DBC7A6]/[0.025] select-none"
                    style={{ transform: `translate3d(0, ${parallax * 0.4}px, 0)` }}
                >
                    A.
                </div>
            </div>

            {/* Horizon hairline at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#493B33]/60 to-transparent" aria-hidden />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="max-w-5xl"
                >
                    {/* Top label row */}
                    <motion.div variants={fadeUp} className="mb-10 flex items-center gap-5 flex-wrap">
                        <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#B39F85]/35 bg-[#1B1814]/60 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DBC7A6] opacity-50" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DBC7A6]" />
                            </span>
                            <span className="text-[#DBC7A6] text-xs font-mono tracking-wider">{t("hero.available")}</span>
                        </span>
                        <span className="text-[#7D6B56] text-xs font-mono tracking-widest">
                            <span className="text-[#DBC7A6]/80">{typed}</span>
                            <span className="caret text-[#DBC7A6]/80" />
                            &nbsp;/ {t("hero.role")}
                        </span>
                        <motion.div variants={lineReveal} className="h-px flex-1 bg-gradient-to-r from-[#B39F85]/40 to-transparent origin-left hidden sm:block" />
                    </motion.div>

                    {/* Giant editorial headline */}
                    <div className="space-y-1 md:space-y-0">
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-display font-bold text-[clamp(48px,12vw,170px)] leading-[0.86] tracking-tighter text-[#DBC7A6]">
                                {t("hero.line_1")}
                            </h1>
                        </motion.div>
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-display font-bold text-[clamp(48px,12vw,170px)] leading-[0.86] tracking-tighter text-grad-warm-shimmer">
                                {t("hero.line_2")}
                            </h1>
                        </motion.div>
                        <motion.div variants={fadeUp} className="overflow-hidden">
                            <h1 className="font-display font-bold text-[clamp(48px,12vw,170px)] leading-[0.86] tracking-tighter text-[#7D6B56]">
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
                        <p className="text-base md:text-lg text-[#B39F85] max-w-md leading-relaxed">
                            {t("hero.bio")}
                        </p>

                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => warpTo("#projects")}
                                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#DBC7A6] text-[#13110E] text-sm font-bold tracking-tight overflow-hidden transition-all duration-300 hover:shadow-[0_0_44px_6px_rgba(219,199,166,0.18)] active:scale-[0.97]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {t("hero.cta_projects")}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>
                            <button
                                onClick={() => warpTo("#contact")}
                                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#493B33]/70 text-[#B39F85] text-sm font-medium hover:text-[#DBC7A6] hover:bg-[#1B1814]/60 hover:border-[#B39F85]/40 transition-all duration-300 active:scale-[0.97]"
                            >
                                {t("hero.cta_contact")}
                            </button>
                        </div>
                    </motion.div>

                    {/* Scroll indicator — clickable, glides to next section */}
                    <motion.button
                        type="button"
                        variants={fadeUp}
                        onClick={() => warpTo("#about-intro")}
                        aria-label="Scroll to next section"
                        className="group mt-16 md:mt-24 flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBC7A6]/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#13110E] rounded-full px-1 -mx-1"
                    >
                        <div className="w-10 h-px bg-gradient-to-r from-[#DBC7A6]/50 to-transparent transition-all duration-300 group-hover:w-14 group-hover:from-[#DBC7A6]" />
                        <span className="label-mono text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors">// scroll</span>
                        <motion.div
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-[#DBC7A6]/60 group-hover:bg-[#DBC7A6] group-hover:shadow-[0_0_12px_rgba(219,199,166,0.7)]"
                        />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
