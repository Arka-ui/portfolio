"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSectionSpy } from "@/hooks/useSectionSpy";
import { SECTION_ORDER, SECTION_NUM, type SectionId } from "@/lib/sections";

export default function AtlasMasthead() {
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);

    const active = useSectionSpy(SECTION_ORDER);
    const folio = SECTION_NUM[active as SectionId] ?? "01";

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y > lastY.current + 6 && y > 200) setHidden(true);
                else if (y < lastY.current - 4) setHidden(false);
                lastY.current = y;
                raf = 0;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const openCmdPalette = () =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

    return (
        <header
            aria-hidden
            className={cn(
                "hidden md:flex fixed top-0 left-0 right-0 z-40 h-9 items-center px-6 lg:px-10 pl-[88px] transition-transform duration-500",
                hidden ? "-translate-y-full" : "translate-y-0"
            )}
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
            <div className="w-full flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.28em]">
                <span className="text-[#7D6B56]">Arka</span>
                <span className="text-[#5F564D]">·</span>
                <span className="text-[#7D6B56]">Field Atlas</span>
                <span className="text-[#5F564D]">·</span>
                <span className="text-[#7D6B56]">MMXXVI</span>
                <span className="text-[#5F564D]">·</span>
                <span className="text-[#B39F85]">№ {folio}</span>
                <div className="flex-1 h-px bg-[#493B33]/35" aria-hidden />
                <button
                    type="button"
                    onClick={openCmdPalette}
                    className="text-[#7D6B56] hover:text-[#DBC7A6] transition-colors pointer-events-auto"
                    aria-label="Open command index"
                >
                    ⌘K · Index
                </button>
            </div>
        </header>
    );
}
