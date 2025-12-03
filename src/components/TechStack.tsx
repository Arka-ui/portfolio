"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { Code2, Wrench, ExternalLink } from "lucide-react";

const GITHUB_USERNAME = "Arka-ui";
const RESUME_URL = "https://gist.githubusercontent.com/Arka-ui/raw/resume.json";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        // If the resume doesn't exist, return null instead of throwing to avoid SWR retries spamming 400s
        if (res.status === 400 || res.status === 404) return null;
        throw new Error('An error occurred while fetching the data.');
    }
    return res.json();
};

const techUrls: Record<string, string> = {
    "React": "https://react.dev",
    "TypeScript": "https://www.typescriptlang.org",
    "Node.js": "https://nodejs.org",
    "Tailwind CSS": "https://tailwindcss.com",
    "Next.js": "https://nextjs.org",
    "Docker": "https://www.docker.com",
    "AWS": "https://aws.amazon.com",
    "Figma": "https://www.figma.com",
    "Git": "https://git-scm.com",
    "Redis": "https://redis.io",
    "Prisma": "https://www.prisma.io",
    "PostgreSQL": "https://www.postgresql.org",
    "VS Code": "https://code.visualstudio.com",
    "Postman": "https://www.postman.com",
    "Python": "https://www.python.org",
    "Java": "https://www.java.com",
    "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "HTML": "https://developer.mozilla.org/en-US/docs/Web/HTML",
    "CSS": "https://developer.mozilla.org/en-US/docs/Web/CSS",
    "Swift": "https://developer.apple.com/swift/",
    "Kotlin": "https://kotlinlang.org/",
    "Go": "https://go.dev/",
    "Rust": "https://www.rust-lang.org/",
};

const getTechUrl = (tech: string) => {
    return techUrls[tech] || `https://www.google.com/search?q=${encodeURIComponent(tech + " programming")}`;
};

const fallbackTools = [
    "Docker", "AWS", "Figma", "Git", "Redis", "Prisma", "PostgreSQL", "VS Code", "Postman"
];

export default function TechStack() {
    const { data: githubData } = useSWR(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=20`,
        fetcher
    );

    const { data: resumeData } = useSWR(RESUME_URL, fetcher);

    const languages = githubData
        ? Array.from(new Set(githubData.map((repo: any) => repo.language).filter(Boolean))).slice(0, 10)
        : ["React", "TypeScript", "Node.js", "Tailwind CSS", "Next.js"];

    const tools = resumeData?.skills
        ? resumeData.skills.flatMap((skill: any) => skill.keywords)
        : fallbackTools;

    const uniqueTools = Array.from(new Set(tools)).filter(tool => !languages.includes(tool as string));

    return (
        <section className="py-32 container mx-auto px-4 relative" id="skills">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                className="text-center mb-20 relative z-10"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40">
                    Tech Stack
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The arsenal of tools I use to bring ideas to life.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto relative z-10">
                {/* Languages Section */}
                <div>
                    import BlueprintWrapper from "@/components/BlueprintWrapper";

                    // ... existing imports

                    // ... existing code

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="flex items-center gap-3 mb-10 justify-center md:justify-start"
                    >
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <Code2 className="text-primary w-6 h-6" />
                        </div>
                        <BlueprintWrapper
                            label="LANG_MATRIX"
                            description="Core Programming Languages & Frameworks"
                            direction="right"
                            techSpecs={{
                                "Source": "GitHub API",
                                "Filter": "Top 10",
                                "Update": "Auto"
                            }}
                        >
                            <h3 className="text-2xl font-bold">Languages & Frameworks</h3>
                        </BlueprintWrapper>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {languages.map((tech: any, index) => (
                            <motion.a
                                key={tech}
                                href={getTechUrl(tech)}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-card/20 backdrop-blur-sm rounded-xl p-4 text-center overflow-hidden hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    <span className="font-medium text-muted-foreground group-hover:text-white transition-colors">{tech}</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Tools Section */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="flex items-center gap-3 mb-10 justify-center md:justify-start"
                    >
                        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                            <Wrench className="text-accent w-6 h-6" />
                        </div>
                        <BlueprintWrapper
                            label="TOOL_BELT"
                            description="Development & Infrastructure Tools"
                            direction="left"
                            techSpecs={{
                                "Source": "Resume JSON",
                                "Type": "Infrastructure",
                                "Category": "DevOps/Utils"
                            }}
                        >
                            <h3 className="text-2xl font-bold">My Tools</h3>
                        </BlueprintWrapper>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {uniqueTools.map((tool: any, index) => (
                            <motion.a
                                key={tool}
                                href={getTechUrl(tool as string)}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-card/20 backdrop-blur-sm rounded-xl p-4 text-center overflow-hidden hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/10 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    <span className="font-medium text-muted-foreground group-hover:text-white transition-colors">{tool}</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
