"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Briefcase, Mail, Terminal, Menu, X, Cpu, Search, Command } from "lucide-react";
import { useBlueprint } from "@/context/BlueprintContext";
import QuantumDock from "@/components/ui/QuantumDock";
import SpectralBorder from "@/components/ui/SpectralBorder";
import LanguageSelector from "@/components/LanguageSelector";
import SystemTicker from "@/components/ui/SystemTicker"; // Import HUD
import { cn } from "@/lib/utils";
import { useLanyard } from "@/hooks/useLanyard";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

const DISCORD_ID = "871084043838566400"; // Ensure this matches everywhere

export default function Navbar() {
    const { t } = useLanguage();

    // Dynamic nav items based on language
    const navItems = [
        { title: t("nav.home"), icon: <Home className="w-5 h-5" />, href: "#" },
        { title: t("nav.about"), icon: <User className="w-5 h-5" />, href: "#about" },
        { title: t("nav.projects"), icon: <Briefcase className="w-5 h-5" />, href: "#projects" },
        { title: t("nav.contact"), icon: <Mail className="w-5 h-5" />, href: "#contact" },
    ];

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isBlueprintMode, toggleBlueprintMode } = useBlueprint();
    const { data: lanyardData } = useLanyard(DISCORD_ID);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const { warpTo } = useWarp();
    const [isIdle, setIsIdle] = useState(false);

    // Awareness Engine
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const resetIdle = () => {
            setIsIdle(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsIdle(true), 5000);
        };
        window.addEventListener("mousemove", resetIdle);
        return () => {
            window.removeEventListener("mousemove", resetIdle);
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [activeSection, setActiveSection] = useState("Home");

    // Center-Point Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            const viewportCenter = window.innerHeight / 2;
            const sections = document.querySelectorAll("section[id]");
            let currentSection = t("nav.home"); // Default to Home

            // Find section closest to center
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                // If section covers the center of the screen
                if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                    const id = section.id;
                    // Map ID to Title
                    if (id === "hero") currentSection = t("nav.home");
                    else if (id === "about") currentSection = t("nav.about");
                    else if (id === "projects") currentSection = t("nav.projects");
                    else if (id === "contact") currentSection = t("nav.contact");
                }
            });

            // Special case for top of page (Hero might be too large)
            if (window.scrollY < 100) currentSection = t("nav.home");

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);

        // Need to run on language change too
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [t]);

    if (!mounted) return null;

    // Trigger Command Palette with generic event if needed, but the Palette listens to keys.
    // We can also trigger it by simulating keypress or exposing a state, 
    // but for now let's just show the visual cue that it exists.
    const openCommandPalette = () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    };

    return (
        <>
            {/* Desktop Sentient Dock */}
            {/* Materialization: Wait 1s then assemble */}
            <motion.div
                initial={{ y: -100, opacity: 0, scaleX: 0.8 }}
                animate={{ y: 0, opacity: 1, scaleX: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.5,
                    opacity: { duration: 1.5 }, // Slow fade in for "Printing" feel
                }}
                className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none"
            >
                <div className="pointer-events-auto flex items-center gap-4">

                    {/* Command Module Button */}
                    <button
                        onClick={openCommandPalette}
                        className={cn(
                            "group flex items-center gap-2 px-4 h-16 rounded-2xl bg-slate-900/50 backdrop-blur-2xl border border-white/5 transition-all duration-500 hover:bg-white/10 hover:border-white/10",
                            scrolled ? "scale-90" : "scale-100"
                        )}
                    >
                        <Search className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        <span className="hidden lg:flex items-center gap-1 text-xs font-mono text-slate-500 group-hover:text-slate-300">
                            <span className="text-xs">⌘</span>K
                        </span>
                    </button>

                    {/* Central Dock with Sentient Border */}
                    <SpectralBorder className="rounded-2xl">
                        <QuantumDock
                            items={navItems}
                            activeTab={activeSection}
                            onWarp={(href) => warpTo(href)}
                            className={cn(
                                "transition-all duration-500",
                                scrolled ? "scale-90 bg-slate-900/80" : "scale-100"
                            )}
                        />
                    </SpectralBorder>

                    {/* Live Telemetry / System Ticker */}
                    <div className={cn(
                        "h-16 px-4 rounded-2xl bg-slate-900/50 backdrop-blur-2xl border border-white/5 flex flex-col justify-center items-end transition-all duration-500 overflow-hidden",
                        scrolled ? "scale-90" : "scale-100"
                    )}>
                        <SystemTicker />
                    </div>
                </div>

                {/* Satellite Controls */}
                <div className="absolute top-2 right-8 pointer-events-auto flex items-center gap-4">
                    <div className="relative group">
                        <button
                            onClick={toggleBlueprintMode}
                            className={cn(
                                "p-3 rounded-full transition-all duration-300 backdrop-blur-md border",
                                isBlueprintMode
                                    ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                    : "bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/80"
                            )}
                            title="Toggle Blueprint Mode"
                        >
                            <Terminal size={20} />
                        </button>
                        {isBlueprintMode && (
                            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-500 bg-black/80 px-2 py-1 rounded border border-amber-500/30 whitespace-nowrap">
                                DEBUG_MODE
                            </span>
                        )}
                    </div>

                    <div className="className">
                        <LanguageSelector />
                    </div>
                </div>

                {/* Sentient Eye (Logo) */}
                <div className="absolute top-2 left-8 pointer-events-auto">
                    <button onClick={() => warpTo("#")} className="group relative flex items-center gap-3">
                        <div className={cn(
                            "relative w-12 h-12 rounded-full bg-slate-900/50 border flex items-center justify-center overflow-hidden backdrop-blur-md transition-colors duration-500",
                            isIdle ? "border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "border-white/10"
                        )}>
                            <div className={cn(
                                "absolute inset-0 blur-xl transition-all duration-1000",
                                isIdle ? "bg-indigo-500/10" : "bg-cyan-500/0"
                            )} />

                            {/* The Eye */}
                            <motion.div
                                animate={isIdle ? "idle" : "active"}
                                variants={{
                                    idle: { scale: 0.9, rotate: 0, opacity: 0.5 },
                                    active: { scale: 1.1, rotate: 180, opacity: 1 }
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <Cpu className={cn(
                                    "w-6 h-6 transition-colors duration-500",
                                    isIdle ? "text-indigo-500" : "text-cyan-400 group-hover:text-white"
                                )} />
                            </motion.div>

                            {/* Music Pulse Ring */}
                            {lanyardData?.spotify && (
                                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-ping opacity-20" />
                            )}
                        </div>

                        <div className="flex flex-col text-left">
                            <span className="font-heading font-bold text-xl tracking-tighter text-white">
                                Arka<span className="text-indigo-400">.dev</span>
                            </span>
                            <span className={cn(
                                "text-[10px] font-mono tracking-widest uppercase transition-all duration-300",
                                isIdle ? "text-indigo-500 opacity-100" : "text-slate-400 opacity-0 group-hover:opacity-100"
                            )}>
                                {isIdle ? "SLEEP MODE" : "ONLINE"}
                            </span>
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu (Simplified) */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-3 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white shadow-lg active:scale-95 transition-transform"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed inset-4 z-40 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-6 shadow-2xl md:hidden"
                    >
                        {navItems.map((item) => (
                            <button
                                key={item.title}
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    warpTo(item.href);
                                }}
                                className="flex items-center gap-4 text-2xl font-medium text-slate-300 active:text-white"
                            >
                                <div className="p-3 rounded-xl bg-white/5">
                                    {item.icon}
                                </div>
                                {item.title}
                            </button>
                        ))}
                        <div className="h-px bg-white/10 w-full my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Settings</span>
                            <button
                                onClick={toggleBlueprintMode}
                                className={cn(
                                    "p-2 rounded-lg border",
                                    isBlueprintMode ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-white/5 border-transparent text-slate-300"
                                )}
                            >
                                <Terminal size={20} />
                            </button>
                        </div>
                        <LanguageSelector />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
