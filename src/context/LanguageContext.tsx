"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createTranslator, createPluralTranslator, transNodes, type TranslationParams } from "@/i18n/engine";

// ─── Types ───────────────────────────────────────────────────────────────────

export type LanguageCode = "en" | "fr" | "es" | "de";

export interface Language {
    code: LanguageCode;
    name: string;
    flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: "en", name: "English",  flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español",  flag: "🇪🇸" },
    { code: "de", name: "Deutsch",  flag: "🇩🇪" },
];

// ─── Context type ─────────────────────────────────────────────────────────────

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    /** Translate a dotted key. Optionally interpolate {variable} params. */
    t: (key: string, params?: TranslationParams) => string;
    /** Plural-aware translate. Uses pipe-separated variants in the JSON value. */
    tp: (key: string, count: number, extra?: TranslationParams) => string;
    /** For JSX slot injection inside translated strings (links, bold nodes, etc.). */
    transNodes: typeof transNodes;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(SUPPORTED_LANGUAGES[0]);

    // Restore saved language on mount
    useEffect(() => {
        const saved = localStorage.getItem("language") as LanguageCode | null;
        if (saved) {
            const found = SUPPORTED_LANGUAGES.find(l => l.code === saved);
            if (found) setLanguageState(found);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang.code);
        document.documentElement.lang = lang.code;
    };

    const t   = createTranslator(language.code);
    const tp  = createPluralTranslator(language.code);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, tp, transNodes }}>
            {children}
        </LanguageContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
    return ctx;
}
