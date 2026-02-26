"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, SUPPORTED_LANGUAGES, Language } from "@/context/LanguageContext";

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { language, setLanguage } = useLanguage();

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    // Detect user location on first mount and auto-select a language
    useEffect(() => {
        setMounted(true);
        const detectLanguage = async (signal: AbortSignal) => {
            // Only run if language hasn't been set by user preference already (handled in Context)
            if (localStorage.getItem("language")) return;

            try {
                const res = await fetch("https://ipapi.co/json/", { signal });
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
            } catch (err: unknown) {
                if (err instanceof Error && err.name !== "AbortError") {
                    console.error("Location detection failed", err);
                }
            }
        };
        const controller = new AbortController();
        detectLanguage(controller.signal);
        return () => controller.abort();
    }, [setLanguage]);

    if (!mounted) return null;

    return (
        <div className="relative z-50">
            {/* Language selector button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#0e0e0e]/80 border border-white/[0.07] hover:border-white/15 hover:bg-white/[0.06] transition-all backdrop-blur-xl"
            >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium text-gray-300 hidden sm:block">{language.name}</span>
                <ChevronDown
                    size={14}
                    className={cn("text-gray-400 transition-transform duration-300", isOpen && "rotate-180")}
                />
            </button>

            {/* Dropdown list */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 overflow-y-auto rounded-xl border border-white/[0.07] bg-[#111]/95 backdrop-blur-xl shadow-2xl p-2 scrollbar-hide"
                    >
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm",
                                    language.code === lang.code ? "bg-primary/20 text-primary" : "text-gray-300 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </div>
                                {language.code === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
