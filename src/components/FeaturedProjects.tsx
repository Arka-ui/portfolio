"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import useSWR from "swr";
import { MouseEvent, useRef } from "react";

const GITHUB_USERNAME = "Arka-ui";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

function ProjectCard({ project, index }: { project: any; index: number }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // 3D Tilt Effect
    const rotateX = useTransform(mouseY, [0, 400], [5, -5]);
    const rotateY = useTransform(mouseX, [0, 600], [-5, 5]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ perspective: 1000 }}
            className="w-full"
        >
            <motion.div
                onMouseMove={onMouseMove}
                onMouseLeave={() => {
                    mouseX.set(0);
                    mouseY.set(0);
                    x.set(0);
                    y.set(0);
                }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="group relative flex flex-col lg:flex-row gap-8 items-center bg-card/30 border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-card/50 transition-colors duration-500"
            >
                {/* Holographic Shine */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.1),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative transform-style-3d group-hover:translate-z-10 transition-transform duration-500">
                    <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 z-10 group-hover:opacity-0 transition-opacity duration-500" />

                        {/* Dynamic Gradient Placeholder */}
                        <div className={`w-full h-full bg-gradient-to-br ${index % 3 === 0 ? 'from-violet-600/20 via-indigo-600/20 to-purple-600/20' :
                            index % 3 === 1 ? 'from-emerald-600/20 via-teal-600/20 to-cyan-600/20' :
                                'from-orange-600/20 via-red-600/20 to-pink-600/20'
                            } flex items-center justify-center group-hover:scale-110 transition-transform duration-700`}>
                            <div className="text-center p-6 backdrop-blur-sm bg-black/20 rounded-xl border border-white/10">
                                <h4 className="text-3xl font-bold text-white/40 uppercase tracking-widest">{project.name}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-20 transform-style-3d group-hover:translate-z-8 transition-transform duration-500">
                    <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {project.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed line-clamp-3">
                        {project.description || "A cutting-edge project built with modern web technologies. Focused on performance, accessibility, and user experience."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.language && (
                            <span className="px-3 py-1 text-sm bg-primary/10 border border-primary/20 rounded-full text-primary font-medium">
                                {project.language}
                            </span>
                        )}
                        {project.topics?.slice(0, 3).map((topic: string) => (
                            <span
                                key={topic}
                                className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full text-gray-300"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href={project.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white hover:text-primary transition-colors group/link"
                        >
                            <Github size={20} className="group-hover/link:rotate-12 transition-transform" />
                            <span className="font-medium">Code</span>
                        </a>
                        {project.homepage && (
                            <a
                                href={project.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white hover:text-primary transition-colors group/link"
                            >
                                <ExternalLink size={20} className="group-hover/link:-translate-y-1 group-hover/link:translate-x-1 transition-transform" />
                                <span className="font-medium">Live Demo</span>
                            </a>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <Star size={14} className="text-yellow-500" />
                            <span>{project.stargazers_count}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function FeaturedProjects() {
    const { data, error } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
        fetcher
    );

    const projects = Array.isArray(data)
        ? data
            .filter((repo: any) => repo.topics?.includes("featured"))
            .slice(0, 3)
        : [];

    const displayProjects = projects.length > 0
        ? projects
        : (Array.isArray(data) ? data.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 3) : []);

    if (error) return null;

    return (
        <section className="py-32 container mx-auto px-4" id="featured">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40">
                    Featured Work
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    A selection of projects that push the boundaries of web development.
                </p>
            </motion.div>

            <div className="space-y-12">
                {displayProjects.map((project: any, index: number) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
        </section>
    );
}
