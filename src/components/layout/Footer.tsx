"use client";

import { ArrowUp, Github, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLanyard } from "@/hooks/useLanyard";

const DISCORD_ID = "871084043838566400";

export default function Footer() {
    const { data } = useLanyard(DISCORD_ID);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const socialLinks = [
        { icon: Github, href: "https://github.com/arka-ui", label: "GitHub" },
        { icon: Mail, href: "mailto:hello@arka.dev", label: "Email" },
    ];

    return (
        <footer className="relative border-t border-white/[0.06] pt-20 pb-10">
            {/* Subtle orb */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/[0.04] rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-10 items-end mb-16">
                    <div className="space-y-4">
                        <p className="label-mono">Let&apos;s work together</p>
                        <h2 className="font-heading font-black text-[clamp(32px,4.5vw,58px)] leading-[0.9] tracking-tighter text-white">
                            Got a project?<br />
                            <span className="text-white/25">Let&apos;s talk.</span>
                        </h2>
                        <a
                            href="mailto:hello@arka.dev"
                            className="inline-flex items-center gap-2 mt-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-mono"
                        >
                            hello@arka.dev â†’
                        </a>
                    </div>

                    <div className="flex flex-wrap gap-3 md:justify-end items-end">
                        {socialLinks.map((s) => (
                            <motion.a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 transition-all text-white/60 hover:text-white text-sm"
                            >
                                <s.icon size={16} strokeWidth={1.5} />
                                <span>{s.label}</span>
                            </motion.a>
                        ))}

                        {/* Live Discord status */}
                        {data && (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-mono text-white/30">
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
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.06] gap-4">
                    <p className="text-xs text-white/20 font-mono">
                        Â© {new Date().getFullYear()} Arka. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
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
