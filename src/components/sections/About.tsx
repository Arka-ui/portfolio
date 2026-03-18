"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Spotlight pointer handler — updates CSS vars so the radial gradient follows cursor
function useSpotlight() {
    return useCallback((e: React.PointerEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--spotlight-x", `${x}%`);
        e.currentTarget.style.setProperty("--spotlight-y", `${y}%`);
    }, []);
}

/* ─────────────────────────────────────────────
   Count-up number — animates 0 → target
───────────────────────────────────────────── */
function CountUp({
    to,
    suffix = "",
    duration = 1.6,
}: {
    to: number;
    suffix?: string;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.8 });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / (duration * 1000), 1);
            // Ease out quad
            const eased = 1 - (1 - p) * (1 - p);
            setCount(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, to, duration]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

/* ─────────────────────────────────────────────
   Stats data (labels resolved at render time)
───────────────────────────────────────────── */
const STAT_DEFS = [
    { numeric: 3,    suffix: "+",  labelKey: "about.stat_years"     },
    { numeric: 15,   suffix: "+",  labelKey: "about.stat_projects"  },
    { numeric: null, raw: "OSS",   labelKey: "about.stat_oss_label" },
    { numeric: 4,    suffix: "",   labelKey: "about.stat_languages" },
    { numeric: 10,   suffix: "k+", labelKey: "about.stat_lines"     },
    { numeric: 99,   suffix: "%",  labelKey: "about.stat_self_taught"},
];

const BELIEF_ICONS = ["◆", "◇", "△", "○"];
const BELIEF_TAGS  = ["00", "01", "02", "03"];

const APPROACH_STEPS = ["01", "02", "03", "04"];

const QUICK_FACT_EMOJIS = ["🇫🇷", "⌨️", "🎮", "☕", "🌙", "🎵"];

const TAGS = [
    "React", "Next.js", "TypeScript", "Clean Code",
    "Open Source", "UI / UX", "Performance",
    "API Design", "DX", "Real-time", "Systems",
    "Full-Stack", "DevOps", "Automation",
];

export default function About() {
    const spotlight = useSpotlight();
    const { t, transNodes } = useLanguage();
    const STATS = STAT_DEFS.map(s => ({ ...s, label: t(s.labelKey) }));
    const BELIEFS = BELIEF_TAGS.map((tag, i) => ({
        tag,
        icon: BELIEF_ICONS[i],
        title: t(`about.belief_${i}_title`),
        body:  t(`about.belief_${i}_body`),
    }));
    const APPROACH = APPROACH_STEPS.map((step, i) => ({
        step,
        title: t(`about.approach_${i}_title`),
        body:  t(`about.approach_${i}_body`),
    }));
    const QUICK_FACTS = QUICK_FACT_EMOJIS.map((emoji, i) => ({
        emoji,
        text: t(`about.fact_${i}`),
    }));

    return (
        <section id="about-intro" className="py-14 md:py-24 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">

                {/* ── Row 1: headline + bio ── */}
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start mb-14">

                    {/* Left — scan-reveal headline */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="label-mono mb-5 block"
                        >
                            {t("about.label")}
                        </motion.span>

                        <h2 className="font-heading font-black text-[clamp(38px,5.5vw,80px)] leading-[0.92] tracking-tighter">
                            <motion.span
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="block mb-1 text-white"
                            >
                                Developer,
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="block mb-1 text-white/25"
                            >
                                builder,
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="block text-white"
                            >
                                problem solver.
                            </motion.span>
                        </h2>

                        {/* Tag pills */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mt-8 flex flex-wrap gap-2"
                        >
                            {TAGS.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-white/50 tracking-wide hover:text-white/70 hover:border-white/[0.15] transition-all duration-200 cursor-default"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="mt-6 text-xs font-mono text-white/25 tracking-widest select-none"
                        >
                            — arka
                        </motion.p>

                        {/* Quick facts */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="mt-6 grid grid-cols-2 gap-2.5"
                        >
                            {QUICK_FACTS.map((fact, i) => (
                                <span
                                    key={i}
                                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white/50 font-mono hover:text-white/70 hover:border-white/[0.12] transition-all duration-200"
                                >
                                    <span>{fact.emoji}</span>
                                    {fact.text}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — bio + stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <div className="space-y-5">
                            <p className="text-lg text-white/75 leading-relaxed">
                                {t("about.bio_1")}
                            </p>
                            <p className="text-lg text-white/75 leading-relaxed">
                                {transNodes(t("about.bio_2"), {
                                    company: <span className="text-white font-semibold">EclozionMC</span>,
                                })}
                            </p>
                            <p className="text-lg text-white/75 leading-relaxed">
                                {t("about.bio_3")}
                            </p>
                        </div>

                        {/* Stats grid with count-up */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.6 }}
                                    transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                    className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 p-5 md:p-6 flex flex-col gap-1 group"
                                >
                                    <span className="font-heading font-black text-3xl text-white tracking-tight group-hover:text-indigo-200 transition-colors duration-300">
                                        {stat.numeric !== null && stat.numeric !== undefined ? (
                                            <CountUp to={stat.numeric} suffix={stat.suffix} />
                                        ) : (
                                            stat.raw
                                        )}
                                    </span>
                                    <span className="text-sm text-white/50 leading-tight">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Row 2: What I believe in ── */}
                <div className="border-t border-white/[0.06] pt-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="label-mono mb-10 block"
                    >
                        {t("about.beliefs_label")}
                    </motion.span>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
                        {BELIEFS.map((b, i) => (
                            <motion.div
                                key={b.tag}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                                onPointerMove={spotlight}
                                className="group relative bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 p-7 flex flex-col gap-4 overflow-hidden card-spotlight"
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-indigo-500/[0.05] to-transparent" />

                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] text-indigo-400/50 tracking-widest">{b.tag}</span>
                                    <span className="text-indigo-400/30 text-lg">{b.icon}</span>
                                </div>
                                <h3 className="font-heading font-bold text-lg text-white tracking-tight leading-snug">
                                    {b.title}
                                </h3>
                                <p className="text-[15px] text-white/60 leading-relaxed">{b.body}</p>

                                {/* Bottom accent on hover */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/30 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Row 3: How I work ── */}
                <div className="border-t border-white/[0.06] pt-16 mt-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="label-mono mb-10 block"
                    >
                        {t("about.approach_label")}
                    </motion.span>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {APPROACH.map((a, i) => (
                            <motion.div
                                key={a.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                onPointerMove={spotlight}
                                className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 card-spotlight"
                            >
                                {/* Step number with connecting line */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-500/[0.08] border border-indigo-500/[0.15] font-mono text-sm font-bold text-indigo-400/70">{a.step}</span>
                                    {i < APPROACH.length - 1 && (
                                        <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-indigo-500/10 to-transparent" />
                                    )}
                                </div>
                                <h3 className="font-heading font-bold text-white text-lg tracking-tight mb-2">{a.title}</h3>
                                <p className="text-[15px] text-white/55 leading-relaxed">{a.body}</p>
                                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/20 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Row 4: Personal manifesto quote ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-20 pt-16 border-t border-white/[0.06] text-center max-w-3xl mx-auto"
                >
                    <span className="text-indigo-400/20 text-6xl font-heading block mb-6">&ldquo;</span>
                    <p className="font-heading text-3xl md:text-5xl lg:text-6xl text-white/90 leading-[1.1] tracking-tight mb-8 font-bold">
                        &ldquo;{t("about.manifesto")}&rdquo;
                    </p>
                    <span className="text-sm font-mono text-white/30 tracking-wider">— Arka</span>
                </motion.div>

            </div>
        </section>
    );
}
