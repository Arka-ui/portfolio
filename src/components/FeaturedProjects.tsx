"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star, GitFork, ArrowUpRight } from "lucide-react";
import useSWR from "swr";
import { useBlueprint } from "@/context/BlueprintContext";
import BlueprintWrapper from "@/components/BlueprintWrapper";

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

const BentoCard = ({ project, className = "" }: { project: Project; className?: string }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`group relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md p-6 lg:p-8 flex flex-col justify-between ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 text-indigo-400">
                        <Github size={20} />
                    </div>
                    <div className="flex gap-2">
                        {project.homepage && (
                            <a
                                href={project.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors text-white"
                            >
                                <ArrowUpRight size={18} />
                            </a>
                        )}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {project.name}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                    {project.description || "A remarkable project built with modern web technologies."}
                </p>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.language && (
                        <span className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
                            {project.language}
                        </span>
                    )}
                    {project.topics.slice(0, 2).map(topic => (
                        <span key={topic} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-white/5">
                            {topic}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-xs font-mono border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                        <Star size={12} /> {project.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <GitFork size={12} /> {project.forks_count}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default function FeaturedProjects() {
    const { data: projects } = useSWR<Project[]>(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
        fetcher
    );

    const { isBlueprintMode } = useBlueprint();

    // Filter and sort
    const featured = projects && Array.isArray(projects)
        ? projects
            .filter(p => !p.fork) // Don't show forks usually
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5) // Take top 5 for the bento grid
        : [];

    if (!featured.length) return null;

    return (
        <section id="projects" className="relative py-32 bg-slate-950 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-900/50 to-transparent" />

            <div className="container mx-auto px-4">
                <BlueprintWrapper label="SECTION_PROJECTS" description="Featured Works Display" direction="left">
                    <div className="mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-bold font-heading text-white tracking-tighter mb-6"
                        >
                            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Works</span>
                        </motion.h2>
                        <p className="text-xl text-slate-400 max-w-2xl">
                            A showcase of technical excellence and creative problem solving.
                        </p>
                    </div>
                </BlueprintWrapper>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                    {/* Large Featured Card (First item) */}
                    {featured[0] && (
                        <div className="md:col-span-2 md:row-span-1">
                            <BentoCard project={featured[0]} className="h-full bg-gradient-to-br from-indigo-900/20 to-slate-900/50" />
                        </div>
                    )}

                    {/* Side Cards */}
                    {featured[1] && <BentoCard project={featured[1]} />}
                    {featured[2] && <BentoCard project={featured[2]} />}

                    {/* Bottom Wide Card */}
                    {featured[3] && (
                        <div className="md:col-span-2">
                            <BentoCard project={featured[3]} />
                        </div>
                    )}
                    {featured[4] && <BentoCard project={featured[4]} />}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    >
                        View all repositories <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}
