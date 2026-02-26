"use client";

import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { useState } from "react";
import { X } from "lucide-react";

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
    "Rust": "https://www.rust-lang.org/",
    "HTML": "https://developer.mozilla.org/en-US/docs/Web/HTML",
    "CSS": "https://developer.mozilla.org/en-US/docs/Web/CSS",
    "PostgreSQL": "https://www.postgresql.org",
    "Docker": "https://www.docker.com",
    "Git": "https://git-scm.com",
    "VS Code": "https://code.visualstudio.com",
    "Prisma": "https://www.prisma.io",
    "GitHub Actions": "https://github.com/features/actions",
    "Nginx": "https://nginx.org",
    "better-auth": "https://www.better-auth.com",
    "Drizzle": "https://orm.drizzle.team",
    "shadcn/ui": "https://ui.shadcn.com",
};

/* ─── Why I use each tech — plain-language explanations ─── */
const TECH_EXPLANATIONS: Record<string, string> = {
    "React": "React lets me build interactive websites by splitting the page into small, reusable pieces. Like building with LEGO — each block works on its own but snaps together to create something bigger. It makes the website feel fast and alive instead of reloading every time you click something.",
    "Next.js": "Next.js is like React with superpowers. It makes websites load faster by preparing pages in advance, handles navigation smoothly, and takes care of a lot of the boring but important behind-the-scenes work. It's my go-to for every serious project.",
    "TypeScript": "TypeScript is JavaScript with safety rails. It catches mistakes before they happen — like a spell-checker for code. It saves hours of debugging and makes the code much easier to understand and maintain over time.",
    "Tailwind CSS": "Tailwind CSS lets me design directly in the code without jumping between files. Instead of writing complex style sheets, I use simple keywords to control colors, spacing, and layout. It keeps everything consistent and speeds up the design process a lot.",
    "HTML": "HTML is the skeleton of every website. It defines the structure — headings, paragraphs, images, links. Every website you've ever visited is built on HTML. It's fundamental, and getting it right means better accessibility and search engine rankings.",
    "CSS": "CSS is what makes websites look good — colors, fonts, layouts, animations. Without CSS, every website would look like a plain text document. I use it to create the polished visual experience you see here.",
    "Node.js": "Node.js lets me use the same language (JavaScript) for both the website you see and the server behind it. It handles things like sending emails, processing forms, and managing data — the invisible work that makes everything function.",
    "Python": "Python is incredibly versatile — I use it for automation, data processing, and building quick tools. Its clean syntax makes it perfect for solving problems fast, from web scrapers to complex algorithms.",
    "Java": "Java powers Android apps and large-scale systems. It's reliable, fast, and runs on almost anything. I used it extensively for Minecraft plugin development and the Cambrai city app.",
    "Rust": "Rust gives you maximum performance with maximum safety — no crashes, no memory leaks. I use it when speed really matters, like in system tools or performance-critical applications.",
    "PostgreSQL": "PostgreSQL is a powerful database that stores and organizes all the data an app needs — user accounts, messages, products, etc. It's reliable, free, and handles complex queries better than almost anything else.",
    "Docker": "Docker packages an entire app and its environment into a neat box (called a container). This means \"it works on my computer\" becomes \"it works everywhere\" — no more setup headaches when deploying.",
    "Git": "Git tracks every change I make to the code, like a detailed history of the project. If something breaks, I can go back to a working version instantly. It also makes collaborating with others seamless.",
    "VS Code": "VS Code is my code editor — where I write every line. It's packed with extensions, intelligent autocomplete, and debugging tools that make coding faster and more enjoyable.",
    "Prisma": "Prisma acts as a translator between my code and the database. Instead of writing complex database queries by hand, I describe what I want in plain TypeScript and Prisma handles the rest. Fewer bugs, faster development.",
    "GitHub Actions": "GitHub Actions automates repetitive tasks — running tests, checking for errors, and deploying code every time I push an update. It's like having a robot assistant that handles quality control 24/7.",
    "Nginx": "Nginx is a web server that handles incoming traffic. It decides where to send requests, serves files efficiently, and keeps everything running smoothly even when thousands of people visit at the same time.",
    "better-auth": "better-auth handles authentication the right way — sign-up, login, sessions, OAuth, all with a clean API. No wrestling with complex auth flows; it just works out of the box with TypeScript and any framework.",
    "Drizzle": "Drizzle is a lightweight TypeScript ORM that feels like writing SQL but with full type-safety. Fast, generates clean queries, and doesn't add unnecessary abstraction. Perfect when I need more control than Prisma.",
    "shadcn/ui": "shadcn/ui gives me beautifully designed, accessible components I copy directly into my project. No dependency lock-in — I own every line. Integrates perfectly with Tailwind and is my go-to for polished interfaces.",
};

const CATEGORIES = [
    { label: "Frontend", keys: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS", "shadcn/ui"] },
    { label: "Backend", keys: ["Node.js", "Python", "Java", "Rust", "better-auth", "Drizzle"] },
    { label: "Tools & Infra", keys: ["Docker", "Git", "VS Code", "Prisma", "PostgreSQL", "GitHub Actions", "Nginx"] },
];

export default function TechStack() {
    const { data: githubData } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=30`,
        fetcher
    );

    const [expandedTech, setExpandedTech] = useState<string | null>(null);

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
                    <div className="flex flex-col items-end gap-1">
                        {usedLanguages.size > 0 && (
                            <span className="text-xs font-mono text-white/25">
                                {usedLanguages.size} languages detected on GitHub
                            </span>
                        )}
                        <span className="text-[11px] font-mono text-white/15">
                            Click any tech to learn why I use it
                        </span>
                    </div>
                </div>

                {/* Categories */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
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
                                    const isExpanded = expandedTech === tech;
                                    return (
                                        <div key={tech}>
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: ci * 0.05 + ti * 0.04 }}
                                                onClick={() => setExpandedTech(isExpanded ? null : tech)}
                                                className={`group flex items-center justify-between w-full py-2.5 px-3 rounded-lg hover:bg-white/[0.05] transition-all duration-200 text-left ${isExpanded ? "bg-white/[0.05] border border-white/[0.08]" : ""}`}
                                            >
                                                <span className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/45"} ${isExpanded ? "text-indigo-300" : ""}`}>
                                                    {tech}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {isActive && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-80" />
                                                    )}
                                                    <motion.span
                                                        animate={{ rotate: isExpanded ? 45 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="text-white/20 text-xs font-mono"
                                                    >
                                                        +
                                                    </motion.span>
                                                </div>
                                            </motion.button>

                                            {/* Expandable explanation */}
                                            <AnimatePresence>
                                                {isExpanded && TECH_EXPLANATIONS[tech] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mx-3 mb-2 p-4 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/[0.12]">
                                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                                <span className="text-[11px] font-mono text-indigo-400/70 uppercase tracking-wider">
                                                                    Why I use {tech}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setExpandedTech(null); }}
                                                                    className="text-white/20 hover:text-white/50 transition-colors shrink-0"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                            <p className="text-[13px] text-white/50 leading-relaxed">
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
                    ))}
                </div>

                <p className="text-xs font-mono text-white/20 mt-4 text-right">
                    Purple dot = detected on GitHub activity
                </p>
            </div>
        </section>
    );
}
