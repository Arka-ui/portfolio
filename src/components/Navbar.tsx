"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import LanguageSelector from "@/components/LanguageSelector";
import { useBlueprint } from "@/context/BlueprintContext";

const navItems = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const { isBlueprintMode, toggleBlueprintMode } = useBlueprint();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500",
                scrolled ? "pt-4" : "pt-8"
            )}
        >
            <div className={cn(
                "pointer-events-auto relative flex items-center justify-between",
                "bg-slate-950/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl",
                "px-2 py-2 rounded-full transition-all duration-500",
                scrolled ? "w-auto min-w-[300px] gap-2" : "w-[90%] max-w-5xl gap-8 px-6 py-3"
            )}>
                {/* Logo Area */}
                <div className={cn("flex items-center gap-2", scrolled && "hidden md:flex")}>
                    <div className="relative group overflow-hidden rounded-full p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                        <Cpu className="w-5 h-5 text-indigo-400 group-hover:animate-spin-slow transition-transform" />
                        <div className="absolute inset-0 bg-indigo-500/20 blur-md group-hover:bg-indigo-400/30 transition-colors" />
                    </div>
                    {!scrolled && (
                        <span className="font-heading font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Arka<span className="text-indigo-500">.dev</span>
                        </span>
                    )}
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center bg-slate-900/50 rounded-full p-1 border border-white/5">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onMouseEnter={() => setHoveredTab(item.name)}
                            onMouseLeave={() => setHoveredTab(null)}
                            className={cn(
                                "relative px-5 py-2 text-sm font-medium transition-colors rounded-full",
                                "text-slate-400 hover:text-white"
                            )}
                        >
                            {hoveredTab === item.name && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white/10 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Controls Area */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleBlueprintMode}
                        className={cn(
                            "relative p-2 rounded-full transition-all duration-300 group overflow-hidden",
                            isBlueprintMode ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" : "bg-slate-800/50 text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
                        )}
                        title="Toggle Blueprint Mode"
                    >
                        <Terminal size={18} />
                        {isBlueprintMode && (
                            <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
                        )}
                    </button>

                    <div className={cn("w-px h-6 bg-slate-800", scrolled && "hidden")} />

                    <div className={cn(scrolled && "hidden md:block")}>
                        <LanguageSelector />
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-full bg-slate-800/50 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className={cn(
                            "absolute top-24 left-4 right-4 p-4 rounded-3xl",
                            "bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl z-50 pointer-events-auto"
                        )}
                    >
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-xl text-base font-medium text-slate-300 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all border border-transparent hover:border-indigo-500/30"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="h-px bg-slate-800 my-2" />
                            <div className="px-2">
                                <LanguageSelector />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
