"use client";

import { useRef, useState, useEffect } from "react";
import { Github, ArrowUpRight, Star, GitFork } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
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

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
    const visibleProjects = projects.slice(0, 5);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { triggerHaptic } = useHaptics();

    // Track the active snap item via IntersectionObserver on the cards
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
            {/* Native CSS scroll snap — no JS drag needed on mobile */}
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
                {visibleProjects.map((project, i) => (
                    <div
                        key={project.id}
                        data-card
                        className="shrink-0 w-[calc(100%-2rem)] rounded-3xl overflow-hidden border border-white/10 bg-slate-900/90 backdrop-blur-md shadow-xl"
                        style={{ scrollSnapAlign: "center" }}
                    >
                        {/* Card header gradient */}
                        <div className="h-28 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <a
                                    href={project.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10"
                                >
                                    <Github size={16} />
                                </a>
                                {project.homepage && (
                                    <a
                                        href={project.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10"
                                    >
                                        <ArrowUpRight size={16} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono text-cyan-400 px-2 py-1 rounded bg-cyan-950/30 border border-cyan-500/20">
                                    {project.language || "Code"}
                                </span>
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                    <span className="flex items-center gap-1">
                                        <Star size={11} /> {project.stargazers_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <GitFork size={11} /> {project.forks_count}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1.5 leading-tight">
                                {project.name}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                {project.description || "Experimental project."}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {project.topics.slice(0, 3).map(topic => (
                                    <span
                                        key={topic}
                                        className="px-2 py-1 text-[10px] rounded-md bg-white/5 text-slate-300 border border-white/5"
                                    >
                                        #{topic}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Drag hint bar */}
                        <div className="pb-5 flex justify-center">
                            <div className="w-12 h-1 bg-white/10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-3">
                {visibleProjects.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            i === activeIndex ? "w-6 bg-indigo-500" : "w-1.5 bg-white/15"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
