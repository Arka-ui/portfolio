"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Active-section tracking via IntersectionObserver instead of per-frame
 * getBoundingClientRect() loops — no layout reads while scrolling.
 *
 * A section is "active" while it spans the pivot line at 35% of the
 * viewport height (same pivot the old scroll handlers used). When several
 * ids report in at once, the one deepest in document order wins; when the
 * pivot sits in a gap (e.g. the footer), the last known section stays active.
 */
export function useSectionSpy(ids: readonly string[]): string {
    const key = ids.join(",");
    const [active, setActive] = useState(ids[0] ?? "");

    const orderedIds = useMemo(() => key.split(","), [key]);

    useEffect(() => {
        const els = orderedIds
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];
        if (!els.length) return;

        const inBand = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) inBand.add(entry.target.id);
                    else inBand.delete(entry.target.id);
                }
                for (let i = orderedIds.length - 1; i >= 0; i--) {
                    if (inBand.has(orderedIds[i])) {
                        setActive(orderedIds[i]);
                        return;
                    }
                }
                // Nothing spans the pivot (footer / gaps): keep last active.
            },
            // 1%-tall observation band whose top edge sits at 35% viewport height
            { rootMargin: "-35% 0px -64% 0px", threshold: 0 }
        );

        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [orderedIds]);

    return active;
}
