"use client";

import { Home, User, Briefcase, Mail, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useWarp } from "@/context/WarpContext";
import { useHaptics } from "@/hooks/useHaptics";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const SECTION_MAP: Record<string, string> = {
    "hero":        "home",
    "about-intro": "about",
    "projects":    "projects",
    "contact":     "contact",
};

export default function MobileHUD() {
    const { warpTo } = useWarp();
    const { triggerHaptic } = useHaptics();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("home");
    const [sectionProgress, setSectionProgress] = useState(0);
    const [quickActions, setQuickActions] = useState(false);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const sections = Object.keys(SECTION_MAP)
            .map(id => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible) {
                    const tab = SECTION_MAP[visible.target.id];
                    if (tab) setActiveTab(tab);
                }
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.1, 0.5, 1] }
        );

        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Section progress within the currently visible section
    useEffect(() => {
        let raf = 0;
        const activeSectionId = Object.entries(SECTION_MAP).find(([, v]) => v === activeTab)?.[0];
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                if (!activeSectionId) { raf = 0; return; }
                const el = document.getElementById(activeSectionId);
                if (!el) { raf = 0; return; }
                const rect = el.getBoundingClientRect();
                const vh = window.innerHeight;
                const total = rect.height + vh * 0.6;
                const scrolled = Math.max(0, vh * 0.3 - rect.top);
                setSectionProgress(Math.min(1, Math.max(0, scrolled / total)));
                raf = 0;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [activeTab]);

    const navItems = [
        { id: "home",     icon: Home,      label: t("nav.home"),     href: "#"            },
        { id: "about",    icon: User,      label: t("nav.about"),    href: "#about-intro" },
        { id: "cmd",      icon: Command,   label: "⌘K",              href: "__cmd"        },
        { id: "projects", icon: Briefcase, label: t("nav.projects"), href: "#projects"    },
        { id: "contact",  icon: Mail,      label: t("nav.contact"),  href: "#contact"     },
    ];

    const openCmdPalette = () =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

    const handleNav = (id: string, href: string) => {
        triggerHaptic("light");
        if (href === "__cmd") { openCmdPalette(); return; }
        setActiveTab(id);
        warpTo(href);
    };

    const handleLongPressStart = (id: string) => {
        if (id !== activeTab || id === "cmd") return;
        longPressTimer.current = setTimeout(() => {
            triggerHaptic("medium");
            setQuickActions(true);
        }, 500);
    };
    const handleLongPressEnd = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };

    const quickActionItems = [
        { label: "Top",   fn: () => { triggerHaptic("light"); warpTo("#"); setQuickActions(false); } },
        { label: "Copy",  fn: () => { triggerHaptic("light"); navigator.clipboard?.writeText(window.location.href); setQuickActions(false); } },
        { label: "Share", fn: () => { triggerHaptic("light"); navigator.share?.({ url: window.location.href }).catch(() => {}); setQuickActions(false); } },
    ];

    return (
        <>
            <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 24, delay: 1.2 }}
                className="fixed md:hidden z-50 will-change-transform"
                style={{
                    bottom: "max(1.25rem, env(safe-area-inset-bottom, 20px))",
                    left: "1rem",
                    right: "1rem",
                    height: "66px",
                }}
            >
                {/* Shell */}
                <div className="absolute inset-0 rounded-[28px] bg-[#1B1814]/92 backdrop-blur-2xl border border-[#493B33]/55 shadow-[0_14px_52px_rgba(0,0,0,0.6)] overflow-hidden">
                    {/* Top progress track */}
                    <div className="absolute top-0 left-5 right-5 h-[2px] rounded-full bg-[#493B33]/40 overflow-hidden">
                        <div
                            className="h-full origin-left"
                            style={{
                                width: "100%",
                                background: "linear-gradient(90deg, #DBC7A6 0%, #B39F85 60%, #7D6B56 100%)",
                                transform: `scaleX(${sectionProgress})`,
                                transformOrigin: "left",
                                transition: "transform 0.12s linear"
                            }}
                        />
                    </div>
                    {/* Subtle top gradient bloom */}
                    <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#DBC7A6]/25 to-transparent" />
                </div>

                <div className="relative h-full flex items-center px-1.5">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        const isCmd = item.id === "cmd";

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id, item.href)}
                                onTouchStart={() => handleLongPressStart(item.id)}
                                onTouchEnd={handleLongPressEnd}
                                onTouchCancel={handleLongPressEnd}
                                className="relative flex-1 h-full flex flex-col items-center justify-center gap-[3px] min-w-[44px]"
                                aria-label={item.label}
                                aria-current={isActive && !isCmd ? "page" : undefined}
                            >
                                {isActive && !isCmd && (
                                    <motion.div
                                        layoutId="hud-pill"
                                        className="absolute inset-x-1 inset-y-2 rounded-2xl bg-[#DBC7A6]/[0.07] border border-[#B39F85]/25"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                                    />
                                )}

                                {isCmd && (
                                    <div className="absolute inset-x-1.5 inset-y-2 rounded-2xl bg-gradient-to-br from-[#DBC7A6]/[0.1] to-[#493B33]/30 border border-[#B39F85]/30" />
                                )}

                                <motion.div
                                    animate={isActive && !isCmd ? { y: -2, scale: 1.12 } : { y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                    className={cn(
                                        "relative z-10 transition-colors duration-200",
                                        isCmd ? "text-[#DBC7A6]" : isActive ? "text-[#DBC7A6]" : "text-[#5F564D]"
                                    )}
                                >
                                    <Icon size={isCmd ? 17 : 19} strokeWidth={isActive || isCmd ? 2.1 : 1.7} />
                                </motion.div>

                                {!isCmd && (
                                    <motion.span
                                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                                        transition={{ duration: 0.2 }}
                                        className={cn(
                                            "relative z-10 text-[9px] font-mono tracking-wider uppercase",
                                            isActive ? "text-[#DBC7A6]" : "text-[#5F564D]"
                                        )}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}

                                {isActive && !isCmd && (
                                    <motion.div
                                        layoutId="hud-pip"
                                        className="absolute -bottom-0.5 w-4 h-[2px] rounded-full"
                                        style={{
                                            background: "linear-gradient(135deg, #DBC7A6 0%, #B39F85 50%, #7D6B56 100%)",
                                            boxShadow: "0 0 10px rgba(219,199,166,0.45)"
                                        }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Long-press quick actions bubble */}
            <AnimatePresence>
                {quickActions && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.9 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed md:hidden z-[55]"
                        style={{ bottom: "calc(6rem + env(safe-area-inset-bottom, 20px))", left: "50%", transform: "translateX(-50%)" }}
                        onClick={() => setQuickActions(false)}
                    >
                        <div className="flex flex-col items-stretch gap-1 rounded-2xl border border-[#493B33]/60 bg-[#1B1814]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-1.5 min-w-[160px]">
                            {quickActionItems.map((qa) => (
                                <button
                                    key={qa.label}
                                    onClick={qa.fn}
                                    className="px-4 py-2.5 rounded-xl text-left text-[13px] font-medium text-[#DBC7A6]/85 hover:text-[#DBC7A6] hover:bg-[#251E18]/80 transition-colors"
                                >
                                    {qa.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
