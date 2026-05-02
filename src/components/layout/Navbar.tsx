"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "@/components/features/LanguageSelector";
import { cn } from "@/lib/utils";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const [mounted, setMounted]             = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrolledDown, setScrolledDown]   = useState(false);
    const [hidden, setHidden]               = useState(false);
    const [tapCount, setTapCount]           = useState(0);
    const [easterEgg, setEasterEgg]         = useState(false);
    const lastY = useRef(0);
    const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { warpTo }  = useWarp();
    const { t }       = useLanguage();

    const NAV_ITEMS = [
        { label: t("nav.home"),    href: "#",            id: "hero",         merge: [] as string[] },
        { label: t("nav.about"),   href: "#about-intro", id: "about-intro",  merge: ["about"] },
        { label: t("nav.work"),    href: "#projects",    id: "projects",     merge: ["news"] },
        { label: t("nav.stack"),   href: "#skills",      id: "skills",       merge: [] },
        { label: t("nav.live"),    href: "#live",        id: "live",         merge: [] },
        { label: t("nav.contact"), href: "#contact",     id: "contact",      merge: [] },
    ];

    useEffect(() => { setMounted(true); }, []);

    const NAV_IDS = ["hero", "about-intro", "about", "projects", "news", "skills", "live", "contact"];
    const RAIL_RESOLVE: Record<string, string> = { about: "about-intro", news: "projects" };

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const y = window.scrollY;
                const h = document.documentElement.scrollHeight - window.innerHeight;
                setScrollProgress(h > 0 ? Math.min(1, y / h) : 0);
                setScrolledDown(y > 80);
                if (y > lastY.current + 6 && y > 120) setHidden(true);
                else if (y < lastY.current - 4) setHidden(false);
                lastY.current = y;

                const pivot = window.innerHeight * 0.35;
                let currentDomId = "hero";
                for (const id of NAV_IDS) {
                    const sec = document.getElementById(id);
                    if (!sec) continue;
                    const rect = sec.getBoundingClientRect();
                    if (rect.top <= pivot) currentDomId = id;
                }
                if (y < 80) currentDomId = "hero";
                const resolved = RAIL_RESOLVE[currentDomId] ?? currentDomId;
                setActiveSection(resolved);
                raf = 0;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogoDotTap = () => {
        if (tapTimer.current) clearTimeout(tapTimer.current);
        const next = tapCount + 1;
        setTapCount(next);
        if (next >= 5) {
            setEasterEgg(true);
            setTapCount(0);
            setTimeout(() => setEasterEgg(false), 3200);
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate?.([8, 20, 8]);
            }
        } else {
            tapTimer.current = setTimeout(() => setTapCount(0), 900);
        }
    };

    const activeIdx = NAV_ITEMS.findIndex(n => n.id === activeSection);
    const activeItem = NAV_ITEMS[activeIdx >= 0 ? activeIdx : 0];

    if (!mounted) return null;

    return (
        <>
            {/* ─── Desktop: vertical typographic index ─── */}
            <motion.aside
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-[88px] pointer-events-none flex-col items-stretch justify-between pt-12 pb-8"
            >
                {/* Wordmark — top */}
                <div className="flex justify-center px-4">
                    <button
                        onClick={() => { handleLogoDotTap(); warpTo("#"); }}
                        className="pointer-events-auto font-display font-bold text-[15px] tracking-tight text-[#DBC7A6] hover:text-[#B39F85] transition-colors duration-300"
                    >
                        Arka<span className="text-[#B39F85] inline-block">.</span>
                    </button>
                </div>

                {/* Index — middle, vertical numbered list */}
                <nav
                    aria-label="Section index"
                    className="pointer-events-auto relative flex flex-col items-stretch px-4"
                >
                    {/* Vertical hairline */}
                    <div className="absolute left-1/2 top-3 bottom-3 -translate-x-1/2 w-px bg-[#493B33]/35" aria-hidden />
                    {/* Scroll progress fill */}
                    <div
                        aria-hidden
                        className="absolute left-1/2 top-3 -translate-x-1/2 w-px bg-[#DBC7A6]/65"
                        style={{
                            height: `calc((100% - 24px) * ${scrollProgress})`,
                            transition: "height 200ms linear"
                        }}
                    />

                    <ul className="relative flex flex-col gap-3.5">
                        {NAV_ITEMS.map((item, idx) => {
                            const active = activeSection === item.id;
                            return (
                                <li key={item.href} className="flex">
                                    <button
                                        onClick={() => warpTo(item.href)}
                                        aria-label={item.label}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "group relative flex items-center gap-3 w-full font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300",
                                            active ? "text-[#DBC7A6]" : "text-[#5F564D] hover:text-[#B39F85]"
                                        )}
                                    >
                                        {/* Tick on active row */}
                                        <span
                                            aria-hidden
                                            className={cn(
                                                "absolute -left-3 top-1/2 -translate-y-1/2 h-px transition-all duration-300",
                                                active ? "w-2.5 bg-[#DBC7A6]" : "w-0 bg-transparent"
                                            )}
                                        />
                                        <span className="w-7 text-right shrink-0 tabular-nums">
                                            {String(idx + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            className={cn(
                                                "flex-1 whitespace-nowrap transition-all duration-300",
                                                active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom — language selector only */}
                <div className="pointer-events-auto flex justify-center px-4">
                    <LanguageSelector align="left" variant="bare" direction="up" />
                </div>
            </motion.aside>

            {/* ─── Mobile: thin running head + index sheet trigger ─── */}
            <motion.header
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: hidden ? -48 : 0, opacity: hidden ? 0 : 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "md:hidden fixed top-0 left-0 right-0 z-50 h-11 flex items-center px-4 gap-3",
                    scrolledDown
                        ? "bg-[#13110E]/85 backdrop-blur-xl border-b border-[#493B33]/30"
                        : "bg-transparent"
                )}
            >
                <button
                    onClick={() => { handleLogoDotTap(); warpTo("#"); }}
                    className="font-display font-bold text-[14px] tracking-tight text-[#DBC7A6]"
                >
                    Arka<span className="text-[#B39F85]">.</span>
                </button>

                <span className="text-[#5F564D] font-mono text-[10px]">·</span>

                <AnimatePresence mode="wait">
                    <motion.span
                        key={activeItem.id}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 3 }}
                        transition={{ duration: 0.18 }}
                        className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#7D6B56] truncate"
                    >
                        § {String((activeIdx >= 0 ? activeIdx : 0) + 1).padStart(2, "0")} · {activeItem.label}
                    </motion.span>
                </AnimatePresence>

                <div className="flex-1" />

                <button
                    onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
                    aria-label="Open index"
                    className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#7D6B56] hover:text-[#DBC7A6] transition-colors"
                >
                    Index
                </button>
            </motion.header>

            {/* Mobile progress hairline under top strip */}
            <div
                aria-hidden
                className="md:hidden fixed left-0 right-0 z-50 h-px origin-left pointer-events-none bg-[#DBC7A6]/55"
                style={{
                    top: 44,
                    transform: `scaleX(${scrollProgress})`,
                    opacity: scrolledDown && !hidden ? 0.85 : 0,
                    transition: "opacity 0.3s ease"
                }}
            />

            {/* Easter egg banner */}
            <AnimatePresence>
                {easterEgg && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-12 left-1/2 -translate-x-1/2 z-[60] px-5 py-2.5 border border-[#B39F85]/40 bg-[#1B1814]/90 backdrop-blur-xl"
                    >
                        <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#DBC7A6]">
                            crafted with late nights
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
