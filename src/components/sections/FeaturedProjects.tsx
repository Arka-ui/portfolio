"use client";

import { motion } from "framer-motion";
import { Github, ArrowUpRight, Star, GitFork } from "lucide-react";
import useSWR from "swr";
import ProjectCarousel from "@/components/features/ProjectCarousel";

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
    TypeScript: "#3178c6",
    JavaScript: "#f0db4f",
    Python: "#3572a5",
    Java: "#b07219",
    Swift: "#f05138",
    Kotlin: "#7f52ff",
    Rust: "#dea584",
    Go: "#00add8",
    CSS: "#563d7c",
    HTML: "#e34c26",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const num = String(index + 1).padStart(2, "0");
    const color = project.language ? LANG_COLORS[project.language] : "#6366f1";

    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border-t border-white/[0.07] pt-8 pb-8 flex flex-col gap-5 hover:border-white/20 transition-colors duration-300"
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-5 flex-1 min-w-0">
                    <span className="font-mono text-[11px] text-white/20 pt-1 shrink-0">{num}</span>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight group-hover:text-indigo-300 transition-colors duration-300 truncate">
                            {project.name}
                        </h3>
                        <p className="text-sm text-white/45 mt-2 line-clamp-2 leading-relaxed">
                            {project.description || "A project built with modern technologies."}
                        </p>
                    </div>
                </div>

                {/* Links */}
                <div className="flex gap-2 shrink-0">
                    <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/10 hover:border-white/15 transition-all text-white/50 hover:text-white"
                    >
                        <Github size={15} />
                    </a>
                    {project.homepage && (
                        <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/10 hover:border-white/15 transition-all text-white/50 hover:text-white"
                        >
                            <ArrowUpRight size={15} />
                        </a>
                    )}
                </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center gap-4 ml-9">
                {project.language && (
                    <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                        />
                        {project.language}
                    </span>
                )}
                {project.topics.slice(0, 2).map(t => (
                    <span key={t} className="badge-muted text-[11px]">{t}</span>
                ))}
                <div className="ml-auto flex items-center gap-3 text-[11px] text-white/25 font-mono">
                    <span className="flex items-center gap-1">
                        <Star size={11} /> {project.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                        <GitFork size={11} /> {project.forks_count}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}

export default function FeaturedProjects() {
    const { data: projects } = useSWR<Project[]>(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
        fetcher
    );

    const featured = projects && Array.isArray(projects)
        ? projects
            .filter(p => !p.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6)
        : [];

    if (!featured.length) {
        // Show skeleton cards while GitHub data loads
        return (
            <section id="projects" className="py-28 border-t border-white/[0.06]">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="mb-16">
                        <span className="label-mono mb-5 block">Work</span>
                        <div className="h-16 w-72 bg-white/[0.04] rounded-xl animate-pulse" />
                    </div>
                    <div className="hidden md:grid md:grid-cols-2 gap-x-16">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="border-t border-white/[0.07] pt-8 pb-8 space-y-3">
                                <div className="h-6 w-48 bg-white/[0.04] rounded animate-pulse" />
                                <div className="h-4 w-full bg-white/[0.03] rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-white/[0.03] rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">

                {/* Section header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="label-mono mb-5 block">Work</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="font-heading font-black text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white"
                        >
                            Featured projects
                        </motion.h2>
                    </div>
                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors shrink-0"
                    >
                        All repositories
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>

                {/* Mobile: carousel */}
                <ProjectCarousel projects={featured} />

                {/* Desktop: numbered list grid */}
                <div className="hidden md:grid md:grid-cols-2 gap-x-16">
                    {featured.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
