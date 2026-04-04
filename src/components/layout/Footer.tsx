"use client";

import { ArrowUp, Github } from "lucide-react";
import SessionIcon from "@/components/ui/SessionIcon";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLanyard } from "@/hooks/useLanyard";
import { useLanguage } from "@/context/LanguageContext";

const DISCORD_ID = "871084043838566400";
const SESSION_ID = "05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54";

export default function Footer() {
    const { data } = useLanyard(DISCORD_ID);
    const { t } = useLanguage();
    const [sessionCopied, setSessionCopied] = useState(false);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const copySession = () => {
        navigator.clipboard.writeText(SESSION_ID);
        setSessionCopied(true);
        setTimeout(() => setSessionCopied(false), 2000);
    };

    return (
        <footer className="relative border-t border-white/[0.04] pt-12 pb-12">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#ff6b35]/[0.02] rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left */}
                    <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                        <span className="font-heading font-bold text-lg tracking-tighter text-white">Arka<span className="text-[#ff6b35]">.</span></span>
                        <div className="w-px h-5 bg-white/[0.08]" />
                        <div className="flex gap-2">
                            <motion.a
                                href="https://github.com/arka-ui"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-[#ff6b35]/15 transition-all text-white/35 hover:text-white text-sm"
                            >
                                <Github size={13} strokeWidth={1.5} />
                                <span className="text-xs">GitHub</span>
                            </motion.a>
                            <motion.button
                                onClick={copySession}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-[#ff6b35]/15 transition-all text-white/35 hover:text-white text-sm"
                                aria-label="Copy Session ID"
                            >
                                <SessionIcon size={13} />
                                <span className="text-xs">{sessionCopied ? "Copied!" : "Session"}</span>
                            </motion.button>
                        </div>

                        {data && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs font-mono text-white/20">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            data.discord_status === "online" ? "#ff6b35"
                                            : data.discord_status === "idle" ? "#f59e0b"
                                            : data.discord_status === "dnd" ? "#ff5c5c"
                                            : "#4b5563",
                                    }}
                                />
                                {data.discord_status ?? "offline"}
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <p className="text-[11px] text-white/12 font-mono">
                            &copy; {new Date().getFullYear()} Arka &middot; {t("footer.rights")}
                        </p>
                        <button
                            onClick={scrollToTop}
                            className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-[#ff6b35]/[0.08] hover:border-[#ff6b35]/15 transition-all group"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={14} className="text-white/25 group-hover:text-[#ff6b35] transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
