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
    { numeric: 3,  suffix: "+", label: "Years building" },
    { numeric: 15, suffix: "+", label: "Projects shipped" },
    { numeric: null, raw: "OSS",  label: "Open-source first" },
    { numeric: 4,  suffix: "",  label: "Languages spoken" },
];

export default function About() {
    return (
        <section id="about-intro" className="py-24 md:py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">

                    {/* Left — label + scan-reveal headline */}
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

                        {/* Signature scan-reveal per line */}
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

                        {/* Subtle signature mark */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 1.3 }}
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
                                I&apos;m Arka — a full-stack developer based in France. I build web
                                applications and digital products with a focus on clean code and
                                interfaces that feel right.
                            </p>
                            <p className="text-[17px] text-white/60 leading-relaxed">
                                Co-founder of EclozionMC — and the one who actually cared about the
                                project. I believe if a service can be free, it should be free and
                                open-source for everyone. Software, tools, access — no paywalls.
                                You pay only for infrastructure: servers, hosting, maintenance.
                                Never for access itself.
                            </p>
                            <p className="text-[17px] text-white/60 leading-relaxed">
                                Self-taught since 2023, always building, always pushing forward.
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
                                    <span className="text-xs text-white/35 leading-tight">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
