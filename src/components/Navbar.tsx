"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, FileCode } from "lucide-react";
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

import BlueprintWrapper from "@/components/BlueprintWrapper";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeHover, setActiveHover] = useState<string | null>(null);
    const { isBlueprintMode, toggleBlueprintMode } = useBlueprint();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none",
                scrolled ? "pt-4" : "pt-6"
            )}
        >
            <div className={cn(
                "pointer-events-auto relative mx-4 flex items-center justify-between rounded-full border border-white/10 bg-black/50 backdrop-blur-xl px-6 py-3 shadow-lg transition-all duration-300",
                scrolled ? "w-[90%] max-w-5xl" : "w-[95%] max-w-7xl",
                isBlueprintMode && "bg-[#0044cc]/90 border-white/50 rounded-none border-2 border-dashed"
            )}>
                <div className="flex-shrink-0 mr-8">
                    <BlueprintWrapper label="IDENTITY_CORE" description="Main site identifier" direction="bottom">
                        <Link href="#" className={cn(
                            "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent",
                            isBlueprintMode && "text-white bg-none font-mono tracking-widest"
                        )}>
                            {isBlueprintMode ? "<ARKA_DEV />" : "Arka"}
                        </Link>
                    </BlueprintWrapper>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center space-x-1">
                        {navItems.map((item) => (
                            <BlueprintWrapper key={item.name} label="NAV_LINK" description={`Jump to ${item.name}`} direction="bottom">
                                <Link
                                    href={item.href}
                                    onMouseEnter={() => setActiveHover(item.name)}
                                    onMouseLeave={() => setActiveHover(null)}
                                    className={cn(
                                        "relative px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white",
                                        isBlueprintMode && "font-mono hover:bg-white/20 hover:text-yellow-300"
                                    )}
                                >
                                    {activeHover === item.name && !isBlueprintMode && (
                                        <motion.div
                                            layoutId="navbar-hover"
                                            className="absolute inset-0 rounded-full bg-white/10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item.name}</span>
                                </Link>
                            </BlueprintWrapper>
                        ))}
                    </div>

                    <BlueprintWrapper label="MODE_SWITCH" description="Toggle System View" direction="bottom">
                        <button
                            onClick={toggleBlueprintMode}
                            className={cn(
                                "p-2 rounded-full transition-all hover:bg-white/10",
                                isBlueprintMode ? "text-yellow-300 bg-white/20 animate-pulse" : "text-gray-300 hover:text-white"
                            )}
                            title={isBlueprintMode ? "Exit Blueprint Mode" : "Enter Blueprint Mode"}
                        >
                            <FileCode size={20} />
                        </button>
                    </BlueprintWrapper>

                    <BlueprintWrapper label="I18N_MODULE" description="Language Selection" direction="bottom">
                        <LanguageSelector />
                    </BlueprintWrapper>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={toggleBlueprintMode}
                        className={cn(
                            "p-2 rounded-full transition-all hover:bg-white/10",
                            isBlueprintMode ? "text-yellow-300 bg-white/20" : "text-gray-300 hover:text-white"
                        )}
                    >
                        <FileCode size={20} />
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-300 hover:text-white p-2"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={cn(
                            "absolute top-20 left-4 right-4 p-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl md:hidden pointer-events-auto",
                            isBlueprintMode && "bg-[#0044cc] border-white/50 rounded-none border-dashed font-mono"
                        )}
                    >
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors",
                                        isBlueprintMode && "hover:text-yellow-300 rounded-none border-b border-white/20"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="px-4 py-2">
                                <LanguageSelector />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
