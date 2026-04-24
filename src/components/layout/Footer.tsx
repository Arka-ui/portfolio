"use client";

import { ArrowUp, Github } from "lucide-react";
import SessionIcon from "@/components/ui/SessionIcon";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLanyard } from "@/hooks/useLanyard";
import { useLanguage } from "@/context/LanguageContext";
import { useWarp } from "@/context/WarpContext";

const DISCORD_ID = "871084043838566400";
const SESSION_ID = "05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54";

export default function Footer() {
    const { data } = useLanyard(DISCORD_ID);
    const { t } = useLanguage();
    const { warpTo } = useWarp();
    const [sessionCopied, setSessionCopied] = useState(false);

    const scrollToTop = () => warpTo("#");

    const copySession = () => {
        navigator.clipboard.writeText(SESSION_ID);
        setSessionCopied(true);
        setTimeout(() => setSessionCopied(false), 2000);
    };

    return (
        <footer className="relative border-t border-[#493B33]/25 pt-12 pb-12 md:pl-[72px]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#DBC7A6]/[0.025] rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left */}
                    <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                        <span className="font-display font-bold text-lg tracking-tighter text-[#DBC7A6]">Arka<span className="text-[#B39F85]">.</span></span>
                        <div className="w-px h-5 bg-[#493B33]/50" />
                        <div className="flex gap-2">
                            <motion.a
                                href="https://github.com/arka-ui"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#251E18]/60 border border-[#493B33]/50 hover:bg-[#251E18]/90 hover:border-[#B39F85]/30 transition-all text-[#7D6B56] hover:text-[#DBC7A6] text-sm"
                            >
                                <Github size={13} strokeWidth={1.5} />
                                <span className="text-xs">GitHub</span>
                            </motion.a>
                            <motion.button
                                onClick={copySession}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#251E18]/60 border border-[#493B33]/50 hover:bg-[#251E18]/90 hover:border-[#B39F85]/30 transition-all text-[#7D6B56] hover:text-[#DBC7A6] text-sm"
                                aria-label="Copy Session ID"
                            >
                                <SessionIcon size={13} />
                                <span className="text-xs">{sessionCopied ? "Copied!" : "Session"}</span>
                            </motion.button>
                        </div>

                        {data && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1B1814]/70 border border-[#493B33]/40 text-xs font-mono text-[#7D6B56]">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            data.discord_status === "online" ? "#8fb573"
                                            : data.discord_status === "idle" ? "#e0b062"
                                            : data.discord_status === "dnd" ? "#d46a5c"
                                            : "#5F564D",
                                    }}
                                />
                                {data.discord_status ?? "offline"}
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <p className="text-[11px] text-[#5F564D] font-mono">
                            &copy; {new Date().getFullYear()} Arka &middot; {t("footer.rights")}
                        </p>
                        <button
                            onClick={scrollToTop}
                            className="p-2.5 rounded-lg bg-[#251E18]/60 border border-[#493B33]/50 hover:bg-[#DBC7A6]/[0.08] hover:border-[#DBC7A6]/30 transition-all group"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={14} className="text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
