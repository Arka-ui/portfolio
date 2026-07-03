"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useWarp } from "@/context/WarpContext";
import { useHaptics } from "@/hooks/useHaptics";
import { useLanguage } from "@/context/LanguageContext";
import { useSectionSpy } from "@/hooks/useSectionSpy";
import { SECTION_ORDER, SECTION_NUM } from "@/lib/sections";
import { cn } from "@/lib/utils";

/* Every section resolves to a tab; sections without their own tab keep the
   nearest previous tab lit so the active state never goes stale mid-page. */
const TAB_FOR_SECTION: Record<string, string> = {
    "hero":        "home",
    "instruments": "home",
    "about-intro": "about",
    "about":       "about",
    "projects":    "projects",
    "news":        "projects",
    "skills":      "projects",
    "live":        "projects",
    "contact":     "contact",
};

const LONG_PRESS_MS = 500;

export default function MobileHUD() {
    const { warpTo } = useWarp();
    const { triggerHaptic } = useHaptics();
    const { t } = useLanguage();
    const [pageProgress, setPageProgress] = useState(0);
    const [quickActions, setQuickActions] = useState(false);

    const activeSection = useSectionSpy(SECTION_ORDER);
    const activeTab = TAB_FOR_SECTION[activeSection] ?? "home";

    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const suppressClick = useRef(false);

    /* Page progress hairline — scroll offset only, no layout-forcing reads. */
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                setPageProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
                raf = 0;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const navItems = [
        { id: "home",     label: t("nav.home"),     short: SECTION_NUM["hero"],        href: "#"            },
        { id: "about",    label: t("nav.about"),    short: SECTION_NUM["about-intro"], href: "#about-intro" },
        { id: "cmd",      label: "INDEX",           short: "⌘",                        href: "__cmd"        },
        { id: "projects", label: t("nav.projects"), short: SECTION_NUM["projects"],    href: "#projects"    },
        { id: "contact",  label: t("nav.contact"),  short: SECTION_NUM["contact"],     href: "#contact"     },
    ];

    const openCmdPalette = () =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

    const handleNav = (href: string) => {
        if (suppressClick.current) {
            suppressClick.current = false;
            return;
        }
        triggerHaptic("light");
        if (href === "__cmd") { openCmdPalette(); return; }
        warpTo(href);
    };

    const startLongPress = (id: string) => {
        if (id !== activeTab || id === "cmd") return;
        longPressTimer.current = setTimeout(() => {
            suppressClick.current = true;
            triggerHaptic("medium");
            setQuickActions(true);
        }, LONG_PRESS_MS);
    };
    const cancelLongPress = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const quickActionItems = [
        { label: "Top",   fn: () => { triggerHaptic("light"); warpTo("#"); } },
        { label: "Copy",  fn: () => { triggerHaptic("light"); navigator.clipboard?.writeText(window.location.href); } },
        { label: "Share", fn: () => { triggerHaptic("light"); navigator.share?.({ url: window.location.href }).catch(() => {}); } },
    ];

    return (
        <>
            <motion.nav
                aria-label="Primary"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                className="fixed md:hidden bottom-0 left-0 right-0 z-50 will-change-transform bg-[#13110E]/95 backdrop-blur-xl border-t border-[#493B33]/55"
                style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
                {/* Page-progress hairline along the top edge */}
                <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-[#493B33]/40 -translate-y-px">
                    <div
                        className="h-full bg-[#DBC7A6]/85"
                        style={{
                            width: "100%",
                            transform: `scaleX(${pageProgress})`,
                            transformOrigin: "left",
                            transition: "transform 0.12s linear",
                        }}
                    />
                </div>

                <div className="flex items-stretch h-14">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const isCmd = item.id === "cmd";

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleNav(item.href)}
                                onTouchStart={() => startLongPress(item.id)}
                                onTouchMove={cancelLongPress}
                                onTouchEnd={cancelLongPress}
                                onTouchCancel={cancelLongPress}
                                onContextMenu={(e) => e.preventDefault()}
                                className={cn(
                                    "relative flex-1 flex flex-col items-center justify-center gap-1 min-w-[44px] transition-colors duration-200",
                                    "focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-[#DBC7A6]/60",
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
                                        className="absolute bottom-1.5 h-px w-6 bg-[#DBC7A6]"
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.nav>

            <AnimatePresence>
                {quickActions && (
                    <>
                        {/* Tap-away backdrop */}
                        <div
                            className="fixed inset-0 md:hidden z-[54]"
                            onClick={() => setQuickActions(false)}
                            aria-hidden
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed md:hidden z-[55] left-0 right-0 flex justify-center pointer-events-none"
                            style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom, 0px))" }}
                        >
                            <div className="pointer-events-auto flex flex-col items-stretch gap-px border border-[#493B33]/60 bg-[#1B1814]/95 backdrop-blur-2xl min-w-[160px]">
                                {quickActionItems.map((qa) => (
                                    <button
                                        key={qa.label}
                                        type="button"
                                        onClick={() => { qa.fn(); setQuickActions(false); }}
                                        className="px-4 py-3 text-left text-[12px] font-mono uppercase tracking-[0.2em] text-[#DBC7A6]/85 hover:text-[#DBC7A6] hover:bg-[#251E18]/80 transition-colors"
                                    >
                                        {qa.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
