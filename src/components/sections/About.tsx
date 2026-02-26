"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Signature scan-reveal — Arka's unique headline
   A glowing scan line sweeps left→right as the
   text is simultaneously unmasked beneath it.
───────────────────────────────────────────── */
function ScanReveal({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <div className={`relative ${className}`}>
            {/* Sweep glow — right leading edge only */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.15, delay, ease: [0.37, 0, 0.63, 1] }}
                className="absolute inset-0 pointer-events-none z-10 origin-left"
                style={{
                    background:
                        "linear-gradient(to right, transparent 0%, transparent calc(100% - 6px), rgba(99,102,241,0.45) calc(100% - 3px), rgba(167,139,250,0.9) 100%)",
                    filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))",
                }}
            />
            {/* Text — revealed via clip-path, same timing */}
            <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.15, delay, ease: [0.37, 0, 0.63, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Count-up number — animates 0 → target
───────────────────────────────────────────── */
function CountUp({
    to,
    suffix = "",
    duration = 1.6,
}: {
    to: number;
    suffix?: string;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.8 });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / (duration * 1000), 1);
            // Ease out quad
            const eased = 1 - (1 - p) * (1 - p);
            setCount(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, to, duration]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

/* ─────────────────────────────────────────────
   Stats data
───────────────────────────────────────────── */
const STATS = [
    { numeric: 3,    suffix: "+", label: "Years building"    },
    { numeric: 15,   suffix: "+", label: "Projects shipped"  },
    { numeric: null, raw: "OSS",  label: "Open-source first" },
    { numeric: 4,    suffix: "",  label: "Languages spoken"  },
];

const BELIEFS = [
    {
        tag: "00",
        title: "Free by default",
        body: "If a service can be free, it should be. You pay only for infrastructure — servers, hosting, maintenance — never for access itself.",
    },
    {
        tag: "01",
        title: "Craft over hype",
        body: "Every interface I ship is tested edge-to-edge, on every viewport. I care about the 1-pixel detail that most people skip.",
    },
    {
        tag: "02",
        title: "Open source always",
        body: "Code lives longer when it belongs to the community. Contributing and publishing openly is how I keep that promise.",
    },
];

const TAGS = [
    "React", "Next.js", "TypeScript", "Clean Code",
    "Open Source", "UI / UX", "Performance",
    "API Design", "DX", "Real-time",
];

export default function About() {
    return (
        <section id="about-intro" className="py-24 md:py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">

                {/* ── Row 1: headline + bio ── */}
                <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start mb-20">

                    {/* Left — scan-reveal headline */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="label-mono mb-5 block"
                        >
                            About
                        </motion.span>

                        <h2 className="font-heading font-black text-[clamp(38px,5.5vw,80px)] leading-[0.92] tracking-tighter">
                            <ScanReveal delay={0.1} className="mb-1">
                                <span className="text-white">Developer,</span>
                            </ScanReveal>
                            <ScanReveal delay={0.28} className="mb-1">
                                <span className="text-white/25">builder,</span>
                            </ScanReveal>
                            <ScanReveal delay={0.45}>
                                <span className="text-white">problem solver.</span>
                            </ScanReveal>
                        </h2>

                        {/* Tag pills */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 1.5 }}
                            className="mt-8 flex flex-wrap gap-2"
                        >
                            {TAGS.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 rounded-full border border-white/[0.07] bg-white/[0.02] text-[11px] font-mono text-white/35 tracking-wide hover:text-white/60 hover:border-white/[0.12] transition-all duration-200 cursor-default"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.7 }}
                            className="mt-6 text-[11px] font-mono text-white/15 tracking-widest select-none"
                        >
                            — arka.is-a.dev
                        </motion.p>
                    </div>

                    {/* Right — bio + stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <p className="text-[17px] text-white/60 leading-relaxed">
                                I&apos;m Arka — a self-taught full-stack developer from France,
                                building since 2023. I focus on clean code, thoughtful interfaces,
                                and shipping things that actually work.
                            </p>
                            <p className="text-[17px] text-white/60 leading-relaxed">
                                Co-founder of <span className="text-white/80 font-medium">EclozionMC</span> —
                                the Minecraft server I actually cared about. Beyond that, I build
                                open-source tools, experiment with new stacks, and try to make
                                software feel less annoying for everyone who uses it.
                            </p>
                            <p className="text-[17px] text-white/60 leading-relaxed">
                                I write French, English, and code — in that order of confidence. Currently
                                deep into systems architecture, developer tooling, and anything
                                that involves real-time data.
                            </p>
                        </div>

                        {/* Stats grid with count-up */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.6 }}
                                    transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                    className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 p-5 md:p-6 flex flex-col gap-1 group"
                                >
                                    <span className="font-heading font-black text-2xl text-white tracking-tight group-hover:text-indigo-200 transition-colors duration-300">
                                        {stat.numeric !== null && stat.numeric !== undefined ? (
                                            <CountUp to={stat.numeric} suffix={stat.suffix} />
                                        ) : (
                                            stat.raw
                                        )}
                                    </span>
                                    <span className="text-xs text-white/35 leading-tight">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Row 2: What I believe in ── */}
                <div className="border-t border-white/[0.06] pt-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="label-mono mb-10 block"
                    >
                        What I believe in
                    </motion.span>

                    <div className="grid md:grid-cols-3 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
                        {BELIEFS.map((b, i) => (
                            <motion.div
                                key={b.tag}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 p-7 flex flex-col gap-4 overflow-hidden"
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-indigo-500/[0.05] to-transparent" />

                                <span className="font-mono text-[11px] text-indigo-400/50 tracking-widest">{b.tag}</span>
                                <h3 className="font-heading font-bold text-lg text-white tracking-tight leading-snug">
                                    {b.title}
                                </h3>
                                <p className="text-[14px] text-white/45 leading-relaxed">{b.body}</p>

                                {/* Bottom accent on hover */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/30 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
