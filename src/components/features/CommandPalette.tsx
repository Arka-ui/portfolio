"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import {
    Search, Home, Code, User, Mail, Copy, Check, ExternalLink,
    Layers, Radio, Clock, Github, Music2, MessageCircle,
    Share2, ArrowUpRight, Zap, Sparkles, Link2, Languages, Globe,
} from "lucide-react";
import { useWarp } from "@/context/WarpContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";

/* ── Section data ── */
const SECTIONS = [
    { icon: Home,    label: "Home",     desc: "Back to the top",               href: "#" },
    { icon: User,    label: "About",    desc: "Who I am & what I believe in",  href: "#about-intro" },
    { icon: Code,    label: "Projects", desc: "Featured work & case studies",  href: "#projects" },
    { icon: Layers,  label: "Stack",    desc: "Technologies & tools I use",    href: "#skills" },
    { icon: Clock,   label: "Timeline", desc: "My developer journey so far",   href: "#about" },
    { icon: Radio,   label: "Live",     desc: "Discord status & availability", href: "#live" },
    { icon: Mail,    label: "Contact",  desc: "Get in touch with me",          href: "#contact" },
];

const SOCIALS = [
    { icon: Github,        label: "GitHub",  url: "https://github.com/arka-ui" },
    { icon: MessageCircle, label: "Discord", url: "https://discord.com/users/871084043838566400" },
    { icon: Music2,        label: "Spotify", url: "https://open.spotify.com/user/YOUR_SPOTIFY_USER_ID" },
];

export default function CommandPalette() {
    const [open, setOpen]   = useState(false);
    const { warpTo }        = useWarp();
    const { language, setLanguage, t } = useLanguage();
    const [copied, setCopied] = useState<"email" | "link" | null>(null);
    const [search, setSearch] = useState("");

    // Mobile: open via bottom-sheet slide-up on small screens
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(o => !o);
                setSearch("");
            }
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const run = useCallback((action: () => void) => {
        setOpen(false);
        action();
    }, []);

    const handleCopy = useCallback((type: "email" | "link") => {
        const text = type === "email" ? "hello@arka.dev" : window.location.href;
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
        setOpen(false);
    }, []);

    const handleShare = useCallback(() => {
        if (navigator.share) {
            navigator.share({ title: "Arka — Developer Portfolio", url: window.location.href });
        } else {
            handleCopy("link");
        }
        setOpen(false);
    }, [handleCopy]);

    if (!open) return null;

    // On mobile: position as a bottom sheet; on desktop: centered modal
    const containerClass = isMobile
        ? "fixed inset-0 z-[60] flex items-end"
        : "fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] sm:pt-[16vh] px-4";

    const paletteClass = isMobile
        ? "relative w-full bg-[#0f0f11]/98 border-t border-white/[0.08] rounded-t-2xl shadow-[0_-16px_80px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-4 fade-in duration-200 pb-[env(safe-area-inset-bottom,0px)]"
        : "relative w-full max-w-lg bg-[#0f0f11]/95 border border-white/[0.08] rounded-2xl shadow-[0_16px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(99,102,241,0.08)] overflow-hidden backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-200";

    return (
        <div className={containerClass}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
                onClick={() => setOpen(false)}
            />

            <div className={paletteClass}>
                {/* Mobile drag indicator */}
                {isMobile && (
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 rounded-full bg-white/15" />
                    </div>
                )}

                <Command className="w-full" shouldFilter>
                    {/* Search input */}
                    <div className="flex items-center border-b border-white/[0.06] px-5">
                        <Search className="w-4 h-4 text-indigo-400/50 mr-3 shrink-0" />
                        <Command.Input
                            autoFocus={!isMobile}
                            value={search}
                            onValueChange={setSearch}
                            placeholder={t("nav.cmd_placeholder")}
                            className="w-full bg-transparent py-4 text-[15px] text-white placeholder-white/20 focus:outline-none"
                        />
                        <kbd className="hidden sm:inline-flex text-[10px] font-mono text-white/15 border border-white/[0.06] rounded-md px-1.5 py-0.5 ml-2 shrink-0 bg-white/[0.02]">
                            ESC
                        </kbd>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto p-2">
                        <Command.List>
                            <Command.Empty className="py-12 text-center">
                                <Sparkles className="w-5 h-5 text-white/15 mx-auto mb-3" />
                                <p className="text-sm text-white/30">No results found.</p>
                                <p className="text-xs text-white/15 mt-1">Try a different keyword</p>
                            </Command.Empty>

                            {/* Navigate */}
                            <Command.Group heading="Navigate" className={GROUP_STYLE}>
                                {SECTIONS.map((s) => (
                                    <CmdItem
                                        key={s.href}
                                        icon={<s.icon size={15} />}
                                        desc={s.desc}
                                        onSelect={() => run(() => warpTo(s.href))}
                                    >
                                        {s.label}
                                    </CmdItem>
                                ))}
                            </Command.Group>

                            {/* Actions */}
                            <Command.Group heading="Actions" className={GROUP_STYLE}>
                                <CmdItem
                                    icon={copied === "email" ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                                    desc="hello@arka.dev"
                                    onSelect={() => run(() => handleCopy("email"))}
                                    kbd="C"
                                >
                                    {copied === "email" ? "Copied!" : "Copy email"}
                                </CmdItem>
                                <CmdItem
                                    icon={copied === "link" ? <Check size={15} className="text-emerald-400" /> : <Link2 size={15} />}
                                    desc="Copy current page URL"
                                    onSelect={() => run(() => handleCopy("link"))}
                                >
                                    {copied === "link" ? "Copied!" : "Copy page link"}
                                </CmdItem>
                                <CmdItem
                                    icon={<Share2 size={15} />}
                                    desc="Share via native sharing"
                                    onSelect={() => run(handleShare)}
                                >
                                    Share this page
                                </CmdItem>
                                <CmdItem
                                    icon={<Zap size={15} />}
                                    desc="Jump to the top instantly"
                                    onSelect={() => run(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
                                >
                                    Scroll to top
                                </CmdItem>
                            </Command.Group>

                            {/* Language */}
                            <Command.Group heading="Language" className={GROUP_STYLE}>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <CmdItem
                                        key={lang.code}
                                        icon={<Globe size={15} />}
                                        desc={lang.code === language.code ? "Currently active" : `Switch to ${lang.name}`}
                                        suffix={lang.code === language.code
                                            ? <Check size={12} className="text-indigo-400" />
                                            : undefined
                                        }
                                        onSelect={() => run(() => setLanguage(lang))}
                                    >
                                        {lang.flag} {lang.name}
                                    </CmdItem>
                                ))}
                            </Command.Group>

                            {/* Socials */}
                            <Command.Group heading="Socials" className={GROUP_STYLE}>
                                {SOCIALS.map((s) => (
                                    <CmdItem
                                        key={s.label}
                                        icon={<s.icon size={15} />}
                                        suffix={<ArrowUpRight size={12} className="text-white/15" />}
                                        desc={`Open ${s.label}`}
                                        onSelect={() => run(() => window.open(s.url, "_blank"))}
                                    >
                                        {s.label}
                                    </CmdItem>
                                ))}
                            </Command.Group>
                        </Command.List>
                    </div>

                    {/* Footer hints */}
                    <div className="border-t border-white/[0.05] px-5 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/15">
                            <kbd className="border border-white/[0.06] rounded px-1 py-0.5 bg-white/[0.02]">↑↓</kbd>
                            <span>navigate</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-white/15">
                            <span className="flex items-center gap-1.5">
                                <kbd className="border border-white/[0.06] rounded px-1 py-0.5 bg-white/[0.02]">↵</kbd>
                                select
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="border border-white/[0.06] rounded px-1 py-0.5 bg-white/[0.02]">esc</kbd>
                                close
                            </span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
}

/* ── Shared group heading style ── */
const GROUP_STYLE = "[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-white/20 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] mt-1";

/* ── Command item component ── */
function CmdItem({ children, icon, desc, suffix, kbd: kbdHint, onSelect }: {
    children: React.ReactNode;
    icon: React.ReactNode;
    desc?: string;
    suffix?: React.ReactNode;
    kbd?: string;
    onSelect: () => void;
}) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/55 cursor-pointer hover:bg-white/[0.05] hover:text-white aria-selected:bg-indigo-500/[0.08] aria-selected:text-white transition-all duration-150 group"
        >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 group-aria-selected:text-indigo-400/70 group-aria-selected:border-indigo-500/[0.15] group-aria-selected:bg-indigo-500/[0.08] transition-all duration-150 shrink-0">
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                <span className="block truncate font-medium">{children}</span>
                {desc && <span className="block text-[11px] text-white/20 truncate group-aria-selected:text-white/30 transition-colors">{desc}</span>}
            </div>
            {kbdHint && (
                <kbd className="hidden sm:inline-flex shrink-0 ml-auto text-[10px] font-mono text-white/15 border border-white/[0.06] rounded px-1.5 py-0.5 bg-white/[0.02]">
                    {kbdHint}
                </kbd>
            )}
            {suffix && <span className="shrink-0 ml-auto">{suffix}</span>}
        </Command.Item>
    );
}
