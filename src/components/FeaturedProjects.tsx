"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useAnimation } from "framer-motion";
import { ExternalLink, Github, Star, ChevronLeft, ChevronRight, Layers, Zap, Globe, Code, Database, Layout } from "lucide-react";
import useSWR from "swr";
import { useState, useEffect, useRef } from "react";
import { useBlueprint } from "@/context/BlueprintContext";

const GITHUB_USERNAME = "Arka-ui";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

// Helper to get color based on language/topic
const getProjectColor = (language: string) => {
    const colors: Record<string, string> = {
        TypeScript: "from-blue-500 to-cyan-400",
        JavaScript: "from-yellow-400 to-orange-500",
        Python: "from-green-400 to-emerald-600",
        Rust: "from-orange-600 to-red-600",
        Go: "from-cyan-500 to-blue-600",
        HTML: "from-orange-500 to-red-500",
        CSS: "from-blue-400 to-indigo-500",
        default: "from-violet-500 to-purple-600"
    };
    return colors[language] || colors.default;
};

const getShadowColor = (language: string) => {
    const colors: Record<string, string> = {
        TypeScript: "rgba(59, 130, 246, 0.5)",
        JavaScript: "rgba(234, 179, 8, 0.5)",
        Python: "rgba(16, 185, 129, 0.5)",
        Rust: "rgba(234, 88, 12, 0.5)",
        Go: "rgba(6, 182, 212, 0.5)",
        default: "rgba(139, 92, 246, 0.5)"
    };
    return colors[language] || colors.default;
};

import BlueprintWrapper from "@/components/BlueprintWrapper";

// ... (imports)

function ProjectCard({ project, isActive, index }: { project: any; isActive: boolean; index: number }) {
    const gradient = getProjectColor(project.language);
    const shadowColor = getShadowColor(project.language);
    const { isBlueprintMode } = useBlueprint();

    if (isBlueprintMode) {
        return (
            <BlueprintWrapper label="MODULE_CARD" description="Project Component Unit" direction="left" className="h-full">
                <div className="relative w-full h-full p-6 border-2 border-dashed border-white/30 bg-blue-900/20 font-mono hover:bg-blue-900/30 transition-colors">

                    <div className="flex justify-between items-start mb-4 border-b border-white/20 pb-4">
                        <BlueprintWrapper label="UID" description="Unique Identifier" direction="top">
                            <div className="flex items-center gap-2">
                                <Code size={16} className="text-yellow-400" />
                                <span className="text-sm">ID: {project.id}</span>
                            </div>
                        </BlueprintWrapper>
                        <div className="text-xs opacity-70">Rendered: {new Date().toLocaleTimeString()}</div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-blue-300 block mb-1">// Project Name</span>
                            <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        </div>

                        <div>
                            <span className="text-xs text-blue-300 block mb-1">// Description Data</span>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {project.description || "No description provided in API response."}
                            </p>
                        </div>

                        <BlueprintWrapper label="DEPENDENCIES" description="Tech Stack Array" direction="right">
                            <div>
                                <span className="text-xs text-blue-300 block mb-1">// Tech Stack Array</span>
                                <div className="flex flex-wrap gap-2">
                                    {project.language && (
                                        <span className="px-2 py-1 text-xs border border-white/30">
                                            "{project.language}"
                                        </span>
                                    )}
                                    {project.topics?.slice(0, 3).map((topic: string) => (
                                        <span key={topic} className="px-2 py-1 text-xs border border-white/30">
                                            "{topic}"
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </BlueprintWrapper>

                        <div className="pt-4 border-t border-white/20">
                            <span className="text-xs text-blue-300 block mb-2">// Action Handlers</span>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-white/10 text-xs">[Link: GitHub]</div>
                                {project.homepage && <div className="px-3 py-1 bg-white/10 text-xs">[Link: Demo]</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </BlueprintWrapper>
        );
    }

    return (
        <div className="relative w-full h-full perspective-1000">
            <motion.div
                className={`
                    relative w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden
                    transition-all duration-700 ease-out transform-style-3d
                    ${isActive ? 'shadow-2xl scale-100 opacity-100' : 'scale-90 opacity-40 grayscale-[50%]'}
                `}
                style={{
                    boxShadow: isActive ? `0 0 100px -20px ${shadowColor}` : 'none'
                }}
                animate={{
                    rotateX: isActive ? 0 : 5,
                }}
            >
                {/* Dynamic Ambient Glow (Internal) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 mix-blend-overlay transition-opacity duration-500`} />

                {/* Holographic Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : ''} z-20 pointer-events-none`} />

                <div className="flex flex-col h-full p-6 md:p-8 relative z-10 transform-style-3d">
                    {/* Header Layer - Parallax Depth 20px */}
                    <div className="flex justify-between items-start mb-6 transform-style-3d translate-z-20">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                            <Github className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 backdrop-blur-md shadow-lg">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-bold">{project.stargazers_count}</span>
                        </div>
                    </div>

                    {/* Content Layer - Parallax Depth 30px */}
                    <div className="flex-1 transform-style-3d translate-z-30">
                        <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight drop-shadow-lg">
                            {project.name}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 text-sm md:text-base leading-relaxed font-light">
                            {project.description || "A cutting-edge project built with modern web technologies. Focused on performance, accessibility, and user experience."}
                        </p>
                    </div>

                    {/* Tech Stack Layer - Parallax Depth 40px */}
                    <div className="flex flex-wrap gap-2 mb-8 transform-style-3d translate-z-40">
                        {project.language && (
                            <span className={`px-3 py-1 text-xs font-bold bg-gradient-to-r ${gradient} text-white rounded-full shadow-lg`}>
                                {project.language}
                            </span>
                        )}
                        {project.topics?.slice(0, 2).map((topic: string) => (
                            <span key={topic} className="px-3 py-1 text-xs font-medium bg-white/5 text-gray-300 border border-white/10 rounded-full backdrop-blur-sm">
                                {topic}
                            </span>
                        ))}
                    </div>

                    {/* Actions Layer - Parallax Depth 50px */}
                    <div className="flex gap-3 mt-auto transform-style-3d translate-z-50">
                        <a
                            href={project.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <Github size={18} />
                            Code
                        </a>
                        {project.homepage && (
                            <a
                                href={project.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-md shadow-xl"
                            >
                                <Globe size={18} />
                                Demo
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Realistic Reflection */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 1 }}
                    className="absolute -bottom-[20px] left-0 right-0 h-full transform-style-3d origin-bottom pointer-events-none"
                    style={{
                        transform: 'rotateX(180deg) scaleY(0.5) translateZ(-1px)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), transparent 60%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), transparent 60%)'
                    }}
                >
                    <div className={`w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden grayscale-[30%] blur-[2px]`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default function FeaturedProjects() {
    const { data, error } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
        fetcher
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const { isBlueprintMode } = useBlueprint();

    const projects = Array.isArray(data)
        ? data
            .filter((repo: any) => repo.topics?.includes("featured"))
            .slice(0, 7) // Increased limit for better carousel feel
        : [];

    const displayProjects = projects.length > 0
        ? projects
        : (Array.isArray(data) ? data.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 7) : []);

    const nextProject = () => {
        setActiveIndex((prev) => (prev + 1) % displayProjects.length);
    };

    const prevProject = () => {
        setActiveIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
    };

    // Auto-rotation logic
    useEffect(() => {
        if (!isAutoPlaying || isBlueprintMode) return;
        const interval = setInterval(nextProject, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, displayProjects.length, isBlueprintMode]);

    if (error) return null;
    if (displayProjects.length === 0) return null;

    if (isBlueprintMode) {
        return (
            <section className="py-32 relative min-h-screen bg-[#0044cc]" id="featured">
                <div className="container mx-auto px-4">
                    <div className="mb-12 border-b-2 border-dashed border-white/30 pb-4">
                        <h2 className="text-4xl font-mono font-bold text-white mb-2">&lt;SECTION: FEATURED_PROJECTS /&gt;</h2>
                        <p className="text-yellow-300 font-mono text-sm">// This section dynamically fetches data from GitHub API and renders it.</p>
                        <p className="text-yellow-300 font-mono text-sm">// In standard mode, this uses a 3D carousel. Here, we see the raw grid structure.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayProjects.map((project: any, index: number) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="h-[400px]"
                            >
                                <ProjectCard project={project} isActive={true} index={index} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-32 relative overflow-hidden min-h-screen flex flex-col justify-center" id="featured">
            {/* Dynamic Ambient Background */}
            <div className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-in-out">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] blur-[150px] rounded-full opacity-20 transition-all duration-1000"
                    style={{
                        background: `conic-gradient(from 0deg, ${getShadowColor(displayProjects[activeIndex]?.language || 'default')}, transparent, ${getShadowColor(displayProjects[activeIndex]?.language || 'default')})`
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <Zap size={16} className="text-yellow-400" />
                        <span className="text-sm font-medium text-white/80">Interactive 3D Experience</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40 tracking-tighter">
                        Featured Work
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Swipe to explore a curated selection of my most ambitious projects.
                    </p>
                </motion.div>

                <div
                    className="relative h-[600px] w-full max-w-6xl mx-auto perspective-1000"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
                        <AnimatePresence mode="popLayout">
                            {displayProjects.map((project: any, index: number) => {
                                // Calculate offset from active index
                                let offset = index - activeIndex;
                                // Handle wrap-around for infinite feel logic (visual only here)
                                if (offset < -3) offset += displayProjects.length;
                                if (offset > 3) offset -= displayProjects.length;

                                // Only render visible cards (active + 3 neighbors)
                                if (Math.abs(offset) > 3) return null;

                                const isActive = offset === 0;

                                return (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, z: -200 }}
                                        animate={{
                                            opacity: isActive ? 1 : Math.max(0.2, 1 - Math.abs(offset) * 0.3),
                                            scale: isActive ? 1 : Math.max(0.6, 1 - Math.abs(offset) * 0.15),
                                            z: isActive ? 100 : -100 - Math.abs(offset) * 100,
                                            x: `${offset * 55}%`,
                                            rotateY: offset * -25,
                                            zIndex: 100 - Math.abs(offset)
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, z: -200 }}
                                        transition={{
                                            duration: 0.8,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 20,
                                            mass: 1.2
                                        }}
                                        className="absolute w-[340px] md:w-[420px] h-[550px] origin-center cursor-grab active:cursor-grabbing transform-style-3d"
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
                                        <ProjectCard project={project} isActive={isActive} index={index} />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 md:-left-16 z-50 pointer-events-none md:pointer-events-auto">
                        <button
                            onClick={prevProject}
                            className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-md shadow-2xl pointer-events-auto"
                            aria-label="Previous Project"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 md:-right-16 z-50 pointer-events-none md:pointer-events-auto">
                        <button
                            onClick={nextProject}
                            className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-md shadow-2xl pointer-events-auto"
                            aria-label="Next Project"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>

                {/* Pagination Indicators */}
                <div className="flex justify-center gap-3 mt-4">
                    {displayProjects.map((_: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-12 bg-white shadow-[0_0_10px_white]' : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Go to project ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
