"use client";

import { ArrowUp, Github } from "lucide-react";
import SessionIcon from "@/components/ui/SessionIcon";
import { motion } from "framer-motion";
import { useLanyard } from "@/hooks/useLanyard";
import { useLanguage } from "@/context/LanguageContext";

const DISCORD_ID = "871084043838566400";

export default function Footer() {
    const { data } = useLanyard(DISCORD_ID);
    const { t } = useLanguage();

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const socialLinks = [
        { icon: Github, href: "https://github.com/arka-ui", label: "GitHub" },
        { icon: () => <SessionIcon size={14} />, href: "#", label: "Session" },
    ];

    return (
        <footer className="relative border-t border-white/[0.06] pt-10 pb-10">
            {/* Subtle orb */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/[0.04] rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: branding + social */}
                    <div className="flex items-center gap-4">
                        <span className="font-heading font-bold text-white text-lg tracking-tight">Arka</span>
                        <div className="w-px h-5 bg-white/10" />
                        <div className="flex gap-2">
                            {socialLinks.map((s) => (
                                <motion.a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 transition-all text-white/50 hover:text-white text-sm"
                                >
                                    <s.icon size={14} strokeWidth={1.5} />
                                    <span className="text-xs">{s.label}</span>
                                </motion.a>
                            ))}
                        </div>

                        {/* Live Discord status */}
                        {data && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs font-mono text-white/30">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            data.discord_status === "online" ? "#22c55e"
                                            : data.discord_status === "idle" ? "#f59e0b"
                                            : data.discord_status === "dnd" ? "#ef4444"
                                            : "#6b7280",
                                    }}
                                />
                                {data.discord_status ?? "offline"}
                            </div>
                        )}
                    </div>

                    {/* Right: copyright + scroll top */}
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-white/20 font-mono">
                            © {new Date().getFullYear()} Arka. {t("footer.rights")}
                        </p>
                        <span className="text-[11px] text-white/15 font-mono">v3.0.0</span>
                        <button
                            onClick={scrollToTop}
                            className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/10 transition-colors group"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={14} className="text-white/40 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
