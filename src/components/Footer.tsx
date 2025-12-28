"use client";

import { ArrowUp, Github, Twitter, Linkedin, Mail } from "lucide-react";
import BlueprintWrapper from "@/components/BlueprintWrapper";
import SystemFailure from "@/components/ui/SystemFailure";
import { useSystemTelemetry } from "@/lib/sys-core";
import { useChristmas } from "@/context/ChristmasContext";
import { motion } from "framer-motion";

export default function Footer() {
    const health = useSystemTelemetry();
    const { isChristmasTime } = useChristmas();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (health.status === 'critical') return <SystemFailure />;

    const socialLinks = [
        { icon: Github, href: "https://github.com/arka-ui", label: "Github" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Mail, href: "mailto:hello@arka.dev", label: "Email" },
    ];

    return (
        <footer className={`relative pt-24 pb-12 overflow-hidden ${isChristmasTime ? 'snow-cap' : ''}`}>
            {/* Gradient Dust */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-sm" />

            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-white">
                            Let's build something <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                extraordinary.
                            </span>
                        </h2>
                        <p className="text-slate-400 max-w-md">
                            Open for freelance opportunities and collaborations.
                            Let's maximize your digital potential.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-start md:justify-end">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-indigo-300 transition-all group"
                            >
                                <social.icon size={24} strokeWidth={1.5} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
                    <p className="text-sm text-slate-500 font-mono">
                        &copy; {new Date().getFullYear()} ARKA_DEV. SYSTEM_ONLINE
                    </p>

                    <div className="flex items-center gap-6">
                        <BlueprintWrapper
                            label="SYS_INFO"
                            description="Build Info"
                            direction="top"
                        >
                            <span className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-help">
                                v2.0.4 [STABLE]
                            </span>
                        </BlueprintWrapper>

                        <button
                            onClick={scrollToTop}
                            className="p-3 rounded-full bg-white/5 hover:bg-indigo-500 transition-colors group"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={16} className="text-slate-400 group-hover:text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
