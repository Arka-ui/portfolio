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
        <section id="about-intro" className="py-24 md:py-36">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-14 md:mb-20"
                >
                    <span className="label-mono">{t("about.label")}</span>
                </motion.div>

                {/* ─── TOP: HEADLINE + BIO ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16 md:mb-24">
                    {/* Left: Headline */}
                    <motion.div
                        custom={0}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <h2 className="font-heading font-bold text-[clamp(40px,6vw,80px)] leading-[0.88] tracking-tighter">
                            <span className="text-white">{t("about.headline_1")}</span><br />
                            <span className="text-[#ff6b35]">{t("about.headline_2")}</span><br />
                            <span className="text-white/50">{t("about.headline_3")}</span>
                        </h2>
                        <p className="text-xs font-mono text-white/15 tracking-widest mt-8">— arka</p>
                    </motion.div>

                    {/* Right: Bio paragraphs */}
                    <motion.div
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="flex flex-col gap-5 lg:pt-4"
                    >
                        <p className="text-[15px] md:text-base text-white/55 leading-relaxed">
                            {t("about.bio_1")}
                        </p>
                        <p className="text-[15px] md:text-base text-white/55 leading-relaxed">
                            {transNodes(t("about.bio_2"), {
                                company: <span key="company" className="text-[#ff6b35]/80 font-medium">RiftMC</span>,
                            })}
                        </p>
                        <p className="text-[15px] md:text-base text-white/55 leading-relaxed">
                            {t("about.bio_3")}
                        </p>
                        <p className="text-[15px] md:text-base text-white/55 leading-relaxed">
                            {transNodes(t("about.bio_4"), {
                                host: (
                                    <a key="host" href="https://nemesius.fr" target="_blank" rel="noopener noreferrer" className="text-[#00cfb4] hover:text-[#33dcc6] transition-colors underline underline-offset-4 decoration-[#00cfb4]/30">
                                        Nemesius
                                    </a>
                                ),
                            })}
                        </p>
                    </motion.div>
                </div>

                {/* ─── TEAM QUOTE (Citation) ─── */}
                <motion.div
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative mb-16 md:mb-24 py-12 md:py-16 px-8 md:px-16 border-l-4 border-[#ff85c8]/40 bg-[#ff85c8]/[0.03] rounded-r-2xl"
                >
                    <span className="text-[#ff85c8]/20 text-6xl md:text-8xl font-heading absolute top-4 left-6 md:left-10 select-none leading-none">&ldquo;</span>
                    <p className="font-heading text-2xl md:text-4xl lg:text-5xl text-white/90 leading-[1.15] tracking-tight font-bold max-w-4xl relative z-10">
                        {t("about.team_quote")}
                    </p>
                    <span className="text-sm font-mono text-white/20 tracking-wider mt-6 block relative z-10">— Arka</span>
                </motion.div>

                {/* ─── STATS ROW ─── */}
                <motion.div
                    custom={3}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24"
                >
                    {[
                        { val: 3, suf: "+", label: t("about.stat_years") },
                        { val: 15, suf: "+", label: t("about.stat_projects") },
                        { val: 4, suf: "", label: t("about.stat_languages") },
                        { val: 10, suf: "k+", label: t("about.stat_lines") },
                    ].map((s, i) => (
                        <div key={i} className="bento-card p-6 md:p-8 group hover:border-[#ff6b35]/15 transition-all duration-300">
                            <span className="font-heading font-bold text-4xl md:text-5xl text-white tracking-tight group-hover:text-[#ff6b35] transition-colors duration-300">
                                <CountUp to={s.val} suffix={s.suf} />
                            </span>
                            <span className="text-xs text-white/30 leading-tight block mt-2">{s.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* ─── BENTO GRID: QUICK FACTS + OSS + MANIFESTO ─── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 mb-16 md:mb-24">
                    {/* Quick facts — 5 cols */}
                    <motion.div
                        custom={4}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-6 md:p-8 md:col-span-5 flex flex-col gap-3"
                    >
                        <span className="label-mono mb-2">Quick facts</span>
                        {QUICK_FACTS.map((fact, i) => {
                            const Icon = fact.icon;
                            return (
                                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                                    <Icon size={14} className="text-white/20 group-hover:text-[#ff6b35]/60 transition-colors shrink-0" />
                                    <span className="text-sm text-white/45 group-hover:text-white/70 transition-colors">{t(`about.fact_${i}`)}</span>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* OSS + Self-taught — 3 cols */}
                    <motion.div
                        custom={5}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-6 md:p-8 md:col-span-3 flex flex-col justify-between gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="label-mono">{t("about.stat_oss_label")}</span>
                            <span className="font-heading font-bold text-5xl text-[#ff6b35] tracking-tight">OSS</span>
                            <p className="text-xs text-white/30 leading-relaxed mt-1">Contributing and publishing openly is how I keep my promise.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="label-mono">{t("about.stat_self_taught")}</span>
                            <div className="flex items-end gap-1">
                                <span className="font-heading font-bold text-5xl text-[#ff85c8] tracking-tight"><CountUp to={99} suffix="%" /></span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Manifesto quote — 4 cols */}
                    <motion.div
                        custom={6}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-8 md:p-10 md:col-span-4 flex flex-col justify-center relative"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#ff85c8]/20 via-transparent to-transparent" />
                        <span className="text-[#ff85c8]/15 text-5xl font-heading block mb-3 select-none">&ldquo;</span>
                        <p className="font-heading text-lg md:text-xl text-white/80 leading-[1.2] tracking-tight font-bold">
                            {t("about.manifesto")}
                        </p>
                        <span className="text-xs font-mono text-white/20 tracking-wider mt-4 block">— Arka</span>
                    </motion.div>
                </div>

                {/* ─── BELIEFS ─── */}
                <div className="mb-16 md:mb-24">
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
                                className="group bento-card p-7 flex flex-col gap-4 hover:border-[#ff6b35]/15 transition-all duration-500"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="w-8 h-8 rounded-lg bg-[#ff6b35]/[0.06] border border-[#ff6b35]/[0.12] flex items-center justify-center font-mono text-xs text-[#ff6b35]/60 font-bold">
                                        {String(i).padStart(2, "0")}
                                    </span>
                                </div>
                                <h3 className="font-heading font-bold text-lg text-white tracking-tight">
                                    {t(`about.belief_${i}_title`)}
                                </h3>
                                <p className="text-sm text-white/40 leading-relaxed">{t(`about.belief_${i}_body`)}</p>
                                <div className="mt-auto pt-4">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#ff6b35]/0 group-hover:via-[#ff6b35]/20 to-transparent transition-all duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ─── APPROACH ─── */}
                <div className="mb-16">
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
                                className="group relative bento-card p-7 flex flex-col gap-4 hover:border-[#00cfb4]/15 transition-all duration-500"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00cfb4]/[0.06] border border-[#00cfb4]/[0.12] font-mono text-sm font-bold text-[#00cfb4]/60">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {i < 3 && (
                                        <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-[#00cfb4]/15 to-transparent" />
                                    )}
                                </div>
                                <h3 className="font-heading font-bold text-white text-lg tracking-tight">{t(`about.approach_${i}_title`)}</h3>
                                <p className="text-sm text-white/40 leading-relaxed">{t(`about.approach_${i}_body`)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap gap-2 justify-center"
                >
                    {["React", "Next.js", "TypeScript", "Clean Code", "Open Source", "UI / UX", "Performance", "API Design", "DX", "Real-time", "Systems", "Full-Stack", "DevOps", "Automation"].map((tag) => (
                        <span
                            key={tag}
                            className="px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-xs font-mono text-white/30 tracking-wide hover:text-[#ff6b35]/60 hover:border-[#ff6b35]/15 transition-all duration-300 cursor-default"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
