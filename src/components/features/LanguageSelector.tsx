"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, SUPPORTED_LANGUAGES, Language } from "@/context/LanguageContext";

interface Props {
    align?: "right" | "left";
    variant?: "pill" | "bare";
    direction?: "down" | "up";
}

export default function LanguageSelector({ align = "right", variant = "pill", direction = "down" }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { language, setLanguage } = useLanguage();

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    useEffect(() => {
        setMounted(true);
        const detectLanguage = async () => {
            if (localStorage.getItem("language")) return;

            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                const country = data.country_code as string;
                let langCode = "en";

                if (["ES", "MX", "AR", "CO", "PE", "VE", "CL", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "GQ"].includes(country)) langCode = "es";
                else if (["FR", "BE", "CH", "MC", "LU", "CA"].includes(country)) langCode = "fr";
                else if (["DE", "AT", "LI"].includes(country)) langCode = "de";

                const detected = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                if (detected && detected.code !== "en") {
                    setLanguage(detected);
                }
            } catch (err) {
                console.error("Location detection failed", err);
            }
        };
        detectLanguage();
    }, [setLanguage]);

    if (!mounted) return null;

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change language"
                className={cn(
                    "flex items-center justify-center transition-all text-[#7D6B56] hover:text-[#DBC7A6]",
                    variant === "pill"
                        ? "gap-1.5 h-8 px-2.5 rounded-full border border-[#493B33]/50 bg-[#1B1814]/70 hover:border-[#B39F85]/40 backdrop-blur-xl"
                        : "w-8 h-8 rounded-full border border-[#493B33]/50 bg-[#1B1814]/70 hover:border-[#B39F85]/40 backdrop-blur-xl"
                )}
            >
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase">{language.code}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: direction === "up" ? -8 : 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: direction === "up" ? -8 : 8, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            "absolute w-48 overflow-y-auto rounded-2xl border border-[#493B33]/50 bg-[#1B1814]/95 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] p-1.5 scrollbar-hide z-[60]",
                            align === "right" ? "right-0" : "left-0",
                            direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
                        )}
                    >
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-sm",
                                    language.code === lang.code
                                        ? "bg-[#DBC7A6]/[0.09] text-[#DBC7A6] border border-[#B39F85]/30"
                                        : "text-[#7D6B56] hover:bg-[#251E18]/80 hover:text-[#DBC7A6] border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-base">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                </div>
                                {language.code === lang.code && <Check size={13} className="text-[#DBC7A6]" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
