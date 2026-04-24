"use client";

import { useRef, useState, useEffect } from "react";
import { Github, ArrowUpRight, Star, GitFork, Pin } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

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
}

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f0db4f",
    Python: "#3572a5",
    Rust: "#dea584",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Go: "#00ADD8",
    Shell: "#89e051",
};

export default function ProjectCarousel({ projects, pinnedCount = 0 }: { projects: Project[]; pinnedCount?: number }) {
    const visibleProjects = projects.slice(0, 5);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { triggerHaptic } = useHaptics();
    const { t } = useLanguage();

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const cards = Array.from(container.querySelectorAll("[data-card]"));
        if (!cards.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) {
                    const i = cards.indexOf(visible.target);
                    if (i !== -1 && i !== activeIndex) {
                        setActiveIndex(i);
                        triggerHaptic("light");
                    }
                }
            },
            { root: container, threshold: 0.6 }
        );

        cards.forEach(c => observer.observe(c));
        return () => observer.disconnect();
    }, [visibleProjects.length]);

    return (
        <div className="relative w-full md:hidden">
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 px-1"
                style={{
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {visibleProjects.map((project, idx) => {
                    const langColor = LANG_COLORS[project.language || ""] || "#DBC7A6";
                    const pinned = idx < pinnedCount;

                    return (
                        <div
                            key={project.id}
                            data-card
                            className={cn(
                                "shrink-0 w-[calc(100%-2rem)] rounded-2xl overflow-hidden bg-[#1B1814]/80 shadow-xl",
                                pinned
                                    ? "border border-[#DBC7A6]/35 shadow-[0_0_0_1px_rgba(219,199,166,0.08),0_24px_60px_-24px_rgba(219,199,166,0.18)]"
                                    : "border border-[#493B33]/50"
                            )}
                            style={{ scrollSnapAlign: "center" }}
                        >
                            {/* Card header gradient */}
                            <div className="h-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${langColor}20 0%, rgba(179,159,133,0.08) 50%, transparent 100%)` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#13110E]/85 to-transparent" />
                                {pinned && (
                                    <span
                                        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
                                        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(219,199,166,0.6) 50%, transparent 100%)" }}
                                        aria-hidden
                                    />
                                )}
                                {pinned && (
                                    <span className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-[#DBC7A6] px-2.5 py-1 rounded-full border border-[#DBC7A6]/30 bg-[#DBC7A6]/[0.05] backdrop-blur-md">
                                        <Pin size={10} className="rotate-45" />
                                        {t("projects.pinned")}
                                    </span>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <a
                                        href={project.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-[#13110E]/60 backdrop-blur-md text-[#B39F85] border border-[#493B33]/50 hover:text-[#DBC7A6] transition-colors"
                                    >
                                        <Github size={16} />
                                    </a>
                                    {project.homepage && (
                                        <a
                                            href={project.homepage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-[#13110E]/60 backdrop-blur-md text-[#B39F85] border border-[#493B33]/50 hover:text-[#DBC7A6] transition-colors"
                                        >
                                            <ArrowUpRight size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className="text-xs font-mono px-2 py-1 rounded-lg border"
                                        style={{
                                            color: "#DBC7A6",
                                            borderColor: `${langColor}55`,
                                            backgroundColor: `${langColor}1A`,
                                        }}
                                    >
                                        {project.language || "Code"}
                                    </span>
                                    <div className="flex items-center gap-3 text-[#7D6B56] text-xs">
                                        <span className="flex items-center gap-1">
                                            <Star size={11} /> {project.stargazers_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitFork size={11} /> {project.forks_count}
                                        </span>
                                    </div>
                                </div>

                                <h3 className={cn(
                                    "font-display text-xl font-bold mb-1.5 leading-tight tracking-tight",
                                    pinned ? "text-grad-warm" : "text-[#DBC7A6]"
                                )}>
                                    {project.name}
                                </h3>
                                <p className="text-[#B39F85] text-sm leading-relaxed mb-4 line-clamp-3">
                                    {project.description || "Experimental project."}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {project.topics.slice(0, 3).map(topic => (
                                        <span
                                            key={topic}
                                            className="px-2 py-1 text-[10px] rounded-lg bg-[#251E18]/70 text-[#B39F85] border border-[#493B33]/40"
                                        >
                                            #{topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Drag hint bar */}
                            <div className="pb-5 flex justify-center">
                                <div className="w-12 h-1 bg-[#493B33]/55 rounded-full" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-3">
                {visibleProjects.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            i === activeIndex ? "w-6 bg-[#DBC7A6]" : "w-1.5 bg-[#493B33]/70"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
