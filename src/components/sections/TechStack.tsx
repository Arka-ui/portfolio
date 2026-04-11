"use client";

import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { useState } from "react";
import { X, ChevronRight } from "lucide-react";

const GITHUB_USERNAME = "Arka-ui";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
};

const TECH_EXPLANATIONS: Record<string, string> = {
    "React": "React lets me build interactive websites by splitting the page into small, reusable pieces. Like building with LEGO — each block works on its own but snaps together to create something bigger.",
    "Next.js": "Next.js is like React with superpowers. It makes websites load faster by preparing pages in advance, handles navigation smoothly, and takes care of behind-the-scenes work.",
    "TypeScript": "TypeScript is JavaScript with safety rails. It catches mistakes before they happen — like a spell-checker for code.",
    "Tailwind CSS": "Tailwind CSS lets me design directly in the code. Simple keywords control colors, spacing, and layout — consistent and fast.",
    "HTML": "HTML is the skeleton of every website — headings, paragraphs, images, links. Fundamental for accessibility and SEO.",
    "CSS": "CSS is what makes websites look good — colors, fonts, layouts, animations. The polished visual experience you see here.",
    "Node.js": "Node.js lets me use JavaScript for both frontend and backend. Handles emails, forms, and data management.",
    "Python": "Python is incredibly versatile — automation, data processing, quick tools. Clean syntax for solving problems fast.",
    "Java": "Java powers Android apps and large-scale systems. Reliable, fast, runs anywhere. Used for Minecraft plugins and the Cambrai city app.",
    "Rust": "Rust gives maximum performance with maximum safety — no crashes, no memory leaks. For when speed really matters.",
    "PostgreSQL": "PostgreSQL stores and organizes all app data. Reliable, free, handles complex queries better than almost anything else.",
    "Docker": "Docker packages apps into containers. 'Works on my computer' becomes 'works everywhere.'",
    "Git": "Git tracks every code change. If something breaks, I can go back instantly. Makes collaboration seamless.",
    "VS Code": "VS Code is my code editor — extensions, intelligent autocomplete, and debugging tools that make coding faster.",
    "Prisma": "Prisma translates between code and database. Describe what you want in TypeScript, Prisma handles the rest.",
    "GitHub Actions": "GitHub Actions automates tests, error checking, and deployment on every push. Quality control 24/7.",
    "Nginx": "Nginx handles incoming traffic, serves files efficiently, keeps everything running smoothly at scale.",
    "better-auth": "better-auth handles authentication the right way — sign-up, login, sessions, OAuth, all with a clean API.",
    "Drizzle": "Drizzle is a lightweight TypeScript ORM — feels like writing SQL but with full type-safety.",
    "shadcn/ui": "shadcn/ui gives beautifully designed, accessible components I copy directly into my project. No dependency lock-in.",
};

const CATEGORIES = [
    {
        label: "Frontend",
        color: "lime",
        keys: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS", "shadcn/ui"],
    },
    {
        label: "Backend",
        color: "coral",
        keys: ["Node.js", "Python", "Java", "Rust", "better-auth", "Drizzle"],
    },
    {
        label: "Tools & Infra",
        color: "white",
        keys: ["Docker", "Git", "VS Code", "Prisma", "PostgreSQL", "GitHub Actions", "Nginx"],
    },
];

const fadeUp = {
    hidden: { y: 28, opacity: 0, scale: 0.94, filter: "blur(10px)" },
    show: (i: number) => ({
        y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
        transition: {
            duration: 1.05, delay: i * 0.1, ease: [0.2, 0.9, 0.25, 1.05] as const,
            filter: { duration: 0.75, delay: i * 0.1 },
        },
    }),
};

export default function TechStack() {
    const { data: githubData } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=30`,
        fetcher
    );

    const [expandedTech, setExpandedTech] = useState<string | null>(null);

    const usedLanguages: Set<string> = new Set(
        githubData ? githubData.map((r: { language: string | null }) => r.language).filter(Boolean) : []
    );

    const colorMap: Record<string, { dot: string; border: string; bg: string; text: string }> = {
        lime:  { dot: "bg-[#DBC7A6]", border: "border-[#DBC7A6]/25", bg: "bg-[#DBC7A6]/[0.06]", text: "text-[#DBC7A6]" },
        coral: { dot: "bg-[#B39F85]", border: "border-[#B39F85]/25", bg: "bg-[#B39F85]/[0.06]", text: "text-[#B39F85]" },
        white: { dot: "bg-[#7D6B56]", border: "border-[#7D6B56]/30", bg: "bg-[#7D6B56]/[0.06]", text: "text-[#B39F85]" },
    };

    return (
        <section id="skills" className="py-24 md:py-36 border-t border-[#493B33]/25 md:pl-[72px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
                    <div>
                        <span className="label-display mb-4 block">Craft</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display font-bold text-[clamp(40px,5.5vw,76px)] leading-[0.88] tracking-tighter text-[#DBC7A6]"
                        >
                            Tech stack
                        </motion.h2>
                    </div>
                    <span className="text-[11px] font-mono text-[#7D6B56]">
                        {usedLanguages.size > 0 ? `${usedLanguages.size} languages on GitHub` : "Click any tech for details"}
                    </span>
                </div>

                {/* Category cards */}
                <div className="grid md:grid-cols-3 gap-5">
                    {CATEGORIES.map((cat, ci) => {
                        const c = colorMap[cat.color];
                        return (
                            <motion.div
                                key={cat.label}
                                custom={ci}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                className="bento-card p-6 md:p-8 flex flex-col gap-6"
                            >
                                {/* Category header */}
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                                    <span className="label-mono tracking-[0.15em]">{cat.label}</span>
                                </div>

                                {/* Tech list */}
                                <div className="flex flex-col gap-0.5">
                                    {cat.keys.map((tech) => {
                                        const isActive = usedLanguages.has(tech);
                                        const isExpanded = expandedTech === tech;
                                        return (
                                            <div key={tech}>
                                                <button
                                                    onClick={() => setExpandedTech(isExpanded ? null : tech)}
                                                    className={`group flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-[#251E18]/60 transition-all duration-200 text-left ${isExpanded ? `bg-[#251E18]/60 ${c.border} border` : ""}`}
                                                >
                                                    <span className={`text-sm font-medium transition-colors ${isActive ? "text-[#DBC7A6]" : "text-[#7D6B56]"} ${isExpanded ? c.text : ""}`}>
                                                        {tech}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {isActive && <span className={`w-1.5 h-1.5 rounded-full ${c.dot} opacity-80`} />}
                                                        <ChevronRight
                                                            size={12}
                                                            className={`text-[#5F564D] transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                                                        />
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && TECH_EXPLANATIONS[tech] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className={`mx-3 mb-2 p-4 rounded-xl ${c.bg} ${c.border} border`}>
                                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                                    <span className={`text-[10px] font-mono ${c.text} opacity-70 uppercase tracking-wider`}>
                                                                        Why {tech}
                                                                    </span>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); setExpandedTech(null); }}
                                                                        className="text-white/18 hover:text-white/50 transition-colors shrink-0"
                                                                    >
                                                                        <X size={11} />
                                                                    </button>
                                                                </div>
                                                                <p className="text-[13px] text-white/40 leading-relaxed">
                                                                    {TECH_EXPLANATIONS[tech]}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
