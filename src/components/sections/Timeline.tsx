"use client";

import { motion } from "framer-motion";
import { Briefcase, FolderGit2, GraduationCap } from "lucide-react";

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
        title: "Founder & Owner",
        company: "EclozionMC",
        period: "Oct 2025 — Present",
        description: "Building a Minecraft server platform from the ground up. My former partner Nexos stepped away early on — the project was too demanding for him to continue. I now lead everything: website, infrastructure, plugin development, and product direction.",
        tag: "Java · Web",
    },
    {
        type: "work",
        title: "App Developer",
        company: "Cambrai City Hall — Internship",
        period: "Jun 2025",
        description: "Designed and shipped a native news application for the city of Cambrai. Handled the full development cycle from wireframes to final build.",
        tag: "Java · Kotlin",
    },
    {
        type: "project",
        title: "Minecraft Plugin Developer",
        company: "Personal Projects",
        period: "Oct 2025",
        description: "Developed custom Java plugins for Minecraft servers, including gameplay mechanics, economy systems, and admin tooling.",
        tag: "Java",
    },
    {
        type: "project",
        title: "Python Projects",
        company: "Personal",
        period: "2023",
        description: "Explored automation, scripting, and data tools. Built bots, scrapers, and small utilities that solved real problems.",
        tag: "Python",
    },
    {
        type: "education",
        title: "Self-taught Web Development",
        company: "Start of the journey",
        period: "Early 2023",
        description: "Started with HTML and CSS. Grew into TypeScript, React, Next.js and full-stack development through relentless building.",
        tag: "HTML · CSS · JS",
    },
];

const TYPE_CONFIG = {
    work: { icon: Briefcase, color: "text-indigo-400", dot: "bg-indigo-400" },
    project: { icon: FolderGit2, color: "text-emerald-400", dot: "bg-emerald-400" },
    education: { icon: GraduationCap, color: "text-amber-400", dot: "bg-amber-400" },
};

export default function Timeline() {
    return (
        <section id="about" className="py-14 md:py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="mb-16">
                    <span className="label-mono mb-5 block">Experience</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-heading font-black text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white"
                    >
                        What I&apos;ve built
                    </motion.h2>
                </div>

                {/* Timeline */}
                <div className="max-w-3xl">
                    {EXPERIENCE.map((item, i) => {
                        const cfg = TYPE_CONFIG[item.type];
                        const Icon = cfg.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex gap-8 pb-12 last:pb-0"
                            >
                                {/* Left: dot + line */}
                                <div className="flex flex-col items-center shrink-0 pt-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/[0.08] shrink-0 ${cfg.color}`}>
                                        <Icon size={14} />
                                    </div>
                                    {i < EXPERIENCE.length - 1 && (
                                        <div className="w-px flex-1 mt-3 bg-gradient-to-b from-white/10 to-transparent" />
                                    )}
                                </div>

                                {/* Right: content */}
                                <div className="flex-1 min-w-0 pb-2">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <div>
                                            <h3 className="font-heading font-bold text-lg text-white tracking-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-white/45 mt-0.5">{item.company}</p>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-2 shrink-0">
                                            <span className="font-mono text-xs text-white/30">{item.period}</span>
                                            {item.tag && (
                                                <span className="badge-muted text-[11px]">{item.tag}</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
