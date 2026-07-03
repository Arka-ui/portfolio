/**
 * Canonical atlas numbering — single source of truth for every "§ 0X"
 * printed in section folios, the masthead counter, the nav index and the
 * mobile HUD. Keep in sync with the printed folio heads in each section.
 */
export const SECTION_ORDER = [
    "hero",
    "instruments",
    "about-intro",
    "about",
    "projects",
    "news",
    "skills",
    "live",
    "contact",
] as const;

export type SectionId = (typeof SECTION_ORDER)[number];

/** Printed § number per section. Timeline (`about`) shares § 03 with About (§ 03·b). */
export const SECTION_NUM: Record<SectionId, string> = {
    "hero": "01",
    "instruments": "02",
    "about-intro": "03",
    "about": "03",
    "projects": "04",
    "news": "05",
    "skills": "06",
    "live": "07",
    "contact": "08",
};
