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

// Organic "slime-in" reveal: blur + scale + y with a gentle overshoot.
// Framer tweens filter/scale in the same pass, which avoids the first-paint jitter
// the old y/opacity-only variant produced when whileInView fired before layout settled.
const fadeUp = {
    hidden: { y: 28, opacity: 0, scale: 0.94, filter: "blur(10px)" },
    show: (i: number) => ({
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 1.05,
            delay: i * 0.08,
            ease: [0.2, 0.9, 0.25, 1.05] as const,
            filter: { duration: 0.75, delay: i * 0.08 },
        },
    }),
};

const QUICK_FACTS = [
    { icon: MapPin, key: "fact_0" },
    { icon: Code2, key: "fact_1" },
    { icon: Gamepad2, key: "fact_2" },
    { icon: Zap, key: "fact_3" },
    { icon: Moon, key: "fact_4" },
    { icon: Music, key: "fact_5" },
];

export default function About() {
    const { t, transNodes } = useLanguage();

    // Merged 6 principles from beliefs (0-3) and approach (0-3) -> take first 6 from both, but we only have 4+4=8
    // Strategy: 4 beliefs + first 2 approach = 6 principles, with fallback to belief keys if missing
    const PRINCIPLES = [
        { key: "belief_0" },
        { key: "belief_1" },
        { key: "belief_2" },
        { key: "belief_3" },
        { key: "approach_0" },
        { key: "approach_1" },
    ];

    return (
        <section id="about-intro" className="py-24 md:py-36 md:pl-[72px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-14 md:mb-20"
                >
                    <span className="label-display">{t("about.label")}</span>
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
                        <h2 className="font-display font-bold text-[clamp(40px,6vw,80px)] leading-[0.88] tracking-tighter">
                            <span className="text-[#DBC7A6]">{t("about.headline_1")}</span><br />
                            <span className="text-grad-warm">{t("about.headline_2")}</span><br />
                            <span className="text-[#7D6B56]">{t("about.headline_3")}</span>
                        </h2>
                        <p className="text-xs font-mono text-[#5F564D] tracking-widest mt-8">— arka</p>
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
                        <p className="text-[15px] md:text-base text-[#B39F85] leading-relaxed">
                            {t("about.bio_1")}
                        </p>
                        <p className="text-[15px] md:text-base text-[#B39F85] leading-relaxed">
                            {transNodes(t("about.bio_2"), {
                                company: <span key="company" className="text-[#DBC7A6] font-medium">RiftMC</span>,
                            })}
                        </p>
                        <p className="text-[15px] md:text-base text-[#B39F85] leading-relaxed">
                            {t("about.bio_3")}
                        </p>
                        <p className="text-[15px] md:text-base text-[#B39F85] leading-relaxed">
                            {transNodes(t("about.bio_4"), {
                                host: (
                                    <a key="host" href="https://nemesius.fr" target="_blank" rel="noopener noreferrer" className="text-[#DBC7A6] hover:text-[#B39F85] transition-colors underline underline-offset-4 decoration-[#B39F85]/40">
                                        Nemesius
                                    </a>
                                ),
                            })}
                        </p>
                    </motion.div>
                </div>

                {/* ─── STATS ROW (pulled up) ─── */}
                <motion.div
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#493B33]/30 rounded-2xl overflow-hidden mb-16 md:mb-24 border border-[#493B33]/30"
                >
                    {[
                        { val: 3, suf: "+", label: t("about.stat_years") },
                        { val: 15, suf: "+", label: t("about.stat_projects") },
                        { val: 4, suf: "", label: t("about.stat_languages") },
                        { val: 10, suf: "k+", label: t("about.stat_lines") },
                    ].map((s, i) => (
                        <div key={i} className="bg-[#1B1814]/70 p-6 md:p-9 group transition-all duration-300">
                            <span className="font-display font-bold text-4xl md:text-6xl text-grad-warm tracking-tight block">
                                <CountUp to={s.val} suffix={s.suf} />
                            </span>
                            <span className="label-mono block mt-3">{s.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* ─── BENTO GRID ─── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 mb-16 md:mb-24">
                    {/* Quick facts — 5 cols */}
                    <motion.div
                        custom={3}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-6 md:p-8 md:col-span-5 flex flex-col gap-3"
                    >
                        <span className="label-display mb-2">Quick facts</span>
                        {QUICK_FACTS.map((fact, i) => {
                            const Icon = fact.icon;
                            return (
                                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[#DBC7A6]/[0.03] transition-colors group">
                                    <Icon size={14} className="text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors shrink-0" />
                                    <span className="text-sm text-[#B39F85] group-hover:text-[#DBC7A6] transition-colors">
                                        {i === 3 ? (
                                            <>
                                                {t("about.fact_3")}
                                                <span className="font-green-energy text-[#DBC7A6] ml-0.5" style={{ fontSize: "1.35em", lineHeight: 1 }}>Monster</span>
                                            </>
                                        ) : t(`about.fact_${i}`)}
                                    </span>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* OSS + Self-taught — 3 cols */}
                    <motion.div
                        custom={4}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-6 md:p-8 md:col-span-3 flex flex-col justify-between gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="label-display">{t("about.stat_oss_label")}</span>
                            <span className="font-display font-bold text-5xl text-grad-warm tracking-tight">OSS</span>
                            <p className="text-xs text-[#B39F85]/70 leading-relaxed mt-1">Contributing and publishing openly is how I keep my promise.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="label-display">{t("about.stat_self_taught")}</span>
                            <div className="flex items-end gap-1">
                                <span className="font-display font-bold text-5xl text-grad-warm tracking-tight"><CountUp to={99} suffix="%" /></span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Manifesto quote — 4 cols */}
                    <motion.div
                        custom={5}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="bento-card p-8 md:p-10 md:col-span-4 flex flex-col justify-center relative"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#DBC7A6]/30 via-transparent to-transparent" />
                        <span className="text-[#B39F85]/20 text-5xl font-display block mb-3 select-none leading-none">&ldquo;</span>
                        <p className="font-display text-lg md:text-xl text-[#DBC7A6] leading-[1.2] tracking-tight font-bold">
                            {t("about.manifesto")}
                        </p>
                        <span className="text-xs font-mono text-[#7D6B56] tracking-wider mt-4 block">— Arka</span>
                    </motion.div>
                </div>

                {/* ─── TEAM PULLED QUOTE ─── */}
                <motion.div
                    custom={6}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative mb-16 md:mb-24 py-12 md:py-20 px-8 md:px-16"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] grad-warm" />
                    <span className="text-[#B39F85]/20 text-6xl md:text-8xl font-display absolute -top-2 left-10 md:left-16 select-none leading-none">&ldquo;</span>
                    <p className="font-display italic text-2xl md:text-4xl lg:text-5xl text-[#DBC7A6] leading-[1.18] tracking-tight font-bold max-w-4xl relative z-10">
                        {t("about.team_quote")}
                    </p>
                    <div className="rule-line mt-8 max-w-xs" />
                    <span className="text-sm font-mono text-[#7D6B56] tracking-wider mt-4 block relative z-10">— Arka</span>
                </motion.div>

                {/* ─── PRINCIPLES (merged beliefs + approach) ─── */}
                <div className="mb-16 md:mb-24">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="label-display mb-10 block"
                    >
                        {t("about.beliefs_label")}
                    </motion.span>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                        {PRINCIPLES.map((p, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.15 }}
                                className="group bento-card p-6 md:p-7 flex flex-col gap-4 hover:border-[#B39F85]/30 transition-all duration-500"
                            >
                                <span className="font-display font-bold text-4xl md:text-5xl text-grad-warm tracking-tight leading-none">
                                    #{String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 className="font-display font-bold text-base md:text-lg text-[#DBC7A6] tracking-tight">
                                    {t(`about.${p.key}_title`)}
                                </h3>
                                <p className="text-sm text-[#B39F85]/80 leading-relaxed">{t(`about.${p.key}_body`)}</p>
                                <div className="mt-auto pt-4">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#DBC7A6]/0 group-hover:via-[#DBC7A6]/30 to-transparent transition-all duration-700" />
                                </div>
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
                            className="px-4 py-2 rounded-full border border-[#493B33]/50 bg-[#1B1814]/50 text-xs font-mono text-[#7D6B56] tracking-wide hover:text-[#DBC7A6] hover:border-[#B39F85]/35 transition-all duration-300 cursor-default"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
