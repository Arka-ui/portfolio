"use client";

import { motion } from "framer-motion";

const STATS = [
    { value: "3+", label: "Years building" },
    { value: "15+", label: "Projects shipped" },
    { value: "iOS", label: "City Hall intern" },
    { value: "4", label: "Languages spoken" },
];

export default function About() {
    return (
        <section id="about-intro" className="py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

                    {/* Left — label + headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="label-mono mb-5 block">About</span>
                        <h2 className="font-heading font-black text-[clamp(40px,6vw,80px)] leading-[0.9] tracking-tighter text-white">
                            Developer,<br />
                            <span className="text-white/25">builder,</span><br />
                            problem solver.
                        </h2>
                    </motion.div>

                    {/* Right — bio + stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <p className="text-[17px] text-white/60 leading-relaxed">
                                I&apos;m Arka — a full-stack developer based in France. I build web applications,
                                iOS apps, and digital products with a focus on clean code and interfaces
                                that feel right.
                            </p>
                            <p className="text-[17px] text-white/60 leading-relaxed">
                                Co-founder of EclozionMC. Interned as an iOS developer at Cambrai City Hall
                                where I shipped a Swift news app. Self-taught since 2023, constantly
                                learning and pushing forward.
                            </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
                            {STATS.map((stat, i) => (
                                <div key={i} className="bg-white/[0.02] p-6 flex flex-col gap-1">
                                    <span className="font-heading font-black text-2xl text-white tracking-tight">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs text-white/35 leading-tight">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
