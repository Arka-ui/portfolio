"use client";

import { useRef, useEffect, useCallback } from "react";

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
};

const ROW_1: { label: string; color: string }[] = [
    { label: "React",          color: "#61dafb" },
    { label: "TypeScript",     color: "#3178c6" },
    { label: "Next.js",        color: "#e2e8f0" },
    { label: "Node.js",        color: "#8cc84b" },
    { label: "Tailwind CSS",   color: "#38bdf8" },
    { label: "Framer Motion",  color: "#bb22ff" },
    { label: "Docker",         color: "#2496ed" },
    { label: "PostgreSQL",     color: "#336791" },
    { label: "Prisma",         color: "#5a67d8" },
    { label: "JavaScript",     color: "#f0db4f" },
    { label: "HTML / CSS",     color: "#e34c26" },
    { label: "GraphQL",        color: "#e535ab" },
    { label: "Vite",           color: "#646cff" },
    { label: "Zustand",        color: "#e8712a" },
    { label: "tRPC",           color: "#398ccb" },
];

const ROW_2: { label: string; color: string }[] = [
    { label: "Python",         color: "#3572a5" },
    { label: "Rust",           color: "#dea584" },
    { label: "Java",           color: "#b07219" },
    { label: "Git",            color: "#f14e32" },
    { label: "VS Code",        color: "#007acc" },
    { label: "CI/CD",          color: "#e8712a" },
    { label: "GitHub Actions", color: "#2088ff" },
    { label: "Nginx",          color: "#009900" },
    { label: "OpenAI",         color: "#10a37f" },
    { label: "Markdown",       color: "#083fa1" },
    { label: "better-auth",    color: "#2dd4bf" },
    { label: "Drizzle",        color: "#c5f74f" },
    { label: "shadcn/ui",      color: "#f4f4f5" },
];

function TechBadge({ label, color }: { label: string; color: string }) {
    const href = TECH_LINKS[label] || "#";
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3.5 px-6 py-4 rounded-xl border border-white/[0.05] bg-[#0e1e3a]/40 text-[14px] font-mono tracking-wider text-white/40 whitespace-nowrap hover:text-white hover:border-[#ff6b35]/20 hover:bg-[#ff6b35]/[0.03] transition-all duration-400 cursor-pointer select-none overflow-hidden"
        >
            {/* Hover gradient flash */}
            <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}
            />
            <span
                className="relative w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 group-hover:scale-125"
                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}55`,
                }}
            />
            <span className="relative">{label}</span>
            <span
                className="absolute bottom-3 left-6 right-6 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: `${color}40` }}
            />
        </a>
    );
}

function MarqueeRow({
    items,
    reverse = false,
    speed = 30,
}: {
    items: { label: string; color: string }[];
    reverse?: boolean;
    speed?: number;
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
            if (child) w += child.offsetWidth + 12;
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
    }, [speed, reverse]);

    const tripled = [...items, ...items, ...items];

    return (
        <div
            className="overflow-hidden"
            onMouseEnter={() => { isPausedRef.current = true; }}
            onMouseLeave={() => { isPausedRef.current = false; }}
        >
            <div
                ref={containerRef}
                className="flex gap-3"
                style={{ width: "max-content", willChange: "transform" }}
            >
                {tripled.map((item, i) => (
                    <TechBadge key={`${item.label}-${i}`} label={item.label} color={item.color} />
                ))}
            </div>
        </div>
    );
}

export default function TechSlider() {
    return (
        <section
            aria-label="Technology stack"
            className="relative overflow-hidden py-16 border-t border-b border-white/[0.04]"
            style={{ maxWidth: "100vw" }}
        >
            {/* Top label */}
            <div className="container mx-auto px-6 md:px-12 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse" />
                    <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest">
                        Technologies I work with
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
                </div>
            </div>

            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-8 sm:w-20 md:w-48 bg-gradient-to-r from-[#060d1f] via-[#060d1f]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 sm:w-20 md:w-48 bg-gradient-to-l from-[#060d1f] via-[#060d1f]/80 to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col gap-5">
                <MarqueeRow items={ROW_1} speed={32} />
                <MarqueeRow items={ROW_2} reverse speed={24} />
            </div>

            {/* Bottom count */}
            <div className="container mx-auto px-6 md:px-12 mt-6">
                <div className="flex items-center justify-end gap-2">
                    <span className="text-[11px] font-mono text-white/15">
                        {ROW_1.length + ROW_2.length} tools in the belt
                    </span>
                </div>
            </div>
        </section>
    );
}
