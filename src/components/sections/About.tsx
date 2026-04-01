"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MapPin, Code2, Gamepad2, Music, Moon, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function CountUp({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.8 });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / (duration * 1000), 1);
            const eased = 1 - (1 - p) * (1 - p);
            setCount(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, to, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    show: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

const QUICK_FACTS = [
    { icon: MapPin, text: "fact_0" },
    { icon: Code2, text: "fact_1" },
    { icon: Gamepad2, text: "fact_2" },
    { icon: Zap, text: "fact_3" },
    { icon: Moon, text: "fact_4" },
    { icon: Music, text: "fact_5" },
];

export default function About() {
    const { t, transNodes } = useLanguage();

    return (
        <section id="about-intro" className="py-20 md:py-32">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 md:mb-16"
                >
                    <span className="label-mono">{t("about.label")}</span>
                </motion.div>

                {/* ─── BENTO GRID ─── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">

                    {/* Card 1: Headline — spans 7 cols */}
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-8 md:p-12 md:col-span-7 flex flex-col justify-between min-h-[280px]"
                    >
                        <h2 className="font-heading font-black text-[clamp(36px,5.5vw,76px)] leading-[0.9] tracking-tighter">
                            <span className="text-white">{t("about.headline_1")}</span><br />
                            <span className="text-gradient">{t("about.headline_2")}</span><br />
                            <span className="text-white/80">{t("about.headline_3")}</span>
                        </h2>
                        <p className="text-xs font-mono text-white/20 tracking-widest mt-8">— arka</p>
                    </motion.div>

                    {/* Card 2: Stats grid — spans 5 cols */}
                    <motion.div
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card md:col-span-5 grid grid-cols-2 gap-px overflow-hidden"
                    >
                        {[
                            { val: 3, suf: "+", label: t("about.stat_years") },
                            { val: 15, suf: "+", label: t("about.stat_projects") },
                            { val: 4, suf: "", label: t("about.stat_languages") },
                            { val: 10, suf: "k+", label: t("about.stat_lines") },
                        ].map((s, i) => (
                            <div key={i} className="p-6 md:p-7 flex flex-col gap-1 group hover:bg-white/[0.03] transition-colors duration-300">
                                <span className="font-heading font-black text-3xl md:text-4xl text-white tracking-tight group-hover:text-amber-300 transition-colors duration-300">
                                    <CountUp to={s.val} suffix={s.suf} />
                                </span>
                                <span className="text-xs text-white/40 leading-tight">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Card 3: Bio text — spans 5 cols */}
                    <motion.div
                        custom={2}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-8 md:p-10 md:col-span-5 flex flex-col gap-5"
                    >
                        <p className="text-[15px] md:text-base text-white/65 leading-relaxed">
                            {t("about.bio_1")}
                        </p>
                        <p className="text-[15px] md:text-base text-white/65 leading-relaxed">
                            {transNodes(t("about.bio_2"), {
                                company: <span key="company" className="text-amber-400/70">EclozionMC</span>,
                            })}
                        </p>
                        <p className="text-[15px] md:text-base text-white/65 leading-relaxed">
                            {t("about.bio_3")}
                        </p>
                        <p className="text-[15px] md:text-base text-white/65 leading-relaxed">
                            {transNodes(t("about.bio_4"), {
                                host: (
                                    <a key="host" href="https://nemesius.fr" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors underline underline-offset-4 decoration-teal-400/30">
                                        Nemesius
                                    </a>
                                ),
                            })}
                        </p>
                    </motion.div>

                    {/* Card 4: Quick facts — spans 4 cols */}
                    <motion.div
                        custom={3}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-6 md:p-8 md:col-span-4 flex flex-col gap-3"
                    >
                        <span className="label-mono mb-2">Quick facts</span>
                        {QUICK_FACTS.map((fact, i) => {
                            const Icon = fact.icon;
                            return (
                                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                                    <Icon size={14} className="text-white/25 group-hover:text-amber-400/60 transition-colors shrink-0" />
                                    <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{t(`about.fact_${i}`)}</span>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Card 5: OSS + Self-taught badges — spans 3 cols */}
                    <motion.div
                        custom={4}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-6 md:p-8 md:col-span-3 flex flex-col justify-between gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="label-mono">{t("about.stat_oss_label")}</span>
                            <span className="font-heading font-black text-5xl text-teal-400 tracking-tight">OSS</span>
                            <p className="text-xs text-white/35 leading-relaxed mt-1">Contributing and publishing openly is how I keep my promise.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="label-mono">{t("about.stat_self_taught")}</span>
                            <div className="flex items-end gap-1">
                                <span className="font-heading font-black text-5xl text-amber-400 tracking-tight"><CountUp to={99} suffix="%" /></span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 6: Manifesto quote — full width */}
                    <motion.div
                        custom={5}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-10 md:p-16 md:col-span-12 text-center relative"
                    >
                        {/* Gradient accent line top */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                        <span className="text-amber-500/15 text-7xl font-heading block mb-4 select-none">&ldquo;</span>
                        <p className="font-heading text-2xl md:text-4xl lg:text-5xl text-white/85 leading-[1.15] tracking-tight font-bold max-w-4xl mx-auto">
                            {t("about.manifesto")}
                        </p>
                        <span className="text-sm font-mono text-white/25 tracking-wider mt-8 block">— Arka</span>
                    </motion.div>
                </div>

                {/* ─── BELIEFS + APPROACH ─── */}
                <div className="mt-20 md:mt-28 space-y-20">
                    {/* Beliefs */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="label-mono mb-10 block"
                        >
                            {t("about.beliefs_label")}
                        </motion.span>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="group bento-card p-7 flex flex-col gap-4 hover:border-amber-500/15 transition-all duration-500"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="w-8 h-8 rounded-lg bg-amber-500/[0.08] border border-amber-500/[0.12] flex items-center justify-center font-mono text-xs text-amber-400/60 font-bold">
                                            {String(i).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <h3 className="font-heading font-bold text-lg text-white tracking-tight">
                                        {t(`about.belief_${i}_title`)}
                                    </h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{t(`about.belief_${i}_body`)}</p>
                                    <div className="mt-auto pt-4">
                                        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/0 group-hover:via-amber-500/25 to-transparent transition-all duration-700" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* How I work */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="label-mono mb-10 block"
                        >
                            {t("about.approach_label")}
                        </motion.span>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="group relative bento-card p-7 flex flex-col gap-4 hover:border-teal-500/15 transition-all duration-500"
                                >
                                    {/* Step connector */}
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-500/[0.07] border border-teal-500/[0.12] font-mono text-sm font-bold text-teal-400/60">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        {i < 3 && (
                                            <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-teal-500/15 to-transparent" />
                                        )}
                                    </div>
                                    <h3 className="font-heading font-bold text-white text-lg tracking-tight">{t(`about.approach_${i}_title`)}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{t(`about.approach_${i}_body`)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 flex flex-wrap gap-2 justify-center"
                >
                    {["React", "Next.js", "TypeScript", "Clean Code", "Open Source", "UI / UX", "Performance", "API Design", "DX", "Real-time", "Systems", "Full-Stack", "DevOps", "Automation"].map((tag) => (
                        <span
                            key={tag}
                            className="px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-xs font-mono text-white/35 tracking-wide hover:text-amber-300/60 hover:border-amber-500/15 transition-all duration-300 cursor-default"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
