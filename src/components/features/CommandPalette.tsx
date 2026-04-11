"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import {
    Search, Home, Code, User, Mail, Copy, Check,
    Layers, Radio, Clock, Github, Music2, MessageCircle,
    Share2, ArrowUpRight, Zap, Sparkles, Link2, Globe,
} from "lucide-react";
import { useWarp } from "@/context/WarpContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";

const SOCIALS = [
    { icon: Github,        label: "GitHub",  url: "https://github.com/arka-ui" },
    { icon: MessageCircle, label: "Discord", url: "https://discord.com/users/871084043838566400" },
    { icon: Music2,        label: "Spotify", url: "https://open.spotify.com/user/YOUR_SPOTIFY_USER_ID" },
];

export default function CommandPalette() {
    const [open, setOpen]   = useState(false);
    const { warpTo }        = useWarp();
    const { language, setLanguage, t } = useLanguage();

    const SECTIONS = [
        { icon: Home,    label: t("nav.home"),     desc: t("cmd.desc_home"),     href: "#" },
        { icon: User,    label: t("nav.about"),    desc: t("cmd.desc_about"),    href: "#about-intro" },
        { icon: Code,    label: t("nav.projects"), desc: t("cmd.desc_projects"), href: "#projects" },
        { icon: Layers,  label: t("cmd.go_stack"), desc: t("cmd.desc_stack"),    href: "#skills" },
        { icon: Clock,   label: t("cmd.go_timeline"), desc: t("cmd.desc_timeline"), href: "#about" },
        { icon: Radio,   label: t("nav.live"),     desc: t("cmd.desc_live"),     href: "#live" },
        { icon: Mail,    label: t("nav.contact"),  desc: t("cmd.desc_contact"),  href: "#contact" },
    ];
    const [copied, setCopied] = useState<"email" | "link" | null>(null);
    const [search, setSearch] = useState("");

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

    const run = useCallback((action: () => void) => { setOpen(false); action(); }, []);

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

    const containerClass = isMobile
        ? "fixed inset-0 z-[60] flex items-end"
        : "fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] sm:pt-[16vh] px-4";

    const paletteClass = isMobile
        ? "relative w-full bg-[#13110E]/98 border-t border-[#493B33]/45 rounded-t-3xl shadow-[0_-16px_80px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl animate-in slide-in-from-bottom-4 fade-in duration-200 pb-[env(safe-area-inset-bottom,0px)]"
        : "relative w-full max-w-lg bg-[#13110E]/95 border border-[#493B33]/45 rounded-3xl shadow-[0_16px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(219,199,166,0.05)] overflow-hidden backdrop-blur-2xl animate-in slide-in-from-top-4 fade-in duration-200";

    return (
        <div className={containerClass}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-150" onClick={() => setOpen(false)} />

            <div className={paletteClass}>
                {isMobile && (
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 rounded-full bg-[#493B33]/60" />
                    </div>
                )}

                <Command className="w-full" shouldFilter>
                    <div className="flex items-center border-b border-[#493B33]/35 px-5">
                        <Search className="w-4 h-4 text-[#B39F85] mr-3 shrink-0" />
                        <Command.Input
                            autoFocus={!isMobile}
                            value={search}
                            onValueChange={setSearch}
                            placeholder={t("nav.cmd_placeholder")}
                            className="w-full bg-transparent py-4 text-[15px] text-[#DBC7A6] placeholder-[#5F564D] focus:outline-none"
                        />
                        <kbd className="hidden sm:inline-flex text-[10px] font-mono text-[#7D6B56] border border-[#493B33]/50 rounded-lg px-1.5 py-0.5 ml-2 shrink-0 bg-[#251E18]/60">
                            ESC
                        </kbd>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto p-2">
                        <Command.List>
                            <Command.Empty className="py-12 text-center">
                                <Sparkles className="w-5 h-5 text-[#493B33] mx-auto mb-3" />
                                <p className="text-sm text-[#7D6B56]">{t("cmd.no_results")}</p>
                                <p className="text-xs text-[#5F564D] mt-1">{t("cmd.no_results_hint")}</p>
                            </Command.Empty>

                            <Command.Group heading={t("cmd.navigate")} className={GROUP_STYLE}>
                                {SECTIONS.map((s) => (
                                    <CmdItem key={s.href} icon={<s.icon size={15} />} desc={s.desc} onSelect={() => run(() => warpTo(s.href))}>
                                        {s.label}
                                    </CmdItem>
                                ))}
                            </Command.Group>

                            <Command.Group heading={t("cmd.actions")} className={GROUP_STYLE}>
                                <CmdItem icon={copied === "email" ? <Check size={15} className="text-[#DBC7A6]" /> : <Copy size={15} />} desc={t("cmd.copy_email_desc")} onSelect={() => run(() => handleCopy("email"))} kbd="C">
                                    {copied === "email" ? t("cmd.copied") : t("cmd.copy_email")}
                                </CmdItem>
                                <CmdItem icon={copied === "link" ? <Check size={15} className="text-[#DBC7A6]" /> : <Link2 size={15} />} desc={t("cmd.copy_link_desc")} onSelect={() => run(() => handleCopy("link"))}>
                                    {copied === "link" ? t("cmd.copied") : t("cmd.copy_link")}
                                </CmdItem>
                                <CmdItem icon={<Share2 size={15} />} desc={t("cmd.share_desc")} onSelect={() => run(handleShare)}>{t("cmd.share")}</CmdItem>
                                <CmdItem icon={<Zap size={15} />} desc={t("cmd.scroll_top_desc")} onSelect={() => run(() => window.scrollTo({ top: 0, behavior: "smooth" }))}>{t("cmd.scroll_top")}</CmdItem>
                            </Command.Group>

                            <Command.Group heading={t("cmd.lang_group")} className={GROUP_STYLE}>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <CmdItem
                                        key={lang.code}
                                        icon={<Globe size={15} />}
                                        desc={lang.code === language.code ? t("cmd.lang_active") : t("cmd.lang_switch", { name: lang.name })}
                                        suffix={lang.code === language.code ? <Check size={12} className="text-[#DBC7A6]" /> : undefined}
                                        onSelect={() => run(() => setLanguage(lang))}
                                    >
                                        {lang.flag} {lang.name}
                                    </CmdItem>
                                ))}
                            </Command.Group>

                            <Command.Group heading={t("cmd.socials")} className={GROUP_STYLE}>
                                {SOCIALS.map((s) => (
                                    <CmdItem key={s.label} icon={<s.icon size={15} />} suffix={<ArrowUpRight size={12} className="text-[#5F564D]" />} desc={t("cmd.open_social", { label: s.label })} onSelect={() => run(() => window.open(s.url, "_blank"))}>
                                        {s.label}
                                    </CmdItem>
                                ))}
                            </Command.Group>
                        </Command.List>
                    </div>

                    <div className="border-t border-[#493B33]/35 px-5 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5F564D]">
                            <kbd className="border border-[#493B33]/50 rounded px-1 py-0.5 bg-[#251E18]/60">↑↓</kbd>
                            <span>{t("cmd.hint_navigate")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-[#5F564D]">
                            <span className="flex items-center gap-1.5">
                                <kbd className="border border-[#493B33]/50 rounded px-1 py-0.5 bg-[#251E18]/60">↵</kbd>
                                {t("cmd.hint_select")}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="border border-[#493B33]/50 rounded px-1 py-0.5 bg-[#251E18]/60">esc</kbd>
                                {t("cmd.hint_close")}
                            </span>
                        </div>
                    </div>
                </Command>
            </div>
        </div>
    );
}

const GROUP_STYLE = "[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[#5F564D] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] mt-1";

function CmdItem({ children, icon, desc, suffix, kbd: kbdHint, onSelect }: {
    children: React.ReactNode; icon: React.ReactNode; desc?: string; suffix?: React.ReactNode; kbd?: string; onSelect: () => void;
}) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#B39F85] cursor-pointer hover:bg-[#251E18]/60 hover:text-[#DBC7A6] aria-selected:bg-[#DBC7A6]/[0.07] aria-selected:text-[#DBC7A6] transition-all duration-150 group"
        >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#251E18]/60 border border-[#493B33]/45 text-[#7D6B56] group-aria-selected:text-[#DBC7A6] group-aria-selected:border-[#DBC7A6]/25 group-aria-selected:bg-[#DBC7A6]/[0.08] transition-all duration-150 shrink-0">
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                <span className="block truncate font-medium">{children}</span>
                {desc && <span className="block text-[11px] text-[#5F564D] truncate group-aria-selected:text-[#7D6B56] transition-colors">{desc}</span>}
            </div>
            {kbdHint && <kbd className="hidden sm:inline-flex shrink-0 ml-auto text-[10px] font-mono text-[#5F564D] border border-[#493B33]/50 rounded px-1.5 py-0.5 bg-[#251E18]/60">{kbdHint}</kbd>}
            {suffix && <span className="shrink-0 ml-auto">{suffix}</span>}
        </Command.Item>
    );
}
