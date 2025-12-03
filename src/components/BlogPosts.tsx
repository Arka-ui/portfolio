"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import BlueprintWrapper from "@/components/BlueprintWrapper";

// Placeholder - User should replace with their username or tag
const DEVTO_USERNAME = "ben"; // Using 'ben' (Ben Halpern) as a reliable placeholder with posts

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogPosts() {
    const { data, error } = useSWR(
        `https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=3`,
        fetcher
    );

    if (error) return null;

    return (
        <section className="py-32 container mx-auto px-4" id="blog">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                className="text-center mb-20"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                    <BookOpen className="w-4 h-4" />
                    <span>Writing</span>
                </div>
                <BlueprintWrapper
                    label="KNOWLEDGE_BASE"
                    description="Technical Writing & Tutorials"
                    direction="bottom"
                    techSpecs={{
                        "Source": "Dev.to API",
                        "Content": "Tech Writing",
                        "Sync": "Real-time"
                    }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40">
                        Latest Articles
                    </h2>
                </BlueprintWrapper>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Thoughts, tutorials, and insights on web development and technology.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data?.map((post: any, index: number) => (
                    <motion.a
                        key={post.id}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-card/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:bg-card/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
                    >
                        <div className="relative h-56 w-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            {post.cover_image ? (
                                <Image
                                    src={post.cover_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                    <span className="text-4xl font-bold opacity-20">DEV</span>
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 text-xs text-white/80">
                                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                                    <Clock className="w-3 h-3" />
                                    <span>{post.reading_time_minutes} min read</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow relative">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                {post.title}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                                {post.description}
                            </p>

                            <div className="flex items-center text-primary text-sm font-bold mt-auto group/link">
                                <span className="relative">
                                    Read Article
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
                                </span>
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
