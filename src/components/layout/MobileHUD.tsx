"use client";

import { Home, User, Briefcase, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useWarp } from "@/context/WarpContext";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

const SECTION_MAP: Record<string, string> = {
    "hero":        "home",
    "about-intro": "about",
    "projects":    "projects",
    "contact":     "contact",
};

export default function MobileHUD() {
    const { warpTo } = useWarp();
    const { triggerHaptic } = useHaptics();
    const [activeTab, setActiveTab] = useState("home");

    // Single IntersectionObserver replaces per-scroll event listener
    // This fires only when section boundaries cross the viewport — much cheaper
    useEffect(() => {
        const sections = Object.keys(SECTION_MAP)
            .map(id => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the entry that is most visible (highest intersectionRatio)
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible) {
                    const tab = SECTION_MAP[visible.target.id];
                    if (tab) setActiveTab(tab);
                }
            },
            {
                // Trigger when the center-ish of the section is in view
                rootMargin: "-40% 0px -40% 0px",
                threshold: [0, 0.1, 0.5, 1],
            }
        );

        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    const navItems = [
        { id: "home",     icon: Home,     label: "Home",    href: "#"            },
        { id: "about",    icon: User,     label: "About",   href: "#about-intro" },
        { id: "projects", icon: Briefcase,label: "Projects",href: "#projects"    },
        { id: "contact",  icon: Mail,     label: "Contact", href: "#contact"     },
    ];

    const handleNav = (id: string, href: string) => {
        triggerHaptic("light");
        setActiveTab(id);
        warpTo(href);
    };

    return (
        <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 24, delay: 1.2 }}
            className="fixed md:hidden z-50 will-change-transform"
            style={{
                bottom: "max(1.25rem, env(safe-area-inset-bottom, 20px))",
                left: "1rem",
                right: "1rem",
                height: "62px",
            }}
        >
            {/* Bar background */}
            <div className="absolute inset-0 rounded-2xl bg-[#0d0d12]/85 backdrop-blur-2xl border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
            </div>

            {/* Nav buttons */}
            <div className="relative h-full flex items-center px-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNav(item.id, item.href)}
                            // Minimum 44px touch target per WCAG 2.5.5
                            className="relative flex-1 h-full flex flex-col items-center justify-center gap-[3px] min-w-[44px]"
                            aria-label={item.label}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {/* Active pill background */}
                            {isActive && (
                                <motion.div
                                    layoutId="hud-pill"
                                    className="absolute inset-x-1.5 inset-y-2 rounded-xl bg-indigo-500/[0.15] border border-indigo-500/20"
                                    transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                animate={isActive ? { y: -1, scale: 1.1 } : { y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                className={cn(
                                    "relative z-10 transition-colors duration-200",
                                    isActive ? "text-indigo-300" : "text-white/30"
                                )}
                            >
                                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                            </motion.div>

                            {/* Label */}
                            <motion.span
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "relative z-10 text-[9px] font-mono tracking-wider",
                                    isActive ? "text-indigo-300" : "text-white/25"
                                )}
                            >
                                {item.label}
                            </motion.span>

                            {/* Bottom glow pip */}
                            {isActive && (
                                <motion.div
                                    layoutId="hud-pip"
                                    className="absolute bottom-1.5 w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_8px_3px_rgba(99,102,241,0.55)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
