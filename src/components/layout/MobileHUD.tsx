"use client";

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
        { id: "home",     label: t("nav.home"),     short: "01", href: "#"            },
        { id: "about",    label: t("nav.about"),    short: "02", href: "#about-intro" },
        { id: "cmd",      label: "INDEX",           short: "⌘",  href: "__cmd"        },
        { id: "projects", label: t("nav.projects"), short: "04", href: "#projects"    },
        { id: "contact",  label: t("nav.contact"),  short: "08", href: "#contact"     },
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
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                className="fixed md:hidden z-50 will-change-transform"
                style={{
                    bottom: "max(0.75rem, env(safe-area-inset-bottom, 16px))",
                    left: "0.75rem",
                    right: "0.75rem",
                    height: "52px",
                }}
            >
                {/* Frame: square, hairline border, no rounded capsule */}
                <div className="absolute inset-0 bg-[#13110E]/92 backdrop-blur-xl border border-[#493B33]/55 overflow-hidden">
                    {/* Top progress hairline */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-[#493B33]/40">
                        <div
                            className="h-full origin-left bg-[#DBC7A6]/85"
                            style={{
                                width: "100%",
                                transform: `scaleX(${sectionProgress})`,
                                transformOrigin: "left",
                                transition: "transform 0.12s linear"
                            }}
                        />
                    </div>
                </div>

                <div className="relative h-full flex items-stretch">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const isCmd = item.id === "cmd";

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id, item.href)}
                                onTouchStart={() => handleLongPressStart(item.id)}
                                onTouchEnd={handleLongPressEnd}
                                onTouchCancel={handleLongPressEnd}
                                className={cn(
                                    "relative flex-1 flex flex-col items-center justify-center gap-1 min-w-[44px] transition-colors duration-200",
                                    isCmd
                                        ? "text-[#DBC7A6] border-l border-r border-[#493B33]/55"
                                        : isActive
                                            ? "text-[#DBC7A6]"
                                            : "text-[#5F564D]"
                                )}
                                aria-label={item.label}
                                aria-current={isActive && !isCmd ? "page" : undefined}
                            >
                                <span className="font-mono text-[10px] tabular-nums leading-none">
                                    {item.short}
                                </span>
                                <span className={cn(
                                    "font-mono text-[8.5px] uppercase tracking-[0.18em] leading-none",
                                    isActive || isCmd ? "opacity-100" : "opacity-70"
                                )}>
                                    {item.label}
                                </span>
                                {/* Active underline */}
                                {isActive && !isCmd && (
                                    <motion.div
                                        layoutId="hud-underline"
                                        className="absolute bottom-1 h-px w-6 bg-[#DBC7A6]"
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            <AnimatePresence>
                {quickActions && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed md:hidden z-[55]"
                        style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom, 16px))", left: "50%", transform: "translateX(-50%)" }}
                        onClick={() => setQuickActions(false)}
                    >
                        <div className="flex flex-col items-stretch gap-px border border-[#493B33]/60 bg-[#1B1814]/95 backdrop-blur-2xl min-w-[160px]">
                            {quickActionItems.map((qa) => (
                                <button
                                    key={qa.label}
                                    onClick={qa.fn}
                                    className="px-4 py-2.5 text-left text-[12px] font-mono uppercase tracking-[0.2em] text-[#DBC7A6]/85 hover:text-[#DBC7A6] hover:bg-[#251E18]/80 transition-colors"
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
