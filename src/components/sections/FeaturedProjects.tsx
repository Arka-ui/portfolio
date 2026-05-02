"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Star, GitFork, ArrowUpRight } from "lucide-react";
import useSWR from "swr";
import { useLanguage } from "@/context/LanguageContext";

const GITHUB_USERNAME = "Arka-ui";
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
    pushed_at: string;
}

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f0db4f", Python: "#3572a5",
    Java: "#b07219", Swift: "#f05138", Kotlin: "#7f52ff",
    Rust: "#dea584", Go: "#00add8", CSS: "#563d7c", HTML: "#e34c26",
};

function LedgerRow({ project, index, pinned }: { project: Project; index: number; pinned: boolean }) {
    const [open, setOpen] = useState(false);
    const langColor = project.language ? LANG_COLORS[project.language] : "#7D6B56";
    const num = String(index + 1).padStart(2, "0");
    const year = project.pushed_at ? new Date(project.pushed_at).getFullYear() : "—";
    const { t } = useLanguage();

    return (
        <article
            className={`ledger-row group block py-5 md:py-6 ${pinned ? "border-y border-[#DBC7A6]/30 bg-[#DBC7A6]/[0.015]" : ""}`}
            onClick={() => setOpen(o => !o)}
        >
            <button
                type="button"
                className="block w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DBC7A6]/40"
                aria-expanded={open}
                onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
            >
                {/* Mobile */}
                <div className="md:hidden">
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-mono text-[10px] text-[#7D6B56] tabular-nums w-7">
                            {pinned ? "☞" : num}
                        </span>
                        <h3 className={`font-display font-medium text-[18px] tracking-tight leading-tight ${pinned ? "text-[#DBC7A6]" : "text-[#DBC7A6]"}`}>
                            {project.name}
                        </h3>
                    </div>
                    <div className="ml-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#7D6B56]">
                        {project.language && (
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: langColor }} />
                                {project.language}
                            </span>
                        )}
                        <span className="text-[#5F564D]">·</span>
                        <span>★ {project.stargazers_count}</span>
                        <span className="text-[#5F564D]">·</span>
                        <span>{year}</span>
                    </div>
                </div>

                {/* Desktop ledger row */}
                <div className="hidden md:grid md:grid-cols-[40px_minmax(220px,1.4fr)_140px_60px_60px_minmax(160px,1fr)_36px] gap-6 items-baseline">
                    <span className="font-mono text-[11px] text-[#7D6B56] tabular-nums">
                        {pinned ? <span className="text-[#DBC7A6]">☞</span> : num}
                    </span>
                    <h3 className={`font-display font-medium text-[18px] lg:text-[20px] tracking-tight leading-tight ${pinned ? "text-[#DBC7A6]" : "text-[#DBC7A6] group-hover:text-[#B39F85]"} transition-colors duration-300`}>
                        {project.name}
                        {pinned && <span className="ml-2 atlas-folio-strong align-middle">{t("projects.pinned")}</span>}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7D6B56] inline-flex items-center gap-2">
                        {project.language ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                                {project.language}
                            </>
                        ) : <span className="text-[#5F564D]">—</span>}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#7D6B56] inline-flex items-center gap-1">
                        <Star size={10} /> {project.stargazers_count}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#7D6B56] inline-flex items-center gap-1">
                        <GitFork size={10} /> {project.forks_count}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7D6B56] truncate">
                        {project.topics.slice(0, 3).join(" · ") || (year ? `pushed ${year}` : "—")}
                    </span>
                    <span className="font-mono text-[12px] text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors text-right">
                        {open ? "−" : "+"}
                    </span>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="md:pl-[64px] pt-4 pb-2 grid md:grid-cols-[1fr_auto] gap-6 items-end">
                            <p className="text-[14px] md:text-[15px] text-[#B39F85] leading-[1.65] max-w-[60ch]">
                                {project.description || t("projects.default_desc")}
                            </p>
                            <div className="flex items-center gap-5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                <a
                                    href={project.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="atlas-link text-[#B39F85] text-[12px] font-mono uppercase tracking-[0.2em]"
                                >
                                    Source <ArrowUpRight size={11} />
                                </a>
                                {project.homepage && (
                                    <a
                                        href={project.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="atlas-link text-[#DBC7A6] text-[12px] font-mono uppercase tracking-[0.2em]"
                                    >
                                        Live <ArrowUpRight size={11} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
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
        const slotCount = Math.max(8, pinned.length);
        return [...pinned, ...rest].slice(0, slotCount);
    })();

    if (!featured.length) return null;

    return (
        <section id="projects" className="py-24 md:py-32 border-t border-[#493B33]/35 md:pl-[88px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Folio head */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <span className="atlas-folio">§ 04 · {t("projects.label")}</span>
                    <span aria-hidden className="flex-1 atlas-rule" />
                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="atlas-folio hover:text-[#DBC7A6] transition-colors inline-flex items-center gap-1.5"
                    >
                        {t("projects.all_repos")} ↗
                    </a>
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
                    {t("projects.featured_heading")}
                </motion.h2>

                {/* Ledger header (desktop only) */}
                <div className="hidden md:grid md:grid-cols-[40px_minmax(220px,1.4fr)_140px_60px_60px_minmax(160px,1fr)_36px] gap-6 atlas-folio pb-3">
                    <span>№</span>
                    <span>Title</span>
                    <span>Language</span>
                    <span>Stars</span>
                    <span>Forks</span>
                    <span>Topics / Year</span>
                    <span className="text-right">±</span>
                </div>

                {/* Top rule */}
                <div className="atlas-rule-strong mb-1" aria-hidden />

                {/* Rows */}
                <div className="divide-y divide-[#493B33]/35">
                    {featured.map((project, i) => {
                        const isPinned = PINNED_REPOS.some(n => n.toLowerCase() === project.name.toLowerCase());
                        return (
                            <LedgerRow key={project.id} project={project} index={i} pinned={isPinned} />
                        );
                    })}
                </div>

                {/* Bottom rule + total */}
                <div className="atlas-rule-strong mt-1" aria-hidden />
                <p className="mt-6 atlas-folio">
                    {featured.length} entries · sorted by stars · pinned: {PINNED_REPOS.join(", ")}
                </p>
            </div>
        </section>
    );
}
