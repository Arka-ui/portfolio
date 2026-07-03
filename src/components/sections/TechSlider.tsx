"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const TECH_LINKS: Record<string, string> = {
    "React": "https://react.dev",
    "TypeScript": "https://www.typescriptlang.org",
    "Next.js": "https://nextjs.org",
    "Node.js": "https://nodejs.org",
    "Tailwind CSS": "https://tailwindcss.com",
    "Framer Motion": "https://www.framer.com/motion",
    "Docker": "https://www.docker.com",
    "PostgreSQL": "https://www.postgresql.org",
    "Prisma": "https://www.prisma.io",
    "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "HTML / CSS": "https://developer.mozilla.org/en-US/docs/Web",
    "GraphQL": "https://graphql.org",
    "Vite": "https://vitejs.dev",
    "Zustand": "https://zustand-demo.pmnd.rs",
    "tRPC": "https://trpc.io",
    "Python": "https://www.python.org",
    "Rust": "https://www.rust-lang.org",
    "Java": "https://www.java.com",
    "Git": "https://git-scm.com",
    "VS Code": "https://code.visualstudio.com",
    "CI/CD": "https://github.com/features/actions",
    "GitHub Actions": "https://github.com/features/actions",
    "Nginx": "https://nginx.org",
    "OpenAI": "https://openai.com",
    "Markdown": "https://www.markdownguide.org",
    "better-auth": "https://www.better-auth.com",
    "Drizzle": "https://orm.drizzle.team",
    "shadcn/ui": "https://ui.shadcn.com",
    "Ed25519": "https://ed25519.cr.yp.to",
};

const ROW_1: string[] = [
    "React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS",
    "Framer Motion", "Docker", "PostgreSQL", "Prisma", "JavaScript",
    "HTML / CSS", "GraphQL", "Vite", "Zustand", "tRPC",
];

const ROW_2: string[] = [
    "Python", "Rust", "Java", "Git", "VS Code",
    "CI/CD", "GitHub Actions", "Nginx", "OpenAI", "Markdown",
    "better-auth", "Drizzle", "shadcn/ui", "Ed25519",
];

function TechItem({ label, index }: { label: string; index: number }) {
    const href = TECH_LINKS[label] || "#";
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-baseline gap-3 px-7 py-3 whitespace-nowrap select-none"
        >
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#5F564D] tabular-nums group-hover:text-[#B39F85] transition-colors duration-300">
                {String(index).padStart(2, "0")}
            </span>
            <span className="font-display text-[#B39F85] text-[clamp(20px,2.4vw,28px)] tracking-tight font-medium group-hover:text-[#DBC7A6] transition-colors duration-300">
                {label}
            </span>
            <span aria-hidden className="font-mono text-[12px] text-[#5F564D] group-hover:text-[#7D6B56] transition-colors duration-300">·</span>
        </a>
    );
}

function MarqueeRow({
    items,
    reverse = false,
    speed = 30,
    indexBase = 0,
    running = true,
}: {
    items: string[];
    reverse?: boolean;
    speed?: number;
    indexBase?: number;
    running?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(0);
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const isPausedRef = useRef(false);
    const singleWidthRef = useRef(0);

    const measure = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const itemCount = items.length;
        let w = 0;
        for (let i = 0; i < itemCount; i++) {
            const child = container.children[i] as HTMLElement;
            if (child) w += child.offsetWidth;
        }
        singleWidthRef.current = w;
        if (reverse) offsetRef.current = w;
    }, [items.length, reverse]);

    useEffect(() => {
        measure();
        const t = setTimeout(measure, 100);
        return () => clearTimeout(t);
    }, [measure]);

    useEffect(() => {
        // No rAF loop at all while the section is off-screen, the tab is
        // hidden, or the user prefers reduced motion.
        if (!running) return;
        lastTimeRef.current = 0;

        const animate = (time: number) => {
            if (lastTimeRef.current === 0) lastTimeRef.current = time;
            const delta = time - lastTimeRef.current;
            lastTimeRef.current = time;

            if (!isPausedRef.current && singleWidthRef.current > 0) {
                const px = (speed * delta) / 1000;
                if (reverse) {
                    offsetRef.current -= px;
                    if (offsetRef.current <= 0) offsetRef.current += singleWidthRef.current;
                } else {
                    offsetRef.current += px;
                    if (offsetRef.current >= singleWidthRef.current) offsetRef.current -= singleWidthRef.current;
                }

                if (containerRef.current) {
                    containerRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [speed, reverse, running]);

    const tripled = [...items, ...items, ...items];

    return (
        <div
            className="overflow-hidden border-b border-[#493B33]/35"
            onMouseEnter={() => { isPausedRef.current = true; }}
            onMouseLeave={() => { isPausedRef.current = false; }}
        >
            <div
                ref={containerRef}
                className="flex"
                style={{ width: "max-content", willChange: "transform" }}
            >
                {tripled.map((label, i) => (
                    <TechItem key={`${label}-${i}`} label={label} index={indexBase + (i % items.length) + 1} />
                ))}
            </div>
        </div>
    );
}

export default function TechSlider() {
    const sectionRef = useRef<HTMLElement>(null);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let onScreen = false;

        const update = () => setRunning(onScreen && !document.hidden && !reducedMotion.matches);

        const observer = new IntersectionObserver(
            ([entry]) => { onScreen = entry.isIntersecting; update(); },
            { rootMargin: "100px 0px" }
        );
        observer.observe(el);
        document.addEventListener("visibilitychange", update);
        reducedMotion.addEventListener("change", update);

        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", update);
            reducedMotion.removeEventListener("change", update);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="instruments"
            aria-label="Technology stack"
            className="relative overflow-hidden py-12 md:py-16 border-t border-[#493B33]/35 md:pl-[88px]"
            style={{ maxWidth: "100vw" }}
        >
            {/* Top folio */}
            <div className="container mx-auto px-6 md:px-12 mb-8 flex items-center gap-4">
                <span className="atlas-folio">§ 02 · Instruments</span>
                <span aria-hidden className="flex-1 atlas-rule" />
                <span className="atlas-folio">{ROW_1.length + ROW_2.length} entries</span>
            </div>

            {/* Top hairline */}
            <div className="border-t border-[#493B33]/35" aria-hidden />

            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#13110E] via-[#13110E]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#13110E] via-[#13110E]/80 to-transparent z-10 pointer-events-none" />

            <div>
                <MarqueeRow items={ROW_1} speed={32} indexBase={0} running={running} />
                <MarqueeRow items={ROW_2} reverse speed={24} indexBase={ROW_1.length} running={running} />
            </div>
        </section>
    );
}
