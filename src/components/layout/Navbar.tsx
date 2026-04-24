"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
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
    const [caretOn, setCaretOn]             = useState(true);
    const lastY = useRef(0);
    const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { warpTo }  = useWarp();
    const { t }       = useLanguage();

    // Rail items map to real section ids. "about" (Timeline) is merged into the
    // about-intro dot so the "About" pip stays lit while scrolling through both.
    const NAV_ITEMS = [
        { label: t("nav.home"),    href: "#",            id: "hero",         merge: [] as string[] },
        { label: t("nav.about"),   href: "#about-intro", id: "about-intro",  merge: ["about"] },
        { label: t("nav.work"),    href: "#projects",    id: "projects",     merge: ["news"] },
        { label: t("nav.stack"),   href: "#skills",      id: "skills",       merge: [] },
        { label: t("nav.live"),    href: "#live",        id: "live",         merge: [] },
        { label: t("nav.contact"), href: "#contact",     id: "contact",      merge: [] },
    ];

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const t = setTimeout(() => setCaretOn(false), 4200);
        return () => clearTimeout(t);
    }, []);

    // Build the ordered list of section ids to scan, plus a map from DOM id -> rail id.
    // Timeline's own id ("about") resolves to the "about-intro" rail dot.
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
                // Hide mobile top strip on scroll down, show on scroll up
                if (y > lastY.current + 6 && y > 120) setHidden(true);
                else if (y < lastY.current - 4) setHidden(false);
                lastY.current = y;

                // Active section detection — pivot at ~35% of viewport so the next
                // dot lights up as soon as a new section crosses the top third,
                // and only sections in NAV_IDS are considered (no stray ids).
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

    const openCmdPalette = () =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

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

    const activeItem = NAV_ITEMS.find(n => n.id === activeSection);

    if (!mounted) return null;

    return (
        <>
            {/* ─── Desktop: vertical side rail ─── */}
            <motion.aside
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-[72px] pointer-events-none flex-col items-center justify-between py-8"
            >
                {/* Logo wordmark top */}
                <button
                    onClick={() => { handleLogoDotTap(); warpTo("#"); }}
                    className="pointer-events-auto font-display font-bold text-sm tracking-tight text-[#DBC7A6] hover:text-[#B39F85] transition-colors duration-300"
                >
                    Arka<span className="text-[#B39F85] inline-block">.</span>
                    {caretOn && activeSection === "hero" && <span className="caret" />}
                </button>

                {/* Rail items */}
                <nav className="pointer-events-auto relative flex flex-col items-center gap-7 py-4">
                    {/* Vertical hairline spans only the item cluster */}
                    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-[#493B33]/45" />
                    {/* Scroll progress fill */}
                    <div
                        className="absolute left-1/2 top-0 -translate-x-1/2 w-px bg-gradient-to-b from-[#DBC7A6] via-[#B39F85] to-[#7D6B56]"
                        style={{ height: "100%", transform: `translateX(-50%) scaleY(${scrollProgress})`, transformOrigin: "top" }}
                    />
                    {NAV_ITEMS.map((item, idx) => {
                        const active = activeSection === item.id;
                        return (
                            <button
                                key={item.href}
                                onClick={() => warpTo(item.href)}
                                aria-label={item.label}
                                aria-current={active ? "page" : undefined}
                                className="group relative flex items-center"
                            >
                                {/* Outer ring — visible on hover/active for better tap affordance */}
                                <span
                                    className={cn(
                                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500",
                                        active
                                            ? "w-5 h-5 border-[#DBC7A6]/30"
                                            : "w-4 h-4 border-transparent group-hover:border-[#B39F85]/25"
                                    )}
                                />
                                {/* Dot */}
                                <span
                                    className={cn(
                                        "relative z-10 rounded-full transition-all duration-300",
                                        active
                                            ? "w-2.5 h-2.5 bg-[#DBC7A6] shadow-[0_0_16px_rgba(219,199,166,0.6)]"
                                            : "w-1.5 h-1.5 bg-[#5F564D] group-hover:bg-[#B39F85] group-hover:scale-125"
                                    )}
                                />
                                {/* Label + index slide-out */}
                                <span
                                    className={cn(
                                        "absolute left-6 whitespace-nowrap flex items-center gap-2 transition-all duration-300 pointer-events-none",
                                        active
                                            ? "opacity-100 translate-x-0"
                                            : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                    )}
                                >
                                    <span className={cn(
                                        "font-mono text-[9px] tracking-wider",
                                        active ? "text-[#7D6B56]" : "text-[#5F564D]"
                                    )}>
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <span className={cn(
                                        "font-mono uppercase tracking-[0.22em] text-[10px]",
                                        active ? "text-[#DBC7A6]" : "text-[#B39F85]"
                                    )}>
                                        {item.label}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom cluster: ⌘K + language — direction up so popovers open above */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                    className="pointer-events-auto flex flex-col items-center gap-3"
                >
                    <motion.button
                        whileHover={{ y: -2, scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22 }}
                        onClick={openCmdPalette}
                        aria-label="Open command palette"
                        className="w-8 h-8 rounded-full border border-[#493B33]/60 bg-[#1B1814]/70 backdrop-blur-xl flex items-center justify-center text-[#7D6B56] hover:text-[#DBC7A6] hover:border-[#B39F85]/40 transition-colors"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </motion.button>
                    <LanguageSelector align="left" variant="bare" direction="up" />
                </motion.div>
            </motion.aside>

            {/* ─── Mobile: slim top strip ─── */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: hidden ? -60 : 0, opacity: hidden ? 0 : 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "md:hidden fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-4",
                    scrolledDown
                        ? "bg-[#13110E]/80 backdrop-blur-xl border-b border-[#493B33]/30"
                        : "bg-transparent"
                )}
            >
                <button
                    onClick={() => { handleLogoDotTap(); warpTo("#"); }}
                    className="font-display font-bold text-[15px] tracking-tight text-[#DBC7A6]"
                >
                    Arka<span className="text-[#B39F85]">.</span>
                </button>

                <AnimatePresence mode="wait">
                    {activeItem && activeItem.id !== "hero" && (
                        <motion.span
                            key={activeItem.id}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 label-mono text-[#7D6B56]"
                        >
                            / {activeItem.label}
                        </motion.span>
                    )}
                </AnimatePresence>

                <div className="flex-1" />

                <button
                    onClick={openCmdPalette}
                    aria-label="Open command palette"
                    className="w-8 h-8 rounded-full border border-[#493B33]/60 bg-[#1B1814]/70 backdrop-blur-xl flex items-center justify-center text-[#7D6B56] hover:text-[#DBC7A6] transition-colors"
                >
                    <Search className="w-3.5 h-3.5" />
                </button>
            </motion.header>

            {/* Mobile progress line under top strip */}
            <motion.div
                className="md:hidden fixed left-0 right-0 z-50 h-px origin-left pointer-events-none"
                style={{
                    top: 48,
                    background: "linear-gradient(90deg, #DBC7A6 0%, #B39F85 50%, #7D6B56 100%)",
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
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-5 py-2.5 rounded-full border border-[#B39F85]/40 bg-[#1B1814]/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                    >
                        <span className="font-display text-xs tracking-[0.2em] uppercase text-[#DBC7A6]">
                            crafted with late nights
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
