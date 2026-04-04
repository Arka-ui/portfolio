"use client";

import { motion } from "framer-motion";
import { Briefcase, FolderGit2, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ExperienceItem {
    type: "work" | "project" | "education";
    title: string;
    company: string;
    period: string;
    description: string;
    tag?: string;
}

const EXPERIENCE: ExperienceItem[] = [
    {
        type: "work",
        title: "App Developer",
        company: "Cambrai City Hall — Internship",
        period: "Jun 2025",
        description: "Designed and shipped a native news application for the city of Cambrai. Full dev cycle from wireframes to final build.",
        tag: "Java · Kotlin",
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

const TYPE_CONFIG = {
    work: { icon: Briefcase, accent: "lime" as const },
    project: { icon: FolderGit2, accent: "coral" as const },
    education: { icon: GraduationCap, accent: "white" as const },
};

const accentColors = {
    lime: { bg: "bg-[#ff6b35]/10", border: "border-[#ff6b35]/20", text: "text-[#ff6b35]", dot: "bg-[#ff6b35]" },
    coral: { bg: "bg-[#00cfb4]/10", border: "border-[#00cfb4]/20", text: "text-[#00cfb4]", dot: "bg-[#00cfb4]" },
    white: { bg: "bg-white/10", border: "border-white/20", text: "text-white/70", dot: "bg-white/70" },
};

export default function Timeline() {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-24 md:py-36 border-t border-white/[0.04]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="mb-14 md:mb-20">
                    <span className="label-mono mb-4 block">{t("timeline.label")}</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-heading font-bold text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white"
                    >
                        {t("timeline.heading")}
                    </motion.h2>
                </div>

                {/* Mobile: horizontal scroll */}
                <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
                    <div className="flex gap-4" style={{ width: "max-content" }}>
                        {EXPERIENCE.map((item, i) => {
                            const cfg = TYPE_CONFIG[item.type];
                            const Icon = cfg.icon;
                            const colors = accentColors[cfg.accent];
                            return (
                                <div
                                    key={i}
                                    className="w-[280px] shrink-0 bento-card p-6 flex flex-col gap-4"
                                    style={{ scrollSnapAlign: "start" }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text}`}>
                                            <Icon size={14} />
                                        </div>
                                        <span className="font-mono text-[10px] text-white/20">{item.period}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-base text-white tracking-tight">{item.title}</h3>
                                        <p className="text-xs text-white/35 mt-0.5">{item.company}</p>
                                    </div>
                                    <p className="text-xs text-white/40 leading-relaxed flex-1">{item.description}</p>
                                    {item.tag && <span className="badge-muted text-[10px] self-start">{item.tag}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop: vertical timeline */}
                <div className="hidden md:block max-w-3xl relative">
                    {/* Vertical line */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-[#ff6b35]/25 via-white/[0.06] to-transparent" />

                    {EXPERIENCE.map((item, i) => {
                        const cfg = TYPE_CONFIG[item.type];
                        const Icon = cfg.icon;
                        const colors = accentColors[cfg.accent];
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex gap-8 pb-10 last:pb-0 group"
                            >
                                {/* Dot */}
                                <div className="relative z-10 shrink-0">
                                    <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={14} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 bento-card p-6 group-hover:border-white/[0.1] transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <div>
                                            <h3 className="font-heading font-bold text-lg text-white tracking-tight">{item.title}</h3>
                                            <p className="text-sm text-white/35 mt-0.5">{item.company}</p>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-2 shrink-0">
                                            <span className="font-mono text-xs text-white/20">{item.period}</span>
                                            {item.tag && <span className="badge-muted text-[10px]">{item.tag}</span>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
