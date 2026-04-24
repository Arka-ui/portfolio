"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { ShieldCheck, ArrowUpRight, Github, Radio } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ANS_FEED_URL = "https://arka-ui.github.io/ArkaNewsSystem/index.json";
const ANS_SITE_URL = "https://arka-ui.github.io/ArkaNewsSystem/";
const ANS_REPO_URL = "https://github.com/Arka-ui/ArkaNewsSystem";
const MAX_POSTS = 4;

interface NewsPost {
    id: string;
    title: string;
    author: string;
    timestamp: string;
    tags: string[];
    signature: string;
    source_url: string;
    raw_url: string;
    filename: string;
}

interface NewsIndex {
    system: string;
    version: number;
    count: number;
    generated_at: string;
    public_key_url: string;
    news: NewsPost[];
}

const fetcher = async (url: string): Promise<NewsIndex | null> => {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return (await res.json()) as NewsIndex;
    } catch {
        return null;
    }
};

const fadeUp = {
    hidden: { y: 28, opacity: 0, scale: 0.94, filter: "blur(10px)" },
    show: (i: number) => ({
        y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
        transition: {
            duration: 1.05, delay: i * 0.09, ease: [0.2, 0.9, 0.25, 1.05] as const,
            filter: { duration: 0.75, delay: i * 0.09 },
        },
    }),
};

function formatDate(iso: string, locale: string) {
    try {
        return new Intl.DateTimeFormat(locale, {
            day: "2-digit", month: "short", year: "numeric",
        }).format(new Date(iso));
    } catch {
        return iso.slice(0, 10);
    }
}

function shortId(id: string) {
    return id.slice(0, 7);
}

function NewsCard({ post, index, featured, locale, verifiedLabel, readLabel }: {
    post: NewsPost;
    index: number;
    featured: boolean;
    locale: string;
    verifiedLabel: string;
    readLabel: string;
}) {
    return (
        <motion.article
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className={`group relative bento-card p-6 md:p-8 flex flex-col gap-5 transition-all duration-500 hover:-translate-y-0.5 border-[#DBC7A6]/35 hover:border-[#DBC7A6]/55 shadow-[0_0_0_1px_rgba(219,199,166,0.08),0_24px_60px_-24px_rgba(219,199,166,0.18)] ${featured ? "md:col-span-2 lg:col-span-3" : ""}`}
        >
            {/* Top hairline accent */}
            <span
                className="pointer-events-none absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(219,199,166,0.6) 50%, transparent 100%)" }}
                aria-hidden
            />

            {/* Top row: date + verified */}
            <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7D6B56]">
                    {formatDate(post.timestamp, locale)}
                </span>
                <span
                    className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-[#DBC7A6] px-2.5 py-1 rounded-full border border-[#DBC7A6]/30 bg-[#DBC7A6]/[0.05]"
                    title={`Ed25519 · ${shortId(post.id)}`}
                >
                    <ShieldCheck size={10} />
                    {verifiedLabel}
                </span>
            </div>

            {/* Title */}
            <h3 className={`font-display font-bold tracking-tight text-grad-warm ${featured ? "text-2xl md:text-3xl lg:text-4xl leading-[1.05]" : "text-xl md:text-2xl"}`}>
                {post.title}
            </h3>

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#251E18]/60 border border-[#493B33]/40 text-[10px] font-mono text-[#B39F85]">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Bottom: author + CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-[#493B33]/40 mt-auto">
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#7D6B56]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B39F85]" />
                    {post.author}
                    <span className="text-[#5F564D]">·</span>
                    <span className="text-[#5F564D]">{shortId(post.id)}</span>
                </div>
                <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${readLabel} — ${post.title}`}
                    className="group/cta inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] text-[#B39F85] hover:text-[#DBC7A6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBC7A6]/50 rounded-md px-1"
                >
                    {readLabel}
                    <ArrowUpRight size={12} className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
                </a>
            </div>
        </motion.article>
    );
}

export default function NewsFeed() {
    const { t, language } = useLanguage();
    const { data, error, isLoading } = useSWR<NewsIndex | null>(ANS_FEED_URL, fetcher, {
        refreshInterval: 5 * 60 * 1000,
    });

    if (isLoading || error || !data || !data.news || data.news.length === 0) return null;

    const posts = data.news.slice(0, MAX_POSTS);
    const featuredIndex = posts.length === 1 ? 0 : -1;

    return (
        <section id="news" className="py-24 md:py-36 border-t border-[#493B33]/25 md:pl-[72px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 md:mb-20">
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="label-display">{t("news.label")}</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-[#DBC7A6] px-2 py-0.5 rounded-full border border-[#DBC7A6]/30 bg-[#DBC7A6]/[0.05]">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#DBC7A6] opacity-60 animate-ping" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#DBC7A6]" />
                                </span>
                                {t("news.live")}
                            </span>
                        </div>
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display font-bold text-[clamp(40px,5.5vw,76px)] leading-[0.88] tracking-tighter text-[#DBC7A6]"
                        >
                            {t("news.heading")}
                        </motion.h2>
                        <p className="mt-5 max-w-2xl text-[15px] text-[#B39F85] leading-relaxed">
                            {t("news.subtitle")}
                        </p>
                    </div>
                    <a
                        href={ANS_SITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-[#B39F85] hover:text-[#DBC7A6] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBC7A6]/50 rounded-md px-1"
                    >
                        {t("news.view_all")}
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {posts.map((post, i) => (
                        <NewsCard
                            key={post.id}
                            post={post}
                            index={i}
                            featured={i === featuredIndex}
                            locale={language.code}
                            verifiedLabel={t("news.verified")}
                            readLabel={t("news.read")}
                        />
                    ))}
                </div>

                {/* Footer meta */}
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-[#493B33]/25">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#7D6B56]">
                        <Radio size={12} />
                        <span>{t("news.powered_by")}</span>
                        <a
                            href={ANS_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#B39F85] hover:text-[#DBC7A6] transition-colors"
                        >
                            <Github size={11} />
                            Arka News System
                        </a>
                    </div>
                    <span className="text-[10px] font-mono text-[#5F564D] uppercase tracking-[0.22em]">
                        {t("news.signed_note")}
                    </span>
                </div>
            </div>
        </section>
    );
}
