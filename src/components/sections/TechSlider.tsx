"use client";

import { motion } from "framer-motion";

/* ── Tech data with brand accent colours ── */
const ROW_1 = [
    { label: "React",          color: "#61dafb" },
    { label: "TypeScript",     color: "#3178c6" },
    { label: "Next.js",        color: "#e2e8f0" },
    { label: "Node.js",        color: "#8cc84b" },
    { label: "Tailwind CSS",   color: "#38bdf8" },
    { label: "Framer Motion",  color: "#bb22ff" },
    { label: "Docker",         color: "#2496ed" },
    { label: "PostgreSQL",     color: "#336791" },
    { label: "Prisma",         color: "#5a67d8" },
    { label: "Redis",          color: "#dc382d" },
    { label: "JavaScript",     color: "#f0db4f" },
    { label: "HTML / CSS",     color: "#e34c26" },
];

const ROW_2 = [
    { label: "Python",   color: "#3572a5" },
    { label: "Go",       color: "#00add8" },
    { label: "Rust",     color: "#dea584" },
    { label: "Java",     color: "#b07219" },
    { label: "Kotlin",   color: "#7f52ff" },
    { label: "AWS",      color: "#ff9900" },
    { label: "Git",      color: "#f14e32" },
    { label: "Figma",    color: "#f24e1e" },
    { label: "VS Code",  color: "#007acc" },
    { label: "Linux",    color: "#fcc624" },
    { label: "GraphQL",  color: "#e535ab" },
    { label: "CI/CD",    color: "#6366f1" },
];

/* ── Single badge pill ── */
function TechBadge({ label, color }: { label: string; color: string }) {
    return (
        <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border border-white/[0.07] bg-white/[0.025] text-[11px] font-mono tracking-widest text-white/40 whitespace-nowrap hover:text-white/70 hover:border-white/[0.14] transition-all duration-300 cursor-default select-none">
            <span
                className="w-1.5 h-1.5 rounded-full shrink-0 opacity-75"
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    );
}

/* ── Infinite marquee row ── */
function MarqueeRow({
    items,
    reverse = false,
    duration = 35,
}: {
    items: { label: string; color: string }[];
    reverse?: boolean;
    duration?: number;
}) {
    const doubled = [...items, ...items];
    return (
        <div
            className="flex gap-3 w-max"
            style={{ animation: `marquee ${duration}s linear infinite${reverse ? " reverse" : ""}` }}
        >
            {doubled.map((item, i) => (
                <TechBadge key={i} label={item.label} color={item.color} />
            ))}
        </div>
    );
}

/* ── Section ── */
export default function TechSlider() {
    return (
        <motion.section
            aria-label="Technology stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="relative overflow-hidden py-7 border-b border-white/[0.05]"
        >
            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            {/* Glow layer beneath rows */}
            <div className="absolute inset-0 bg-indigo-500/[0.015] pointer-events-none" />

            <div className="flex flex-col gap-3">
                <MarqueeRow items={ROW_1} duration={32} />
                <MarqueeRow items={ROW_2} reverse duration={40} />
            </div>
        </motion.section>
    );
}
