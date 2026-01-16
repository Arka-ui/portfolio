"use client";

import { Home, User, Briefcase, Mail, Terminal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

export default function MobileHUD() {
    const { warpTo } = useWarp();
    const { t } = useLanguage();
    const { triggerHaptic } = useHaptics();
    const [activeTab, setActiveTab] = useState("home");
    const [scrolled, setScrolled] = useState(false);

    // Detect scroll to hide/show or just change style
    useEffect(() => {
        const handleScroll = () => {
            // Simple logic: if scrolled down, maybe shrink it slightly? 
            // For now we keep it constant for consistency.
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Sync active tab with scroll position (simplified version of Navbar spy)
    useEffect(() => {
        const handleSpy = () => {
            const sections = ["hero", "about", "projects", "contact"];
            const scrollPos = window.scrollY + window.innerHeight / 2;

            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const offset = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= offset && scrollPos < offset + height) {
                        setActiveTab(section === "hero" ? "home" : section);
                    }
                }
            }
        };
        window.addEventListener("scroll", handleSpy);
        return () => window.removeEventListener("scroll", handleSpy);
    }, []);

    const navItems = [
        { id: "home", icon: Home, label: "Home", href: "#" },
        { id: "about", icon: User, label: "About", href: "#about" },
        { id: "projects", icon: Briefcase, label: "Projects", href: "#projects" },
        { id: "contact", icon: Mail, label: "Contact", href: "#contact" },
    ];

    const handleNav = (id: string, href: string) => {
        triggerHaptic("light");
        setActiveTab(id);
        warpTo(href);
    };

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
            className="fixed bottom-6 left-4 right-4 h-16 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-2 shadow-2xl z-50 md:hidden"
        >
            {/* Glossy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        onClick={() => handleNav(item.id, item.href)}
                        className="relative flex-1 h-full flex flex-col items-center justify-center gap-1 group"
                    >
                        {isActive && (
                            <motion.div
                                layoutId="hud-active"
                                className="absolute inset-0 bg-white/5 rounded-xl border border-white/5"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        <div className={cn(
                            "relative z-10 p-1 transition-all duration-300",
                            isActive ? "text-cyan-400 -translate-y-1" : "text-slate-500"
                        )}>
                            <Icon size={20} />
                        </div>

                        <span className={cn(
                            "relative z-10 text-[10px] font-medium transition-all duration-300",
                            isActive ? "text-white opacity-100" : "text-slate-500 opacity-0 translate-y-2"
                        )}>
                            {item.label}
                        </span>

                        {/* Active Indicator Dot */}
                        {isActive && (
                            <motion.div
                                layoutId="hud-dot"
                                className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                            />
                        )}
                    </button>
                );
            })}
        </motion.div>
    );
}
