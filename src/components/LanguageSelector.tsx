"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Script from "next/script";

// Top languages to show first
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

// A more comprehensive list (subset of 100 for brevity in this prompt, but I will include many)
const ALL_LANGUAGES = [
    ...TOP_LANGUAGES,
    { code: "af", name: "Afrikaans", flag: "🇿🇦" },
    { code: "sq", name: "Albanian", flag: "🇦🇱" },
    { code: "am", name: "Amharic", flag: "🇪🇹" },
    { code: "hy", name: "Armenian", flag: "🇦🇲" },
    { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
    { code: "eu", name: "Basque", flag: "🇪🇸" },
    { code: "be", name: "Belarusian", flag: "🇧🇾" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "bs", name: "Bosnian", flag: "🇧🇦" },
    { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
    { code: "ca", name: "Catalan", flag: "🇪🇸" },
    { code: "ceb", name: "Cebuano", flag: "🇵🇭" },
    { code: "ny", name: "Chichewa", flag: "🇲🇼" },
    { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼" },
    { code: "co", name: "Corsican", flag: "🇫🇷" },
    { code: "hr", name: "Croatian", flag: "🇭🇷" },
    { code: "cs", name: "Czech", flag: "🇨🇿" },
    { code: "da", name: "Danish", flag: "🇩🇰" },
    { code: "nl", name: "Dutch", flag: "🇳🇱" },
    { code: "eo", name: "Esperanto", flag: "🌍" },
    { code: "et", name: "Estonian", flag: "🇪🇪" },
    { code: "tl", name: "Filipino", flag: "🇵🇭" },
    { code: "fi", name: "Finnish", flag: "🇫🇮" },
    { code: "fy", name: "Frisian", flag: "🇳🇱" },
    { code: "gl", name: "Galician", flag: "🇪🇸" },
    { code: "ka", name: "Georgian", flag: "🇬🇪" },
    { code: "el", name: "Greek", flag: "🇬🇷" },
    { code: "gu", name: "Gujarati", flag: "🇮🇳" },
    { code: "ht", name: "Haitian Creole", flag: "🇭🇹" },
    { code: "ha", name: "Hausa", flag: "🇳🇬" },
    { code: "haw", name: "Hawaiian", flag: "🇺🇸" },
    { code: "iw", name: "Hebrew", flag: "🇮🇱" },
    { code: "hmn", name: "Hmong", flag: "🇨🇳" },
    { code: "hu", name: "Hungarian", flag: "🇭🇺" },
    { code: "is", name: "Icelandic", flag: "🇮🇸" },
    { code: "ig", name: "Igbo", flag: "🇳🇬" },
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "ga", name: "Irish", flag: "🇮🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "jw", name: "Javanese", flag: "🇮🇩" },
    { code: "kn", name: "Kannada", flag: "🇮🇳" },
    { code: "kk", name: "Kazakh", flag: "🇰🇿" },
    { code: "km", name: "Khmer", flag: "🇰🇭" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "ku", name: "Kurdish (Kurmanji)", flag: "🇹🇷" },
    { code: "ky", name: "Kyrgyz", flag: "🇰🇬" },
    { code: "lo", name: "Lao", flag: "🇱🇦" },
    { code: "la", name: "Latin", flag: "🇻🇦" },
    { code: "lv", name: "Latvian", flag: "🇱🇻" },
    { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
    { code: "lb", name: "Luxembourgish", flag: "🇱🇺" },
    { code: "mk", name: "Macedonian", flag: "🇲🇰" },
    { code: "mg", name: "Malagasy", flag: "🇲🇬" },
    { code: "ms", name: "Malay", flag: "🇲🇾" },
    { code: "ml", name: "Malayalam", flag: "🇮🇳" },
    { code: "mt", name: "Maltese", flag: "🇲🇹" },
    { code: "mi", name: "Maori", flag: "🇳🇿" },
    { code: "mr", name: "Marathi", flag: "🇮🇳" },
    { code: "mn", name: "Mongolian", flag: "🇲🇳" },
    { code: "my", name: "Myanmar (Burmese)", flag: "🇲🇲" },
    { code: "ne", name: "Nepali", flag: "🇳🇵" },
    { code: "no", name: "Norwegian", flag: "🇳🇴" },
    { code: "ps", name: "Pashto", flag: "🇦🇫" },
    { code: "fa", name: "Persian", flag: "🇮🇷" },
    { code: "pl", name: "Polish", flag: "🇵🇱" },
    { code: "pa", name: "Punjabi", flag: "🇮🇳" },
    { code: "ro", name: "Romanian", flag: "🇷🇴" },
    { code: "sm", name: "Samoan", flag: "🇼🇸" },
    { code: "gd", name: "Scots Gaelic", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    { code: "sr", name: "Serbian", flag: "🇷🇸" },
    { code: "st", name: "Sesotho", flag: "🇱🇸" },
    { code: "sn", name: "Shona", flag: "🇿🇼" },
    { code: "sd", name: "Sindhi", flag: "🇵🇰" },
    { code: "si", name: "Sinhala", flag: "🇱🇰" },
    { code: "sk", name: "Slovak", flag: "🇸🇰" },
    { code: "sl", name: "Slovenian", flag: "🇸🇮" },
    { code: "so", name: "Somali", flag: "🇸🇴" },
    { code: "su", name: "Sundanese", flag: "🇮🇩" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
    { code: "sv", name: "Swedish", flag: "🇸🇪" },
    { code: "tg", name: "Tajik", flag: "🇹🇯" },
    { code: "ta", name: "Tamil", flag: "🇮🇳" },
    { code: "te", name: "Telugu", flag: "🇮🇳" },
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "tr", name: "Turkish", flag: "🇹🇷" },
    { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
    { code: "ur", name: "Urdu", flag: "🇵🇰" },
    { code: "uz", name: "Uzbek", flag: "🇺🇿" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { code: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
    { code: "xh", name: "Xhosa", flag: "🇿🇦" },
    { code: "yi", name: "Yiddish", flag: "🇮🇱" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
    { code: "zu", name: "Zulu", flag: "🇿🇦" },
];

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(TOP_LANGUAGES[0]);
    const [mounted, setMounted] = useState(false);

    const handleLanguageChange = useCallback((lang: typeof TOP_LANGUAGES[0]) => {
        setCurrentLang(lang);
        setIsOpen(false);

        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (select) {
            select.value = lang.code;
            select.dispatchEvent(new Event("change"));
        }
    }, []);

    useEffect(() => {
        setMounted(true);

        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    autoDisplay: false,
                },
                "google_translate_element"
            );
        };

        // Detect user location and set language
        const detectLanguage = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                const countryCode = data.country_code;

                // Map country code to language code (simplified mapping)
                // This is a basic heuristic, can be expanded
                let langCode = "en";
                if (countryCode === "ES" || countryCode === "MX" || countryCode === "AR") langCode = "es";
                else if (countryCode === "FR") langCode = "fr";
                else if (countryCode === "DE") langCode = "de";
                else if (countryCode === "CN") langCode = "zh-CN";
                else if (countryCode === "JP") langCode = "ja";
                else if (countryCode === "RU") langCode = "ru";
                else if (countryCode === "BR" || countryCode === "PT") langCode = "pt";
                else if (countryCode === "IN") langCode = "hi"; // Or en
                else if (countryCode === "SA" || countryCode === "AE") langCode = "ar";

                const detectedLang = ALL_LANGUAGES.find(l => l.code === langCode) || TOP_LANGUAGES[0];

                // Only auto-switch if it's not English (default)
                if (detectedLang.code !== "en") {
                    handleLanguageChange(detectedLang);
                }
            } catch (error) {
                console.error("Failed to detect location:", error);
            }
        };

        detectLanguage();
    }, [handleLanguageChange]);

    if (!mounted) return null;

    return (
        <div className="relative z-50">
            <div id="google_translate_element" className="hidden"></div>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm font-medium text-gray-300 hidden sm:block">{currentLang.name}</span>
                <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl p-2 scrollbar-hide"
                    >
                        <div className="sticky top-0 bg-black/90 backdrop-blur-xl p-2 border-b border-white/10 mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Most Used</span>
                        </div>

                        {TOP_LANGUAGES.map((lang) => (
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

                        <div className="sticky top-0 bg-black/90 backdrop-blur-xl p-2 border-b border-white/10 my-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">All Languages</span>
                        </div>

                        {ALL_LANGUAGES.filter(l => !TOP_LANGUAGES.some(tl => tl.code === l.code)).map((lang) => (
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
        </div>
    );
}
