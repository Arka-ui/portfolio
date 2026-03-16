import type { ReactNode } from "react";

// ─── LanguageCode lives here — LanguageContext imports it from this file ──────
export type LanguageCode = "en" | "fr" | "es" | "de";

// ─── Types ───────────────────────────────────────────────────────────────────

export type TranslationParams = Record<string, string | number>;

type Dict = Record<string, unknown>;

// ─── Locale registry ─────────────────────────────────────────────────────────
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";

export const LOCALES: Record<LanguageCode, Dict> = { en, fr, es, de };

// ─── Core resolver ───────────────────────────────────────────────────────────

function resolve(dict: Dict, key: string): string | undefined {
    const parts = key.split(".");
    let node: unknown = dict;
    for (const part of parts) {
        if (node && typeof node === "object" && part in (node as object)) {
            node = (node as Record<string, unknown>)[part];
        } else {
            return undefined;
        }
    }
    return typeof node === "string" ? node : undefined;
}

// ─── Interpolation ───────────────────────────────────────────────────────────

export function interpolate(template: string, params?: TranslationParams): string {
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) =>
        k in params ? String(params[k]) : `{${k}}`
    );
}

// ─── Plural selection ────────────────────────────────────────────────────────

function selectPlural(template: string, count: number): string {
    const parts = template.split("|");
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return count === 1 ? parts[0] : parts[1];
    if (count === 0) return parts[0];
    if (count === 1) return parts[1];
    return parts[2];
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function createTranslator(code: LanguageCode) {
    const dict = LOCALES[code] ?? LOCALES.en;
    const fallback = LOCALES.en;

    return function t(key: string, params?: TranslationParams): string {
        const raw = resolve(dict, key) ?? resolve(fallback, key) ?? key;
        return interpolate(raw, params);
    };
}

export function createPluralTranslator(code: LanguageCode) {
    const t = createTranslator(code);
    return function tp(key: string, count: number, extra?: TranslationParams): string {
        const template = t(key);
        const selected = selectPlural(template, count);
        return interpolate(selected, { count, ...extra });
    };
}

export function transNodes(
    template: string,
    slots: Record<string, ReactNode>
): (string | ReactNode)[] {
    const parts = template.split(/(\{[^}]+\})/g);
    return parts.map((part) => {
        const match = part.match(/^\{(\w+)\}$/);
        if (match && match[1] in slots) return slots[match[1]];
        return part;
    });
}
