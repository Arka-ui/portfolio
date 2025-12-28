"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Briefcase, Mail, Terminal, Menu, X, Cpu } from "lucide-react";
import { useBlueprint } from "@/context/BlueprintContext";
import QuantumDock from "@/components/ui/QuantumDock";
import SpectralBorder from "@/components/ui/SpectralBorder";
import LanguageSelector from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";
import { useLanyard } from "@/hooks/useLanyard";

const DISCORD_ID = "871084043838566400"; // Ensure this matches everywhere

const navItems = [
    { title: "Home", icon: <Home className="w-5 h-5" />, href: "/" },
    { title: "About", icon: <User className="w-5 h-5" />, href: "/#about" },
    { title: "Projects", icon: <Briefcase className="w-5 h-5" />, href: "/#projects" },
    { title: "Contact", icon: <Mail className="w-5 h-5" />, href: "/#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isBlueprintMode, toggleBlueprintMode } = useBlueprint();
    const { data: lanyardData } = useLanyard(DISCORD_ID);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Active tab logic based on hash or path
    // Simple approximation
    const activeTab = navItems.find(item => item.href === pathname || (typeof window !== 'undefined' && item.href === window.location.hash))?.title || "Home";

    if (!mounted) return null;

    return (
        <>
            {/* Desktop Quantum Dock */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
                className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none"
            >
                <div className="pointer-events-auto">
                    <SpectralBorder className="rounded-2xl">
                        <QuantumDock
                            items={navItems}
                            activeTab={activeTab}
                            className={cn(
                                "transition-all duration-500",
                                scrolled ? "scale-90 bg-slate-900/80" : "scale-100"
                            )}
                        />
                    </SpectralBorder>
                </div>

                {/* Satellite Controls (Language & Blueprint) */}
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

                {/* Logo / Identity (Left Side) - The "Eye" */}
                <div className="absolute top-2 left-8 pointer-events-auto">
                    <Link href="/" className="group relative flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full bg-slate-900/50 border border-white/10 flex items-center justify-center overflow-hidden backdrop-blur-md">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl group-hover:bg-indigo-400/30 transition-colors duration-500" />
                            <Cpu className="text-indigo-400 w-6 h-6 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />

                            {/* Music Pulse Ring */}
                            {lanyardData?.spotify && (
                                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-ping opacity-20" />
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="font-heading font-bold text-xl tracking-tighter text-white">
                                Arka<span className="text-indigo-400">.dev</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                Systems Online
                            </span>
                        </div>
                    </Link>
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
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-4 text-2xl font-medium text-slate-300 active:text-white"
                            >
                                <div className="p-3 rounded-xl bg-white/5">
                                    {item.icon}
                                </div>
                                {item.title}
                            </Link>
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
