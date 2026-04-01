"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import LanguageSelector from "@/components/features/LanguageSelector";
import { cn } from "@/lib/utils";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const [scrolled, setScrolled]           = useState(false);
    const [mounted, setMounted]             = useState(false);
    const [mobileOpen, setMobileOpen]       = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const { warpTo }  = useWarp();
    const { t }       = useLanguage();

    const NAV_ITEMS = [
        { label: t("nav.home"),    href: "#",            id: "hero"        },
        { label: t("nav.about"),   href: "#about-intro",  id: "about-intro" },
        { label: t("nav.work"),    href: "#projects",     id: "projects"    },
        { label: t("nav.stack"),   href: "#skills",       id: "skills"      },
        { label: t("nav.live"),    href: "#live",          id: "live"        },
        { label: t("nav.contact"), href: "#contact",      id: "contact"     },
    ];

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const mid = window.innerHeight / 2;
            let current = "hero";
            document.querySelectorAll("section[id]").forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= mid) current = sec.id;
            });
            if (window.scrollY < 80) current = "hero";
            setActiveSection(current);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const openCmdPalette = () =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

    if (!mounted) return null;

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    scrolled
                        ? "bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/[0.05]"
                        : "bg-transparent"
                )}
            >
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => warpTo("#")}
                                className="font-heading font-black text-xl tracking-tighter text-white hover:text-amber-300 transition-colors duration-200"
                            >
                                Arka<span className="text-amber-500">.</span>
                            </button>
                            <AnimatePresence mode="wait">
                                {scrolled && activeSection !== "hero" && (() => {
                                    const activeItem = NAV_ITEMS.find(n => n.id === activeSection);
                                    return activeItem ? (
                                        <motion.span
                                            key={activeItem.id}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 6 }}
                                            transition={{ duration: 0.18 }}
                                            className="hidden md:block label-mono text-white/20 select-none"
                                        >
                                            / {activeItem.label}
                                        </motion.span>
                                    ) : null;
                                })()}
                            </AnimatePresence>
                        </div>

                        {/* Desktop nav — pill style */}
                        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl">
                            {NAV_ITEMS.map((item) => {
                                const active = activeSection === item.id;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => warpTo(item.href)}
                                        className={cn(
                                            "relative px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200",
                                            active
                                                ? "text-white"
                                                : "text-white/35 hover:text-white/65"
                                        )}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-xl"
                                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                            />
                                        )}
                                        <span className="relative z-10">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Right */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={openCmdPalette}
                                aria-label="Open command palette"
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-amber-500/15 transition-all text-white/35 hover:text-white/60"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <kbd className="text-[10px] font-mono">⌘K</kbd>
                            </button>
                            <LanguageSelector />
                            <button
                                onClick={() => setMobileOpen(v => !v)}
                                aria-label="Toggle menu"
                                className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-16 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-2xl border-b border-white/[0.05] md:hidden"
                    >
                        <nav className="container mx-auto px-6 py-6 flex flex-col gap-0">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => { warpTo(item.href); setMobileOpen(false); }}
                                    className={cn(
                                        "text-left py-4 text-base font-medium transition-colors duration-200 border-b border-white/[0.04] last:border-0 flex items-center justify-between",
                                        activeSection === item.id ? "text-white" : "text-white/35 hover:text-white/65"
                                    )}
                                >
                                    {item.label}
                                    {activeSection === item.id && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
