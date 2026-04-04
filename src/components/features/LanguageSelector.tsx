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
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-[#ff6b35]/15 transition-all backdrop-blur-xl text-white/35 hover:text-white/60"
            >
                <span className="text-base">{language.flag}</span>
                <span className="text-[12px] font-medium hidden sm:block">{language.name}</span>
                <ChevronDown
                    size={12}
                    className={cn("text-white/25 transition-transform duration-300", isOpen && "rotate-180")}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 overflow-y-auto rounded-2xl border border-white/[0.07] bg-[#060d1f]/95 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] p-1.5 scrollbar-hide"
                    >
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-sm",
                                    language.code === lang.code
                                        ? "bg-[#ff6b35]/[0.08] text-[#ff6b35] border border-[#ff6b35]/[0.12]"
                                        : "text-white/40 hover:bg-white/[0.04] hover:text-white border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-base">{lang.flag}</span>
                                    <span className="font-medium">{lang.name}</span>
                                </div>
                                {language.code === lang.code && <Check size={13} className="text-[#ff6b35]" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
