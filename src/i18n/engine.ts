import type { ReactNode } from "react";
import type { LanguageCode } from "@/context/LanguageContext";

// ─── Types ───────────────────────────────────────────────────────────────────

export type TranslationParams = Record<string, string | number>;

// Flat or nested JSON translation dictionary
type Dict = Record<string, unknown>;

// ─── Locale registry ─────────────────────────────────────────────────────────
// Import all locales statically — they're tiny JSON files (<4KB each)
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";

export const LOCALES: Record<LanguageCode, Dict> = { en, fr, es, de };

// ─── Core resolver ───────────────────────────────────────────────────────────

/** Walk a dotted key path through a nested object. Returns undefined if missing. */
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

/**
 * Replace {variable} placeholders in a template string.
 * Example: interpolate("Hello {name}!", { name: "Arka" }) → "Hello Arka!"
 */
function interpolate(template: string, params?: TranslationParams): string {
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) =>
        k in params ? String(params[k]) : `{${k}}`
    );
}

// ─── Plural selection ────────────────────────────────────────────────────────

/**
 * Minimal ICU-inspired plural selector using pipe-delimited variants.
 * Supports two forms:  "one variant | other variant"
 * Supports three forms: "zero | one | other"
 *
 * Example: selectPlural("{count} project|{count} projects", 3) → "{count} projects"
 */
function selectPlural(template: string, count: number): string {
    const parts = template.split("|");
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return count === 1 ? parts[0] : parts[1];
    // 3-part: zero | one | other
    if (count === 0) return parts[0];
    if (count === 1) return parts[1];
    return parts[2];
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Create a `t()` function bound to a given locale.
 * Falls back to English if the key is missing in the target locale.
 *
 * Usage:
 *   const t = createTranslator("fr");
 *   t("nav.home")                         → "Accueil"
 *   t("projects.count", { count: 5 })     → "5 projets"
 */
export function createTranslator(code: LanguageCode) {
    const dict = LOCALES[code] ?? LOCALES.en;
    const fallback = LOCALES.en;

    return function t(key: string, params?: TranslationParams): string {
        const raw = resolve(dict, key) ?? resolve(fallback, key) ?? key;
        return interpolate(raw, params);
    };
}

/**
 * Create a `tp()` function for plural-aware translations.
 * The translation value should use pipe-separated variants (see selectPlural).
 *
 * Usage:
 *   const tp = createPluralTranslator("fr");
 *   tp("projects.count_other", 5)   → "5 projets"
 */
export function createPluralTranslator(code: LanguageCode) {
    const t = createTranslator(code);
    return function tp(key: string, count: number, extra?: TranslationParams): string {
        const template = t(key);
        const selected = selectPlural(template, count);
        return interpolate(selected, { count, ...extra });
    };
}

// ─── Trans component helper ──────────────────────────────────────────────────

/**
 * Split a translated string by {placeholders} and interleave ReactNode values.
 * Allows embedding JSX nodes (links, bold text) inside translated strings.
 *
 * Usage (in a component):
 *   const nodes = transNodes("footer.built_with_link", { link: <a href="...">Next.js</a> });
 *   return <p>{nodes}</p>;
 */
export function transNodes(
    template: string,
    slots: Record<string, ReactNode>
): (string | ReactNode)[] {
    const parts = template.split(/(\{[^}]+\})/g);
    return parts.map((part, i) => {
        const match = part.match(/^\{(\w+)\}$/);
        if (match && match[1] in slots) return slots[match[1]];
        return part;
    });
}
