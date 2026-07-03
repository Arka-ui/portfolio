"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* The palette body (and the cmdk dependency) stays out of the initial
   bundle — it loads the first time the palette is opened. */
const CommandPaletteInner = dynamic(() => import("./CommandPaletteInner"), { ssr: false });

export default function CommandPalette() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(o => !o);
            }
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    if (!open) return null;

    return <CommandPaletteInner onClose={() => setOpen(false)} />;
}
