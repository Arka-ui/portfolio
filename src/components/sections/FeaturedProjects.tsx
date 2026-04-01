"use client";

import { motion } from "framer-motion";
import { Github, ArrowUpRight, Star, GitFork } from "lucide-react";
import useSWR from "swr";
import { useCallback } from "react";
import ProjectCarousel from "@/components/features/ProjectCarousel";
import { useLanguage } from "@/context/LanguageContext";

function useSpotlight() {
    return useCallback((e: React.PointerEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--spotlight-x", `${x}%`);
        e.currentTarget.style.setProperty("--spotlight-y", `${y}%`);
    }, []);
}

const GITHUB_USERNAME = "Arka-ui";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

interface Project {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    topics: string[];
    html_url: string;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
}

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f0db4f", Python: "#3572a5",
    Java: "#b07219", Swift: "#f05138", Kotlin: "#7f52ff",
    Rust: "#dea584", Go: "#00add8", CSS: "#563d7c", HTML: "#e34c26",
};

const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    show: (i: number) => ({
        y: 0, opacity: 1,
        transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const color = project.language ? LANG_COLORS[project.language] : "#f59e0b";
    const spotlight = useSpotlight();
    const { t } = useLanguage();

    return (
        <motion.article
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            onPointerMove={spotlight}
            className="group bento-card p-6 md:p-8 flex flex-col gap-5 hover:border-amber-500/15 transition-all duration-500 card-spotlight"
        >
            {/* Top row: language dot + links */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {project.language && (
                        <span className="flex items-center gap-2 text-xs text-white/40 font-mono">
                            <span className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white/5" style={{ backgroundColor: color }} />
                            {project.language}
                        </span>
                    )}
                    <span className="text-[10px] font-mono text-white/15">#{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex gap-2">
                    <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-amber-500/20 transition-all text-white/40 hover:text-white"
                    >
                        <Github size={14} />
                    </a>
                    {project.homepage && (
                        <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-teal-500/20 transition-all text-white/40 hover:text-white"
                        >
                            <ArrowUpRight size={14} />
                        </a>
                    )}
                </div>
            </div>

            {/* Title + description */}
            <div className="flex-1">
                <h3 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight group-hover:text-gradient transition-all duration-300 mb-2">
                    {project.name}
                </h3>
                <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
                    {project.description || t("projects.default_desc")}
                </p>
            </div>

            {/* Bottom: topics + stats */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                <div className="flex gap-2">
                    {project.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10px] font-mono text-white/35">
                            {topic}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-white/20 font-mono">
                    <span className="flex items-center gap-1"><Star size={11} /> {project.stargazers_count}</span>
                    <span className="flex items-center gap-1"><GitFork size={11} /> {project.forks_count}</span>
                </div>
            </div>
        </motion.article>
    );
}

export default function FeaturedProjects() {
    const { t } = useLanguage();
    const { data: projects } = useSWR<Project[]>(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
        fetcher
    );

    const featured = projects && Array.isArray(projects)
        ? projects.filter(p => !p.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)
        : [];

    if (!featured.length) return null;

    return (
        <section id="projects" className="py-20 md:py-32 border-t border-white/[0.04]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
                    <div>
                        <span className="label-mono mb-4 block">{t("projects.label")}</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="font-heading font-black text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white"
                        >
                            {t("projects.featured_heading")}
                        </motion.h2>
                    </div>
                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-white/35 hover:text-amber-300 transition-colors shrink-0"
                    >
                        {t("projects.all_repos")}
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>

                {/* Mobile carousel */}
                <ProjectCarousel projects={featured} />

                {/* Desktop: 3-col card grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featured.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
