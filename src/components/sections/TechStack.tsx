"use client";

import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

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

const ENTRIES = [
    { label: "better-auth",   category: "Backend"        },
    { label: "CSS",           category: "Frontend"       },
    { label: "Docker",        category: "Tools & Infra"  },
    { label: "Drizzle",       category: "Backend"        },
    { label: "Git",           category: "Tools & Infra"  },
    { label: "GitHub Actions",category: "Tools & Infra"  },
    { label: "HTML",          category: "Frontend"       },
    { label: "Java",          category: "Backend"        },
    { label: "Next.js",       category: "Frontend"       },
    { label: "Nginx",         category: "Tools & Infra"  },
    { label: "Node.js",       category: "Backend"        },
    { label: "PostgreSQL",    category: "Tools & Infra"  },
    { label: "Prisma",        category: "Tools & Infra"  },
    { label: "Python",        category: "Backend"        },
    { label: "React",         category: "Frontend"       },
    { label: "Rust",          category: "Backend"        },
    { label: "shadcn/ui",     category: "Frontend"       },
    { label: "Tailwind CSS",  category: "Frontend"       },
    { label: "TypeScript",    category: "Frontend"       },
    { label: "VS Code",       category: "Tools & Infra"  },
];

export default function TechStack() {
    const { t } = useLanguage();
    const { data: githubData } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=30`,
        fetcher
    );

    const [expanded, setExpanded] = useState<string | null>(null);

    const usedLanguages: Set<string> = new Set(
        githubData ? githubData.map((r: { language: string | null }) => r.language).filter(Boolean) : []
    );

    return (
        <section id="skills" className="py-24 md:py-32 border-t border-[#493B33]/35 md:pl-[88px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Folio head */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <span className="atlas-folio">§ 06 · {t("stack.label")}</span>
                    <span aria-hidden className="flex-1 atlas-rule" />
                    <span className="atlas-folio">
                        {usedLanguages.size > 0
                            ? t("stack.languages_on_github", { count: String(usedLanguages.size) })
                            : t("stack.click_for_details")}
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display font-bold leading-[0.92] tracking-tighter text-[#DBC7A6] max-w-3xl mb-12 md:mb-14"
                    style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
                >
                    {t("stack.heading")}
                </motion.h2>

                {/* Index header */}
                <div className="hidden md:grid md:grid-cols-[40px_minmax(220px,1.6fr)_minmax(160px,1fr)_60px_36px] gap-6 atlas-folio pb-3">
                    <span>№</span>
                    <span>Instrument</span>
                    <span>Section</span>
                    <span className="text-right">In use</span>
                    <span className="text-right">±</span>
                </div>
                <div className="atlas-rule-strong mb-1" aria-hidden />

                {/* Entries */}
                <ul className="divide-y divide-[#493B33]/35">
                    {ENTRIES.map((tech, idx) => {
                        const num = String(idx + 1).padStart(2, "0");
                        const isActive = usedLanguages.has(tech.label);
                        const isExpanded = expanded === tech.label;
                        const explain = TECH_EXPLANATIONS[tech.label];

                        return (
                            <li key={tech.label} className="ledger-row group block">
                                <button
                                    type="button"
                                    onClick={() => setExpanded(isExpanded ? null : tech.label)}
                                    className="w-full text-left py-4 md:py-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DBC7A6]/40"
                                    aria-expanded={isExpanded}
                                >
                                    {/* Mobile */}
                                    <div className="md:hidden flex items-center justify-between gap-3">
                                        <div className="flex items-baseline gap-3 min-w-0">
                                            <span className="font-mono text-[10px] text-[#7D6B56] tabular-nums w-6 shrink-0">{num}</span>
                                            <span className={`font-display text-[16px] tracking-tight ${isActive ? "text-[#DBC7A6]" : "text-[#B39F85]"}`}>
                                                {tech.label}
                                            </span>
                                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7D6B56] truncate">
                                                {tech.category}
                                            </span>
                                        </div>
                                        <span className="font-mono text-[12px] text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors">
                                            {isExpanded ? "−" : "+"}
                                        </span>
                                    </div>

                                    {/* Desktop */}
                                    <div className="hidden md:grid md:grid-cols-[40px_minmax(220px,1.6fr)_minmax(160px,1fr)_60px_36px] gap-6 items-baseline">
                                        <span className="font-mono text-[11px] text-[#7D6B56] tabular-nums">{num}</span>
                                        <span className={`font-display text-[18px] lg:text-[20px] tracking-tight ${isActive ? "text-[#DBC7A6]" : "text-[#B39F85] group-hover:text-[#DBC7A6]"} transition-colors duration-300`}>
                                            {tech.label}
                                        </span>
                                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7D6B56]">
                                            {tech.category}
                                        </span>
                                        <span className="font-mono text-[11px] text-right inline-flex items-center justify-end gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#DBC7A6]" : "bg-[#5F564D]"}`} />
                                            <span className={isActive ? "text-[#DBC7A6]" : "text-[#5F564D]"}>
                                                {isActive ? "yes" : "—"}
                                            </span>
                                        </span>
                                        <span className="font-mono text-[12px] text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors text-right">
                                            {isExpanded ? "−" : "+"}
                                        </span>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isExpanded && explain && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="md:pl-[64px] pb-5 pt-1 max-w-[68ch]">
                                                <p className="atlas-folio mb-2">
                                                    † {t("stack.why")} {tech.label}
                                                </p>
                                                <p className="text-[14px] md:text-[15px] text-[#B39F85] leading-[1.65]">
                                                    {explain}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>

                <div className="atlas-rule-strong mt-1" aria-hidden />
                <p className="mt-6 atlas-folio">
                    {ENTRIES.length} entries · sorted alphabetically · click any row for a footnote
                </p>
            </div>
        </section>
    );
}
