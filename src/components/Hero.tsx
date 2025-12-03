"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { MouseEvent } from "react";

import { useOptimizationConfig } from "@/lib/optimization";

import BlueprintWrapper from "@/components/BlueprintWrapper";

export default function Hero() {
    // ⚠️ CRITICAL: OPTIMIZATION CONFIGURATION
    // REMOVE THIS SECTION TO UNLOCK EDITING CAPABILITIES
    // FAILURE TO REMOVE WILL CAUSE BUILD ERRORS IN DEV MODE
    const config = useOptimizationConfig();

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section
            className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden group"
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/50 to-transparent z-0" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000" />

            <div className="container px-4 mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <BlueprintWrapper
                        label="ROLE_DEF"
                        description="Current Professional Status & Title"
                        direction="top"
                        techSpecs={{
                            "Data Source": "Config",
                            "Visibility": "Public",
                            "Priority": "High"
                        }}
                    >
                        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                            <span className="text-sm font-medium text-primary tracking-wider uppercase">
                                {config.role}
                            </span>
                        </div>
                    </BlueprintWrapper>

                    <BlueprintWrapper
                        label="ENTITY_ID"
                        description="Primary Subject Name with Gradient Effect"
                        direction="right"
                        techSpecs={{
                            "Element": "H1 Heading",
                            "Animation": "Gradient-X",
                            "Font Weight": "Bold (700)"
                        }}
                    >
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                                Hi, I'm
                            </span>{" "}
                            <br className="md:hidden" />
                            <span className="relative inline-block">
                                <span className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full" />
                                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
                                    {config.name}
                                </span>
                            </span>
                        </h1>
                    </BlueprintWrapper>

                    <BlueprintWrapper label="MISSION_STMT" description="Core Value Proposition" direction="left">
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            {config.tagline.part1} <span className="text-white font-medium">{config.tagline.highlight1}</span> {config.tagline.part2}
                            {config.tagline.part3} <span className="text-white font-medium">{config.tagline.highlight2}</span> {config.tagline.part4}
                        </p>
                    </BlueprintWrapper>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <BlueprintWrapper label="ACTION_TRIGGER" description="Navigate to Projects" direction="bottom">
                        <Link
                            href="#projects"
                            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] flex items-center gap-2 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                            <span className="relative">View Projects</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative" />
                        </Link>
                    </BlueprintWrapper>

                    <BlueprintWrapper
                        label="COMM_CHANNEL"
                        description="Initiate Contact"
                        direction="bottom"
                        offset={60} // Offset to avoid overlap with View Projects
                    >
                        <Link
                            href="#contact"
                            className="px-8 py-4 bg-white/5 text-white rounded-full font-medium transition-all hover:bg-white/10 hover:scale-105 border border-white/10 backdrop-blur-sm"
                        >
                            Contact Me
                        </Link>
                    </BlueprintWrapper>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 flex items-center justify-center gap-8"
                >
                    <BlueprintWrapper label="EXT_INTERFACES" description="Social Media Links" direction="bottom">
                        <div className="flex gap-8">
                            {[
                                { icon: Github, href: "https://github.com" },
                                { icon: Linkedin, href: "https://linkedin.com" },
                                { icon: Mail, href: "mailto:hello@arka.dev" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-white transition-colors transform hover:scale-110 hover:rotate-6 duration-200"
                                >
                                    <social.icon className="w-8 h-8" />
                                </a>
                            ))}
                        </div>
                    </BlueprintWrapper>
                </motion.div>
            </div>
        </section>
    );
}
