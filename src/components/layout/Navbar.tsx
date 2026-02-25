"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, Mail, Search } from "lucide-react";
import QuantumDock from "@/components/ui/QuantumDock";
import SpectralBorder from "@/components/ui/SpectralBorder";
import LanguageSelector from "@/components/features/LanguageSelector";
import { cn } from "@/lib/utils";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const { t } = useLanguage();

    const navItems: { title: string; icon: ReactNode; href: string }[] = [
        { title: t("nav.home"), icon: <Home className="w-5 h-5" />, href: "#" },
        { title: t("nav.about"), icon: <User className="w-5 h-5" />, href: "#about" },
        { title: t("nav.projects"), icon: <Briefcase className="w-5 h-5" />, href: "#projects" },
        { title: t("nav.contact"), icon: <Mail className="w-5 h-5" />, href: "#contact" },
    ];

    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { warpTo } = useWarp();
    const [activeSection, setActiveSection] = useState("Home");

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll spy
    useEffect(() => {
        const handleScroll = () => {
            const mid = window.innerHeight / 2;
            const sections = document.querySelectorAll("section[id]");
            let current = t("nav.home");
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= mid && rect.bottom >= mid) {
                    const id = sec.id;
                    if (id === "hero") current = t("nav.home");
                    else if (id === "about" || id === "about-intro") current = t("nav.about");
                    else if (id === "projects") current = t("nav.projects");
                    else if (id === "contact") current = t("nav.contact");
                }
            });
            if (window.scrollY < 100) current = t("nav.home");
            setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [t]);

    const openCommandPalette = () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    };

    if (!mounted) return null;

    return (
        <>
            {/* Desktop dock */}
            <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.3 }}
                className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center gap-3">

                    {/* Logo */}
                    <button
                        onClick={() => warpTo("#")}
                        className={cn(
                            "h-14 px-5 rounded-2xl bg-[#0e0e0e]/80 backdrop-blur-2xl border border-white/[0.07] flex items-center transition-all duration-300",
                            scrolled ? "scale-90" : "scale-100"
                        )}
                    >
                        <span className="font-heading font-black text-lg tracking-tighter text-white">
                            Arka<span className="text-indigo-400">.</span>
                        </span>
                    </button>

                    {/* Main dock */}
                    <SpectralBorder className="rounded-2xl">
                        <QuantumDock
                            items={navItems}
                            activeTab={activeSection}
                            onWarp={(href) => warpTo(href)}
                            className={cn(
                                "transition-all duration-300",
                                scrolled ? "scale-90 bg-[#0e0e0e]/90" : "scale-100"
                            )}
                        />
                    </SpectralBorder>

                    {/* âŒ˜K */}
                    <button
                        onClick={openCommandPalette}
                        className={cn(
                            "group flex items-center gap-2 h-14 px-4 rounded-2xl bg-[#0e0e0e]/80 backdrop-blur-2xl border border-white/[0.07] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06]",
                            scrolled ? "scale-90" : "scale-100"
                        )}
                    >
                        <Search className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                        <kbd className="hidden lg:flex items-center gap-0.5 text-[11px] font-mono text-white/25 group-hover:text-white/40 transition-colors">
                            <span>âŒ˜</span>K
                        </kbd>
                    </button>

                    {/* Language */}
                    <div className={cn("transition-all duration-300", scrolled ? "scale-90" : "scale-100")}>
                        <LanguageSelector />
                    </div>
                </div>
            </motion.div>

            {/* Mobile: language selector top-right */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <LanguageSelector />
            </div>

            <AnimatePresence />
        </>
    );
}
