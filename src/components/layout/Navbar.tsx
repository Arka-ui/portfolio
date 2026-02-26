"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import LanguageSelector from "@/components/features/LanguageSelector";
import { cn } from "@/lib/utils";
import { useWarp } from "@/context/WarpContext";

const NAV_ITEMS = [
    { label: "Home",     href: "#",           id: "hero"        },
    { label: "About",    href: "#about-intro", id: "about-intro" },
    { label: "Work",     href: "#projects",    id: "projects"    },
    { label: "Contact",  href: "#contact",     id: "contact"     },
];

export default function Navbar() {
    const [scrolled, setScrolled]       = useState(false);
    const [mounted, setMounted]         = useState(false);
    const [mobileOpen, setMobileOpen]   = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const { warpTo } = useWarp();

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        NAV_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
            );
            observer.observe(el);
            observers.push(observer);
        });
        return () => observers.forEach((o) => o.disconnect());
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
                        ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.06]"
                        : "bg-transparent"
                )}
            >
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Logo */}
                        <button
                            onClick={() => warpTo("#")}
                            className="font-heading font-black text-xl tracking-tighter text-white hover:text-indigo-300 transition-colors duration-200"
                        >
                            Arka<span className="text-indigo-400">.</span>
                        </button>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {NAV_ITEMS.map((item) => {
                                const active = activeSection === item.id;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => warpTo(item.href)}
                                        className={cn(
                                            "relative text-sm font-medium transition-colors duration-200 py-1",
                                            active ? "text-white" : "text-white/40 hover:text-white/75"
                                        )}
                                    >
                                        {item.label}
                                        {active && (
                                            <motion.span
                                                layoutId="nav-underline"
                                                className="absolute bottom-0 left-0 right-0 h-px bg-indigo-400"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={openCmdPalette}
                                aria-label="Open command palette"
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:border-white/15 transition-all text-white/40 hover:text-white/70"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <kbd className="text-[11px] font-mono">⌘K</kbd>
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
                        className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/96 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
                    >
                        <nav className="container mx-auto px-6 py-6 flex flex-col gap-0">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => { warpTo(item.href); setMobileOpen(false); }}
                                    className={cn(
                                        "text-left py-4 text-base font-medium transition-colors duration-200 border-b border-white/[0.04] last:border-0",
                                        activeSection === item.id ? "text-white" : "text-white/40 hover:text-white/75"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
