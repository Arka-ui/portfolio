"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function CountUp({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
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

    return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

/* Numbered in reverse — counts down from VI to I. */
const PRINCIPLES = [
    { key: "belief_0", roman: "VI" },
    { key: "belief_1", roman: "V" },
    { key: "belief_2", roman: "IV" },
    { key: "belief_3", roman: "III" },
    { key: "approach_0", roman: "II" },
    { key: "approach_1", roman: "I" },
];

const FACTS = [
    { key: "fact_0" }, { key: "fact_1" }, { key: "fact_2" },
    { key: "fact_3" }, { key: "fact_4" }, { key: "fact_5" },
];

const TAGS = [
    "typescript", "api design", "security", "performance", "server ops",
    "domain management", "seo", "node.js", "postgresql", "real-time",
    "systems", "devops", "automation", "open source",
];

export default function About() {
    const { t, transNodes } = useLanguage();

    return (
        <section id="about-intro" className="py-24 md:py-32 md:pl-[88px] border-t border-[#493B33]/35">
            <div className="container mx-auto px-6 md:px-12">
                {/* ── Folio head ── */}
                <motion.div {...enter(0)} className="flex items-center gap-4 mb-14">
                    <span className="atlas-folio">§ 03 · About</span>
                    <span aria-hidden className="flex-1 atlas-rule" />
                    <span className="atlas-folio">— Arka</span>
                </motion.div>

                {/* ── Headline broadside ── */}
                <motion.div {...enter(0.05)} className="mb-12 md:mb-20 max-w-5xl">
                    <h2 className="font-display font-bold leading-[0.88] tracking-tighter text-[#DBC7A6]" style={{ fontSize: "clamp(40px, 6.5vw, 96px)" }}>
                        {t("about.headline_1")}<br />
                        <span className="italic font-medium text-[#B39F85]">{t("about.headline_2")}</span><br />
                        <span className="text-[#7D6B56]">{t("about.headline_3")}</span>
                    </h2>
                </motion.div>

                {/* ── Manuscript spread: 8/4 column with marginalia ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-12 mb-20 md:mb-28">
                    {/* Column 1 — bio with drop cap */}
                    <motion.div {...enter(0.08)} className="md:col-span-8 space-y-5 max-w-[64ch]">
                        <p className="dropcap text-[#B39F85] text-[16px] md:text-[17px] leading-[1.7]">
                            {t("about.bio_1")}
                        </p>
                        <p className="text-[#B39F85] text-[15px] md:text-[16px] leading-[1.7]">
                            {transNodes(t("about.bio_2"), {
                                company: <span key="company" className="text-[#DBC7A6] font-medium">RiftMC</span>,
                            })}
                        </p>
                        <p className="text-[#B39F85] text-[15px] md:text-[16px] leading-[1.7]">
                            {t("about.bio_3")}
                        </p>
                        <p className="text-[#B39F85] text-[15px] md:text-[16px] leading-[1.7]">
                            {transNodes(t("about.bio_4"), {
                                host: (
                                    <a key="host" href="https://nemesius.fr" target="_blank" rel="noopener noreferrer" className="atlas-link text-[#DBC7A6]">
                                        Nemesius
                                    </a>
                                ),
                            })}
                        </p>

                        {/* Inline tabular colophon */}
                        <p className="pt-6 mt-6 border-t border-[#493B33]/45 font-mono text-[11px] md:text-[12px] tracking-[0.16em] uppercase text-[#7D6B56]">
                            <span className="text-[#DBC7A6]"><CountUp to={3} />+ yr</span>
                            <span className="text-[#5F564D] mx-3">·</span>
                            <span className="text-[#DBC7A6]"><CountUp to={15} />+ proj</span>
                            <span className="text-[#5F564D] mx-3">·</span>
                            <span className="text-[#DBC7A6]"><CountUp to={4} /> lang</span>
                            <span className="text-[#5F564D] mx-3">·</span>
                            <span className="text-[#DBC7A6]"><CountUp to={10} />k+ loc</span>
                            <span className="text-[#5F564D] mx-3">·</span>
                            <span className="text-[#DBC7A6]"><CountUp to={99} />% self-taught</span>
                        </p>

                        {/* Signature */}
                        <p className="pt-2 italic text-[#DBC7A6] text-[18px] md:text-[20px] leading-none tracking-tight">
                            — Arka<span className="not-italic text-[#7D6B56] text-[10px] tracking-[0.2em] uppercase ml-3">/ MMXXVI</span>
                        </p>
                    </motion.div>

                    {/* Column 2 — marginalia */}
                    <motion.aside {...enter(0.16)} className="md:col-span-4 md:pt-2 md:border-l md:border-[#493B33]/45 md:pl-6">
                        <span className="atlas-folio block mb-4">Marginalia</span>
                        <ul className="space-y-3 mb-10">
                            {FACTS.map((f, i) => (
                                <li key={i} className="marginalia">
                                    <span className="marginalia-num mr-2">☞</span>
                                    {i === 3 ? (
                                        <>
                                            {t("about.fact_3")}
                                            <span className="font-green-energy text-[#DBC7A6] ml-0.5" style={{ fontSize: "1.4em", lineHeight: 1 }}>Monster</span>
                                        </>
                                    ) : t(`about.fact_${i}`)}
                                </li>
                            ))}
                        </ul>

                        <span className="atlas-folio block mb-4">{t("about.beliefs_label")}</span>
                        <ol className="space-y-4">
                            {PRINCIPLES.map((p, i) => (
                                <li key={i} className="grid grid-cols-[28px_1fr] gap-3 items-start">
                                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7D6B56] mt-0.5">{p.roman}.</span>
                                    <div>
                                        <h3 className="text-[13px] md:text-[14px] text-[#DBC7A6] font-medium tracking-tight">
                                            {t(`about.${p.key}_title`)}
                                        </h3>
                                        <p className="text-[12px] md:text-[13px] text-[#B39F85]/85 leading-[1.55] mt-1">
                                            {t(`about.${p.key}_body`)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </motion.aside>
                </div>

                {/* ── Pulled quote ── */}
                <motion.figure {...enter(0)} className="mb-20 md:mb-28">
                    <div className="atlas-rule mb-10" aria-hidden />
                    <blockquote>
                        <span className="text-[#7D6B56] text-[64px] md:text-[96px] leading-none block mb-3 font-bold" aria-hidden>&ldquo;</span>
                        <p className="pull-quote text-[28px] md:text-[44px] lg:text-[56px] max-w-[18ch] md:max-w-[22ch]">
                            {t("about.team_quote")}
                        </p>
                    </blockquote>
                    <figcaption className="mt-8 atlas-folio">— Arka, MMXXVI</figcaption>
                    <div className="atlas-rule mt-10" aria-hidden />
                </motion.figure>

                {/* ── Manifesto ── */}
                <motion.div {...enter(0)} className="mb-20 md:mb-24 max-w-4xl">
                    <span className="atlas-folio block mb-4">Manifesto</span>
                    <p className="font-display font-medium italic text-[#DBC7A6] text-[22px] md:text-[32px] leading-[1.25] tracking-tight">
                        {t("about.manifesto")}
                    </p>
                </motion.div>

                {/* ── Inline tag list ── */}
                <motion.div {...enter(0)} className="border-t border-[#493B33]/45 pt-8">
                    <span className="atlas-folio mr-4">Keywords</span>
                    <span className="font-mono text-[11px] md:text-[12px] text-[#B39F85] tracking-[0.06em] leading-[2]">
                        {TAGS.map((tag, i) => (
                            <span key={tag}>
                                <span className="hover:text-[#DBC7A6] transition-colors cursor-default">{tag}</span>
                                {i < TAGS.length - 1 && <span className="text-[#5F564D] mx-2">·</span>}
                            </span>
                        ))}
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
