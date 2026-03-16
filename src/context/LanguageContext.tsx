"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import {
    createTranslator,
    createPluralTranslator,
    transNodes,
    type LanguageCode,
    type TranslationParams,
} from "@/i18n/engine";

// ─── Re-export LanguageCode so callers can import it from here ────────────────
export type { LanguageCode };

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: TranslationParams) => string;
    tp: (key: string, count: number, extra?: TranslationParams) => string;
    transNodes: typeof transNodes;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(SUPPORTED_LANGUAGES[0]);

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

    // Memoize translators so consumers only re-render when language actually changes
    const t  = useMemo(() => createTranslator(language.code),       [language.code]);
    const tp = useMemo(() => createPluralTranslator(language.code), [language.code]);

    const value = useMemo(
        () => ({ language, setLanguage, t, tp, transNodes }),
        [language, t, tp]
    );

    return (
        <LanguageContext.Provider value={value}>
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
