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

const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

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

function Dispatch({ post, index, locale, verifiedLabel, readLabel }: {
    post: NewsPost;
    index: number;
    locale: string;
    verifiedLabel: string;
    readLabel: string;
}) {
    return (
        <motion.article
            {...enter(index * 0.06)}
            className="ledger-row group block py-8 md:py-10 border-t border-[#493B33]/35 first:border-t-0"
        >
            {/* Top wire row */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-4 atlas-folio">
                <span className="atlas-folio-strong">№ {String(index + 1).padStart(2, "0")}</span>
                <span className="text-[#5F564D]">·</span>
                <span>{formatDate(post.timestamp, locale)}</span>
                <span className="text-[#5F564D]">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#DBC7A6]" title={`Ed25519 · ${shortId(post.id)}`}>
                    <ShieldCheck size={10} />
                    {verifiedLabel} · ED25519
                </span>
                <span className="text-[#5F564D]">·</span>
                <span className="text-[#7D6B56] tabular-nums">#{shortId(post.id)}</span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold tracking-tight text-[#DBC7A6] text-[24px] md:text-[34px] lg:text-[42px] leading-[1.05] max-w-[28ch] mb-4">
                {post.title}
            </h3>

            {/* Tags inline */}
            {post.tags.length > 0 && (
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7D6B56] mb-4">
                    {post.tags.slice(0, 5).map((tag, i, arr) => (
                        <span key={tag}>
                            <span className="text-[#B39F85]">#{tag}</span>
                            {i < arr.length - 1 && <span className="text-[#5F564D] mx-2">·</span>}
                        </span>
                    ))}
                </p>
            )}

            {/* Bottom signature row */}
            <div className="flex items-center justify-between gap-4 flex-wrap pt-4 mt-4 border-t border-[#493B33]/30">
                <span className="font-green-energy text-[#B39F85] text-[20px] md:text-[26px] leading-none">
                    — {post.author}<span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#7D6B56] ml-3">/ signed</span>
                </span>
                <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${readLabel} — ${post.title}`}
                    className="atlas-link text-[#DBC7A6] text-[12px] font-mono uppercase tracking-[0.2em]"
                >
                    {readLabel} <ArrowUpRight size={11} />
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

    return (
        <section id="news" className="py-24 md:py-32 border-t border-[#493B33]/35 md:pl-[88px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Folio head */}
                <motion.div {...enter(0)} className="flex items-center gap-4 mb-10">
                    <span className="atlas-folio">§ 05 · {t("news.label")}</span>
                    <span className="atlas-folio-strong inline-flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-[#DBC7A6] opacity-60 animate-ping" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#DBC7A6]" />
                        </span>
                        {t("news.live")}
                    </span>
                    <span aria-hidden className="flex-1 atlas-rule" />
                    <a
                        href={ANS_SITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="atlas-folio hover:text-[#DBC7A6] transition-colors"
                    >
                        {t("news.view_all")} ↗
                    </a>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    {...enter(0.05)}
                    className="font-display font-bold leading-[0.92] tracking-tighter text-[#DBC7A6] max-w-3xl mb-6"
                    style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
                >
                    {t("news.heading")}
                </motion.h2>

                <motion.p
                    {...enter(0.1)}
                    className="text-[15px] text-[#B39F85] leading-[1.7] max-w-[68ch] mb-12 md:mb-16"
                >
                    {t("news.subtitle")}
                </motion.p>

                {/* Top double rule */}
                <div className="atlas-rule-double mb-2" aria-hidden />

                {/* Dispatches */}
                <div>
                    {posts.map((post, i) => (
                        <Dispatch
                            key={post.id}
                            post={post}
                            index={i}
                            locale={language.code}
                            verifiedLabel={t("news.verified")}
                            readLabel={t("news.read")}
                        />
                    ))}
                </div>

                {/* Bottom double rule */}
                <div className="atlas-rule-double mt-2" aria-hidden />

                {/* Wire footer */}
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="atlas-folio inline-flex items-center gap-2">
                        <Radio size={11} />
                        <span>{t("news.powered_by")}</span>
                        <a
                            href={ANS_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="atlas-link inline-flex items-center gap-1 text-[#B39F85] hover:text-[#DBC7A6]"
                        >
                            <Github size={11} />
                            Arka News System
                        </a>
                    </div>
                    <span className="atlas-folio">{t("news.signed_note")}</span>
                </div>
            </div>
        </section>
    );
}
