"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ExperienceItem {
    type: "work" | "project" | "education";
    title: string;
    company: string;
    period: string;
    description: string;
    tag?: string;
}

// Ordered most recent first
const EXPERIENCE: ExperienceItem[] = [
    {
        type: "project",
        title: "Arka News System",
        company: "Open-source · GitHub-native",
        period: "Apr 2026",
        description: "A cryptographically signed news publishing system running entirely on GitHub. Ed25519-signed posts, Python CLI, and GitHub Actions as the publishing pipeline — no server, no database, just Git.",
        tag: "Python · Ed25519 · GitHub Actions",
    },
    {
        type: "work",
        title: "Founder",
        company: "EclozionMC — Archived",
        period: "Oct 2025 — Feb 2026",
        description: "Built a Minecraft server platform from scratch. Archived Feb 2026 — lessons learned, bigger things ahead.",
        tag: "Java · Web",
    },
    {
        type: "project",
        title: "Minecraft Plugins",
        company: "Personal Projects",
        period: "Oct 2025",
        description: "Custom Java plugins — gameplay mechanics, economy systems, and admin tooling.",
        tag: "Java",
    },
    {
        type: "work",
        title: "App Developer",
        company: "Cambrai City Hall — Internship",
        period: "Jun 2025",
        description: "Designed and shipped a native news application for the city of Cambrai. Full dev cycle from wireframes to final build.",
        tag: "Java · Kotlin",
    },
    {
        type: "project",
        title: "Python Projects",
        company: "Personal",
        period: "2023",
        description: "Automation, scripting, data tools. Bots, scrapers, and utilities that solved real problems.",
        tag: "Python",
    },
    {
        type: "education",
        title: "Self-taught Dev",
        company: "Start of the journey",
        period: "Early 2023",
        description: "HTML/CSS → TypeScript → React → Next.js. Full-stack through relentless building.",
        tag: "HTML · CSS · JS",
    },
];

const TYPE_LABEL: Record<ExperienceItem["type"], string> = {
    work: "Work",
    project: "Project",
    education: "Education",
};

function Chapter({ item, index }: { item: ExperienceItem; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.35, once: true });
    const num = String(index + 1).padStart(2, "0");

    return (
        <div ref={ref} className={`slime-reveal ${inView ? "is-in" : ""}`}>
            {/* ─── Mobile layout ─── */}
            <div className="md:hidden">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="font-display font-bold text-[76px] leading-[0.85] tracking-tighter text-grad-warm">
                        {num}
                    </div>
                    <div className="flex flex-col items-end gap-2 pt-3">
                        <span className="label-mono text-[#DBC7A6]/55">{item.period}</span>
                        <span className="label-mono">{TYPE_LABEL[item.type]}</span>
                    </div>
                </div>
                <div className="bento-card p-6">
                    <h3 className="font-display font-bold text-xl text-[#DBC7A6] tracking-tight">{item.title}</h3>
                    <p className="text-sm text-[#B39F85]/75 mt-0.5">{item.company}</p>
                    <p className="text-sm text-[#B39F85] leading-relaxed mt-4">{item.description}</p>
                    {item.tag && <span className="badge mt-5 text-[10px]">{item.tag}</span>}
                </div>
            </div>

            {/* ─── Desktop layout: no margin hairline, no "Ch." ─── */}
            <div className="hidden md:grid grid-cols-[180px_1fr] gap-10 pb-10 last:pb-0 relative">
                <div className="relative">
                    <div
                        className="font-display font-bold leading-[0.82] tracking-tighter text-grad-warm transition-all duration-700"
                        style={{
                            fontSize: "clamp(68px,6.5vw,112px)",
                            fontVariationSettings: inView ? "'wght' 800" : "'wght' 500",
                        }}
                    >
                        {num}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#B39F85]/80 mt-3">{item.period}</div>
                    <div className="label-mono mt-1">{TYPE_LABEL[item.type]}</div>
                </div>

                <div className="relative pt-2">
                    <h3 className="font-display font-bold text-[26px] text-[#DBC7A6] tracking-tight leading-tight">{item.title}</h3>
                    <p className="text-sm text-[#B39F85]/70 mt-1">{item.company}</p>
                    <p className="text-[15px] text-[#B39F85] leading-relaxed mt-5 max-w-xl">{item.description}</p>
                    {item.tag && <span className="badge mt-5 text-[10px] inline-flex">{item.tag}</span>}
                </div>
            </div>
        </div>
    );
}

function ChapterBreak() {
    return (
        <div className="flex items-center gap-4 my-10 md:my-12">
            <div className="flex-1 dashed-h h-px" />
            <div className="chapter-dot" />
            <div className="flex-1 dashed-h h-px" />
        </div>
    );
}

export default function Timeline() {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-24 md:py-36 border-t border-[#493B33]/25 md:pl-[72px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="mb-16 md:mb-24 max-w-3xl">
                    <span className="label-display block mb-4">{t("timeline.label")}</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-bold text-[clamp(40px,5.5vw,76px)] leading-[0.88] tracking-tighter text-[#DBC7A6]"
                    >
                        {t("timeline.heading")}
                    </motion.h2>
                    <div className="rule-line mt-10" />
                </div>

                {/* Mobile */}
                <div className="md:hidden flex flex-col">
                    {EXPERIENCE.map((item, i) => (
                        <div key={i}>
                            <Chapter item={item} index={i} />
                            {i < EXPERIENCE.length - 1 && <ChapterBreak />}
                        </div>
                    ))}
                </div>

                {/* Desktop */}
                <div className="hidden md:block max-w-4xl">
                    {EXPERIENCE.map((item, i) => (
                        <div key={i}>
                            <Chapter item={item} index={i} />
                            {i < EXPERIENCE.length - 1 && <ChapterBreak />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
