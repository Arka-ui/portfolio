"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import useSWR from "swr";

const GITHUB_USERNAME = "Arka-ui";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
};

const TECH_LINKS: Record<string, string> = {
    "React": "https://react.dev",
    "TypeScript": "https://www.typescriptlang.org",
    "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "Node.js": "https://nodejs.org",
    "Next.js": "https://nextjs.org",
    "Tailwind CSS": "https://tailwindcss.com",
    "Python": "https://www.python.org",
    "Java": "https://www.java.com",
    "Kotlin": "https://kotlinlang.org/",
    "Go": "https://go.dev/",
    "Rust": "https://www.rust-lang.org/",
    "HTML": "https://developer.mozilla.org/en-US/docs/Web/HTML",
    "CSS": "https://developer.mozilla.org/en-US/docs/Web/CSS",
    "PostgreSQL": "https://www.postgresql.org",
    "Redis": "https://redis.io",
    "Docker": "https://www.docker.com",
    "Figma": "https://www.figma.com",
    "Git": "https://git-scm.com",
    "VS Code": "https://code.visualstudio.com",
    "AWS": "https://aws.amazon.com",
    "Prisma": "https://www.prisma.io",
};

const TOOLS = ["Docker", "Git", "Figma", "VS Code", "Prisma", "PostgreSQL", "Redis"];

const CATEGORIES = [
    { label: "Frontend", keys: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS"] },
    { label: "Backend", keys: ["Node.js", "Python", "Java", "Kotlin", "Go", "Rust"] },
    { label: "Tools & Infra", keys: TOOLS },
];

export default function TechStack() {
    const { data: githubData } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=30`,
        fetcher
    );

    const usedLanguages: Set<string> = new Set(
        githubData ? githubData.map((r: { language: string | null }) => r.language).filter(Boolean) : []
    );

    return (
        <section id="skills" className="py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="label-mono mb-5 block">Craft</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="font-heading font-black text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white"
                        >
                            Tech stack
                        </motion.h2>
                    </div>
                    {usedLanguages.size > 0 && (
                        <span className="text-xs font-mono text-white/25">
                            {usedLanguages.size} languages detected on GitHub
                        </span>
                    )}
                </div>

                {/* Categories */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
                    {CATEGORIES.map((cat, ci) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: ci * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white/[0.02] p-6 flex flex-col gap-5"
                        >
                            <span className="label-mono">{cat.label}</span>
                            <div className="flex flex-col gap-1">
                                {cat.keys.map((tech, ti) => {
                                    const isActive = usedLanguages.has(tech);
                                    const href = TECH_LINKS[tech] || `https://www.google.com/search?q=${encodeURIComponent(tech)}`;
                                    return (
                                        <motion.a
                                            key={tech}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: ci * 0.05 + ti * 0.04 }}
                                            className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.05] transition-colors"
                                        >
                                            <span className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/45"}`}>
                                                {tech}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {isActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-80" />
                                                )}
                                                <ExternalLink
                                                    size={11}
                                                    className="opacity-0 group-hover:opacity-30 transition-opacity text-white"
                                                />
                                            </div>
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p className="text-xs font-mono text-white/20 mt-4 text-right">
                    Purple dot = detected on GitHub activity
                </p>
            </div>
        </section>
    );
}
