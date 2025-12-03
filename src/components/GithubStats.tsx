"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, Github } from "lucide-react";

// Placeholder - User should replace with their username
const GITHUB_USERNAME = "Arka-ui";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

export default function GithubStats() {
    const { data, error } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
        fetcher
    );

    if (error) return null;

    return (
        <section className="py-32 container mx-auto px-4" id="projects">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                className="text-center mb-20"
            >
                import BlueprintWrapper from "@/components/BlueprintWrapper";

                // ... existing imports

                // ... existing code

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-6">
                    <Github className="w-4 h-4" />
                    <span>Open Source</span>
                </div>
                <BlueprintWrapper
                    label="GIT_STREAM"
                    description="Live GitHub Activity Feed"
                    direction="bottom"
                    techSpecs={{
                        "API": "GitHub REST",
                        "Sort": "Updated",
                        "Limit": "6"
                    }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40">
                        Recent Activity
                    </h2>
                </BlueprintWrapper>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    My latest contributions and experiments on GitHub.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(data) && data.map((repo: any, index: number) => (
                    <motion.a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-card/20 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                                    <Github className="w-6 h-6 text-white/60 group-hover:text-primary transition-colors" />
                                </div>
                                <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>

                            <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors truncate">
                                {repo.name}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-8 flex-grow line-clamp-3 leading-relaxed">
                                {repo.description || "No description available for this repository."}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-auto pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    <span>{repo.language || "Code"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-yellow-500/80" />
                                    <span>{repo.stargazers_count}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <GitFork className="w-4 h-4" />
                                    <span>{repo.forks_count}</span>
                                </div>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
