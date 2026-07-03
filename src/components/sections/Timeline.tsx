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

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

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
        description: "HTML/CSS → TypeScript → React — then deeper into the backend. Learned by relentless building.",
        tag: "HTML · CSS · JS",
    },
];

const TYPE_LABEL: Record<ExperienceItem["type"], string> = {
    work: "Work",
    project: "Project",
    education: "Education",
};

function LogEntry({ item, index }: { item: ExperienceItem; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.25, once: true });
    const roman = ROMAN[index] || String(index + 1);

    return (
        <article
            ref={ref}
            className={`slime-reveal ${inView ? "is-in" : ""} ledger-row group block py-7 md:py-9`}
        >
            {/* Mobile */}
            <div className="md:hidden">
                <div className="flex items-baseline justify-between gap-3 mb-3">
                    <span className="font-display font-bold text-[44px] leading-none text-[#DBC7A6] tracking-tighter tabular-nums">
                        {roman}.
                    </span>
                    <div className="text-right">
                        <span className="block atlas-folio">{item.period}</span>
                        <span className="block atlas-folio mt-0.5">{TYPE_LABEL[item.type]}</span>
                    </div>
                </div>
                <h3 className="font-display font-bold text-[20px] text-[#DBC7A6] tracking-tight leading-tight">{item.title}</h3>
                <p className="text-[12px] font-mono text-[#7D6B56] tracking-wider mt-1">{item.company}</p>
                <p className="text-[14px] text-[#B39F85] leading-[1.6] mt-3">{item.description}</p>
                {item.tag && (
                    <p className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[#7D6B56]">
                        {item.tag.split(" · ").map((t, i, a) => (
                            <span key={i}>
                                {t}{i < a.length - 1 && <span className="text-[#5F564D] mx-2">·</span>}
                            </span>
                        ))}
                    </p>
                )}
            </div>

            {/* Desktop — printed log row */}
            <div className="hidden md:grid md:grid-cols-[80px_140px_1fr_180px] gap-8 items-start">
                {/* Roman */}
                <div className="font-display font-bold text-[#DBC7A6] tracking-tighter tabular-nums leading-none" style={{ fontSize: "clamp(48px, 4.5vw, 72px)" }}>
                    {roman}.
                </div>
                {/* Date + type */}
                <div className="pt-3">
                    <div className="atlas-folio-strong">{item.period}</div>
                    <div className="atlas-folio mt-1">{TYPE_LABEL[item.type]}</div>
                </div>
                {/* Title + company + body */}
                <div className="pt-2 max-w-[58ch]">
                    <h3 className="font-display font-bold text-[24px] lg:text-[28px] text-[#DBC7A6] tracking-tight leading-tight">
                        {item.title}
                    </h3>
                    <p className="text-[12px] font-mono text-[#7D6B56] tracking-[0.18em] uppercase mt-1.5">{item.company}</p>
                    <p className="text-[14px] lg:text-[15px] text-[#B39F85] leading-[1.65] mt-4">{item.description}</p>
                </div>
                {/* Tag stack */}
                <div className="pt-3 text-right">
                    {item.tag && (
                        <ul className="space-y-1">
                            {item.tag.split(" · ").map((t, i) => (
                                <li key={i} className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7D6B56]">{t}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function Timeline() {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-24 md:py-32 border-t border-[#493B33]/35 md:pl-[88px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Folio head */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-4 mb-10"
                >
                    <span className="atlas-folio">§ 03·b · {t("timeline.label")}</span>
                    <span aria-hidden className="flex-1 atlas-rule" />
                    <span className="atlas-folio">{EXPERIENCE.length} entries</span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display font-bold leading-[0.92] tracking-tighter text-[#DBC7A6] max-w-3xl mb-12 md:mb-16"
                    style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
                >
                    {t("timeline.heading")}
                </motion.h2>

                {/* Top double rule */}
                <div className="atlas-rule-double mb-2" aria-hidden />

                {/* Log entries */}
                <div className="divide-y divide-[#493B33]/35">
                    {EXPERIENCE.map((item, i) => (
                        <LogEntry key={i} item={item} index={i} />
                    ))}
                </div>

                {/* Bottom double rule */}
                <div className="atlas-rule-double mt-2" aria-hidden />

                {/* Footer note */}
                <p className="mt-8 atlas-folio">
                    Log continues — § 04 · {t("projects.label")}
                </p>
            </div>
        </section>
    );
}
