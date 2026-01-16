"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Github, ExternalLink, Star, GitFork, ArrowUpRight } from "lucide-react";
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const { triggerHaptic } = useHaptics();

    // Limit to top 5 projects
    const visibleProjects = projects.slice(0, 5);
    const activeProject = visibleProjects[currentIndex];

    // Drag constraints
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

    const handleDragEnd = (e: any, { offset, velocity }: any) => {
        const swipeThreshold = 50;
        if (offset.x > swipeThreshold) {
            // Swipe Right (Previous)
            triggerHaptic("medium");
            setCurrentIndex((prev) => (prev - 1 + visibleProjects.length) % visibleProjects.length);
        } else if (offset.x < -swipeThreshold) {
            // Swipe Left (Next)
            triggerHaptic("medium");
            setCurrentIndex((prev) => (prev + 1) % visibleProjects.length);
        }
    };

    return (
        <div className="relative w-full h-[450px] flex items-center justify-center md:hidden perspective-[1000px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl opacity-30" />

            <div className="relative w-full max-w-sm px-8">
                <AnimatePresence mode="popLayout" custom={x.get()}>
                    <motion.div
                        key={activeProject.id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.05}
                        onDragEnd={handleDragEnd}
                        style={{ x, rotate, opacity }}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0, zIndex: 10 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20, zIndex: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl will-change-transform"
                    >
                        {/* Card Header Image/Gradient */}
                        <div className="h-32 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute top-4 right-4 flex gap-3">
                                <a
                                    href={activeProject.html_url}
                                    target="_blank"
                                    rel="noopener"
                                    className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10"
                                >
                                    <Github size={18} />
                                </a>
                                {activeProject.homepage && (
                                    <a
                                        href={activeProject.homepage}
                                        target="_blank"
                                        rel="noopener"
                                        className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10"
                                    >
                                        <ArrowUpRight size={18} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono text-cyan-400 px-2 py-1 rounded bg-cyan-950/30 border border-cyan-500/20">
                                    {activeProject.language || "Code"}
                                </span>
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                    <span className="flex items-center gap-1">
                                        <Star size={12} /> {activeProject.stargazers_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <GitFork size={12} /> {activeProject.forks_count}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                {activeProject.name}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                {activeProject.description || "Experimental project."}
                            </p>

                            {/* Topics */}
                            <div className="flex flex-wrap gap-2">
                                {activeProject.topics.slice(0, 3).map(topic => (
                                    <span key={topic} className="px-2 py-1 text-[10px] rounded-md bg-white/5 text-slate-300 border border-white/5">
                                        #{topic}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer / Swipe Hint */}
                        <div className="px-6 pb-6 pt-2 flex justify-center">
                            <div className="w-16 h-1 bg-white/10 rounded-full" />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {visibleProjects.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                i === currentIndex ? "bg-indigo-500 w-6" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
