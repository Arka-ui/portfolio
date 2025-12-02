"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Star, ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";
import { useState, useEffect } from "react";

const GITHUB_USERNAME = "Arka-ui";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

function ProjectCard({ project, isActive }: { project: any; isActive: boolean }) {
    return (
        <div
            className={`
                relative w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden
                transition-all duration-500 ease-out
                ${isActive ? 'shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] border-primary/30 scale-100 opacity-100' : 'scale-90 opacity-40 grayscale-[50%]'}
            `}
        >
            {/* Holographic Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : ''}`} />

            <div className="flex flex-col h-full p-6 md:p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        <Github className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold">{project.stargazers_count}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white tracking-tight">
                        {project.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 text-sm md:text-base leading-relaxed">
                        {project.description || "A cutting-edge project built with modern web technologies. Focused on performance, accessibility, and user experience."}
                    </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.language && (
                        <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/20 rounded-full">
                            {project.language}
                        </span>
                    )}
                    {project.topics?.slice(0, 2).map((topic: string) => (
                        <span key={topic} className="px-3 py-1 text-xs font-medium bg-white/5 text-muted-foreground border border-white/10 rounded-full">
                            {topic}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                    <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        <Github size={18} />
                        Code
                    </a>
                    {project.homepage && (
                        <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/10"
                        >
                            <ExternalLink size={18} />
                            Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function FeaturedProjects() {
    const { data, error } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
        fetcher
    );

    const [activeIndex, setActiveIndex] = useState(0);

    const projects = Array.isArray(data)
        ? data
            .filter((repo: any) => repo.topics?.includes("featured"))
            .slice(0, 5) // Limit to 5 for better carousel performance
        : [];

    const displayProjects = projects.length > 0
        ? projects
        : (Array.isArray(data) ? data.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 5) : []);

    const nextProject = () => {
        setActiveIndex((prev) => (prev + 1) % displayProjects.length);
    };

    const prevProject = () => {
        setActiveIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
    };

    if (error) return null;
    if (displayProjects.length === 0) return null;

    return (
        <section className="py-32 relative overflow-hidden" id="featured">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tight">
                        Featured Work
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore a curated selection of my most ambitious projects.
                    </p>
                </motion.div>

                <div className="relative h-[500px] w-full max-w-5xl mx-auto perspective-1000">
                    <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
                        <AnimatePresence mode="popLayout">
                            {displayProjects.map((project: any, index: number) => {
                                // Calculate offset from active index
                                let offset = index - activeIndex;
                                // Handle wrap-around for infinite feel logic (visual only here)
                                if (offset < -2) offset += displayProjects.length;
                                if (offset > 2) offset -= displayProjects.length;

                                // Only render visible cards (active + 2 neighbors)
                                if (Math.abs(offset) > 2) return null;

                                return (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, z: -100 }}
                                        animate={{
                                            opacity: offset === 0 ? 1 : 0.4,
                                            scale: offset === 0 ? 1 : 0.8,
                                            z: offset === 0 ? 100 : -100,
                                            x: `${offset * 60}%`,
                                            rotateY: offset * -25,
                                            zIndex: 10 - Math.abs(offset)
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, z: -100 }}
                                        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
                                        className="absolute w-[350px] md:w-[450px] h-[500px] origin-center cursor-grab active:cursor-grabbing"
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = offset.x;

                                            if (swipe < -50 || velocity.x < -500) {
                                                nextProject();
                                            } else if (swipe > 50 || velocity.x > 500) {
                                                prevProject();
                                            }
                                        }}
                                    >
                                        <ProjectCard project={project} isActive={offset === 0} />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-12 z-50">
                        <button
                            onClick={prevProject}
                            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 transition-all backdrop-blur-md"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-12 z-50">
                        <button
                            onClick={nextProject}
                            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 transition-all backdrop-blur-md"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Pagination Indicators */}
                <div className="flex justify-center gap-3 mt-12">
                    {displayProjects.map((_: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
