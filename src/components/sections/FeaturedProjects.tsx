"use client";

import { motion } from "framer-motion";
import { Github, ArrowUpRight, Star, GitFork, Pin } from "lucide-react";
import useSWR from "swr";
import ProjectCarousel from "@/components/features/ProjectCarousel";
import { useLanguage } from "@/context/LanguageContext";

const GITHUB_USERNAME = "Arka-ui";

// Projects pinned to the top, bypassing star-sort. Order here = display order.
const PINNED_REPOS = ["ArkaNewsSystem"];

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
    hidden: { y: 28, opacity: 0, scale: 0.94, filter: "blur(10px)" },
    show: (i: number) => ({
        y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
        transition: {
            duration: 1.05, delay: i * 0.09, ease: [0.2, 0.9, 0.25, 1.05] as const,
            filter: { duration: 0.75, delay: i * 0.09 },
        },
    }),
};

function ProjectCard({ project, index, pinned }: { project: Project; index: number; pinned?: boolean }) {
    const color = project.language ? LANG_COLORS[project.language] : "#DBC7A6";
    const { t } = useLanguage();

    return (
        <motion.article
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className={`group relative bento-card p-6 md:p-8 flex flex-col gap-5 transition-all duration-500 hover:-translate-y-0.5 ${
                pinned
                    ? "border-[#DBC7A6]/35 hover:border-[#DBC7A6]/55 shadow-[0_0_0_1px_rgba(219,199,166,0.08),0_24px_60px_-24px_rgba(219,199,166,0.18)]"
                    : "hover:border-[#B39F85]/35"
            }`}
        >
            {/* Bottom accent bar — slides in on hover, language-colored */}
            <span
                className="pointer-events-none absolute left-0 right-0 bottom-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                style={{ backgroundColor: color }}
                aria-hidden
            />
            {pinned && (
                <span
                    className="pointer-events-none absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(219,199,166,0.6) 50%, transparent 100%)" }}
                    aria-hidden
                />
            )}
            {/* Top row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {pinned ? (
                        <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#DBC7A6] px-2.5 py-1 rounded-full border border-[#DBC7A6]/30 bg-[#DBC7A6]/[0.05]">
                            <Pin size={10} className="rotate-45" />
                            {t("projects.pinned")}
                        </span>
                    ) : project.language && (
                        <span className="flex items-center gap-2 text-xs text-[#B39F85] font-mono">
                            <span className="w-3 h-3 rounded-full shrink-0 ring-2 ring-[#493B33]/40" style={{ backgroundColor: color }} />
                            {project.language}
                        </span>
                    )}
                    <span className="text-[10px] font-mono text-[#5F564D]">#{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex gap-2">
                    <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} on GitHub`}
                        className="p-2 rounded-lg bg-[#251E18]/60 border border-[#493B33]/50 hover:bg-[#251E18]/90 hover:border-[#B39F85]/35 transition-all text-[#7D6B56] hover:text-[#DBC7A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBC7A6]/50"
                    >
                        <Github size={14} />
                    </a>
                    {project.homepage && (
                        <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.name} live site`}
                            className="p-2 rounded-lg bg-[#251E18]/60 border border-[#493B33]/50 hover:bg-[#251E18]/90 hover:border-[#B39F85]/35 transition-all text-[#7D6B56] hover:text-[#DBC7A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBC7A6]/50"
                        >
                            <ArrowUpRight size={14} />
                        </a>
                    )}
                </div>
            </div>

            {/* Title + description */}
            <div className="flex-1">
                <h3 className={`font-display font-bold text-xl md:text-2xl tracking-tight transition-colors duration-300 mb-2 ${
                    pinned ? "text-grad-warm" : "text-[#DBC7A6] group-hover:text-[#B39F85]"
                }`}>
                    {project.name}
                </h3>
                <p className="text-sm text-[#B39F85] line-clamp-2 leading-relaxed">
                    {project.description || t("projects.default_desc")}
                </p>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between pt-4 border-t border-[#493B33]/40">
                <div className="flex gap-2 flex-wrap">
                    {project.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="px-2.5 py-1 rounded-lg bg-[#251E18]/60 border border-[#493B33]/40 text-[10px] font-mono text-[#B39F85]">
                            {topic}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#7D6B56] font-mono shrink-0">
                    {pinned && project.language && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            {project.language}
                        </span>
                    )}
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

    const featured = (() => {
        if (!projects || !Array.isArray(projects)) return [] as Project[];
        const nonForks = projects.filter(p => !p.fork);
        const pinned: Project[] = [];
        for (const name of PINNED_REPOS) {
            const match = nonForks.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (match) pinned.push(match);
        }
        const rest = nonForks
            .filter(p => !pinned.some(pin => pin.id === p.id))
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
        const slotCount = Math.max(6, pinned.length);
        return [...pinned, ...rest].slice(0, slotCount);
    })();

    if (!featured.length) return null;

    const pinnedCount = featured.filter(p => PINNED_REPOS.some(n => n.toLowerCase() === p.name.toLowerCase())).length;

    return (
        <section id="projects" className="py-24 md:py-36 border-t border-[#493B33]/25 md:pl-[72px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 md:mb-20">
                    <div>
                        <span className="label-display mb-4 block">{t("projects.label")}</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display font-bold text-[clamp(40px,5.5vw,76px)] leading-[0.88] tracking-tighter text-[#DBC7A6]"
                        >
                            {t("projects.featured_heading")}
                        </motion.h2>
                    </div>
                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-[#B39F85] hover:text-[#DBC7A6] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBC7A6]/50 rounded-md px-1"
                    >
                        {t("projects.all_repos")}
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>

                {/* Mobile carousel */}
                <ProjectCarousel projects={featured} pinnedCount={pinnedCount} />

                {/* Desktop grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featured.map((project, i) => {
                        const isPinned = PINNED_REPOS.some(n => n.toLowerCase() === project.name.toLowerCase());
                        return (
                            <ProjectCard key={project.id} project={project} index={i} pinned={isPinned} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
