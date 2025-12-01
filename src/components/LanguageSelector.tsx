"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Top languages displayed first (most common)
const TOP_LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

// A larger list (trimmed for brevity – you can extend it later)
const ALL_LANGUAGES = [
    ...TOP_LANGUAGES,
    { code: "af", name: "Afrikaans", flag: "🇿🇦" },
    { code: "sq", name: "Albanian", flag: "🇦🇱" },
    { code: "am", name: "Amharic", flag: "🇪🇹" },
    { code: "hy", name: "Armenian", flag: "🇦🇲" },
    { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
    // ... add more languages as needed ...
];

/**
 * Simple overlay that appears while a translation request is in progress.
 */
function TranslatingOverlay() {
    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-12 h-12 border-4 border-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
        </motion.div>
    );
}

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(TOP_LANGUAGES[0]);
    const [mounted, setMounted] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    // Change language using LibreTranslate public instance
    const handleLanguageChange = useCallback(async (lang: typeof TOP_LANGUAGES[0]) => {
        setCurrentLang(lang);
        setIsOpen(false);
        setIsTranslating(true);
        try {
            const response = await fetch("https://libretranslate.de/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    q: document.title,
                    source: "en",
                    target: lang.code,
                    format: "text",
                }),
            });
            const data = await response.json();
            if (data.translatedText) {
                document.title = data.translatedText;
            }
        } catch (e) {
            console.error("Translation error", e);
        } finally {
            setIsTranslating(false);
        }
    }, []);

    // Detect user location on first mount and auto‑select a language
    useEffect(() => {
        setMounted(true);
        const detectLanguage = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                const country = data.country_code as string;
                let langCode = "en";
                if (["ES", "MX", "AR"].includes(country)) langCode = "es";
                else if (country === "FR") langCode = "fr";
                else if (country === "DE") langCode = "de";
                else if (country === "CN") langCode = "zh-CN";
                else if (country === "JP") langCode = "ja";
                else if (country === "RU") langCode = "ru";
                else if (["BR", "PT"].includes(country)) langCode = "pt";
                else if (country === "IN") langCode = "hi";
                else if (["SA", "AE"].includes(country)) langCode = "ar";
                const detected = ALL_LANGUAGES.find(l => l.code === langCode) || TOP_LANGUAGES[0];
                if (detected.code !== "en") {
                    await handleLanguageChange(detected);
                }
            } catch (err) {
                console.error("Location detection failed", err);
            }
        };
        detectLanguage();
    }, [handleLanguageChange]);

    if (!mounted) return null;

    return (
        <div className="relative z-50">
            {/* Language selector button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm font-medium text-gray-300 hidden sm:block">{currentLang.name}</span>
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
                        className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl p-2 scrollbar-hide"
                    >
                        <div className="sticky top-0 bg-black/90 p-2 border-b border-white/10 mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Most Used</span>
                        </div>
                        {TOP_LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm",
                                    currentLang.code === lang.code ? "bg-primary/20 text-primary" : "text-gray-300 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </div>
                                {currentLang.code === lang.code && <Check size={14} />}
                            </button>
                        ))}
                        <div className="sticky top-0 bg-black/90 p-2 border-b border-white/10 my-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">All Languages</span>
                        </div>
                        {ALL_LANGUAGES.filter(l => !TOP_LANGUAGES.some(t => t.code === l.code)).map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm",
                                    currentLang.code === lang.code ? "bg-primary/20 text-primary" : "text-gray-300 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </div>
                                {currentLang.code === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading overlay while translating */}
            {isTranslating && <TranslatingOverlay />}
        </div>
    );
}
