"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative py-12 text-center text-muted-foreground text-sm bg-black/40 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-semibold text-white">Arka</p>
                    <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>

                <p className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                    Built with <span className="text-red-400">♥</span> using Next.js & Tailwind
                </p>

                <button
                    onClick={scrollToTop}
                    className="mt-4 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all group"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </button>
            </div>
        </footer>
    );
}
