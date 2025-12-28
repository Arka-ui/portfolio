"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { ArrowUpRight } from "lucide-react";
import BlueprintWrapper from "@/components/BlueprintWrapper";

const DEVTO_USERNAME = "arkaui";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BlogPost {
    id: number;
    url: string;
    cover_image: string | null;
    title: string;
    description: string;
    published_at: string;
    reading_time_minutes: number;
    tag_list: string[];
}

export default function BlogPosts() {
    const { data: posts, error } = useSWR<BlogPost[]>(
        `https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=5`,
        fetcher
    );

    if (error) return null;

    return (
        <section className="py-32 bg-slate-950 relative overflow-hidden" id="blog">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <BlueprintWrapper label="SECTION_BLOG" description="Technical Insights" direction="left">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                                Writing & <br />
                                <span className="text-slate-500">Thoughts.</span>
                            </h2>
                            <p className="text-slate-400 max-w-md">
                                Exploring the frontiers of web development, design systems, and digital craftsmanship.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <span className="text-xs font-mono text-slate-600 border border-slate-800 px-3 py-1 rounded-full">
                                SYNC: DEV.TO // API
                            </span>
                        </div>
                    </div>
                </BlueprintWrapper>

                <div className="space-y-4">
                    {posts?.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group block relative"
                        >
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group-hover:border-white/10 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-xs text-indigo-400 font-mono mb-2">
                                        <span>{new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                                        <span>{post.reading_time_minutes} min read</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm max-w-xl line-clamp-2">
                                        {post.description}
                                    </p>
                                </div>

                                <div className="self-start md:self-center">
                                    <div className="p-3 rounded-full border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all transform group-hover:-rotate-45 duration-300">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
