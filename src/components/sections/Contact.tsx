"use client";

import { motion } from "framer-motion";
import { Send, Mail, MapPin, CheckCircle } from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';

export default function Contact() {
    const [state, handleSubmit] = useForm("xblnyneb");

    if (state.succeeded) {
        return (
            <section id="contact" className="py-28 border-t border-white/[0.06]">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center py-20"
                    >
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                        <h2 className="font-heading font-bold text-2xl text-white mb-3">Message sent</h2>
                        <p className="text-white/45 text-sm leading-relaxed">
                            Thanks for reaching out. I&apos;ll get back to you as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="label-mono mb-5 block">Contact</span>
                            <h2 className="font-heading font-black text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white mb-6">
                                Let&apos;s build<br />
                                <span className="text-white/25">something</span><br />
                                great.
                            </h2>
                            <p className="text-[16px] text-white/45 max-w-sm leading-relaxed">
                                Open for freelance work, collaborations, and interesting projects.
                                Don&apos;t hesitate to reach out.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <Mail size={16} className="text-white/40" />
                                </div>
                                <div>
                                    <span className="label-mono text-[10px] mb-0.5 block">Email</span>
                                    <span className="text-sm text-white/70 font-mono">hello@arka.dev</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <MapPin size={16} className="text-white/40" />
                                </div>
                                <div>
                                    <span className="label-mono text-[10px] mb-0.5 block">Location</span>
                                    <span className="text-sm text-white/70">France â€” available remotely</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right â€” form */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="label-mono text-[10px]">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Your name"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] transition-all placeholder-white/20"
                                    />
                                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="label-mono text-[10px]">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="your@email.com"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] transition-all placeholder-white/20"
                                    />
                                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="label-mono text-[10px]">Subject</label>
                                <input
                                    id="subject"
                                    type="text"
                                    name="subject"
                                    required
                                    placeholder="What's this about?"
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] transition-all placeholder-white/20"
                                />
                                <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-400 text-xs" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="label-mono text-[10px]">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    placeholder="Tell me about your project or idea..."
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] transition-all resize-none placeholder-white/20"
                                />
                                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs" />
                            </div>

                            <button
                                type="submit"
                                disabled={state.submitting}
                                className="group w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {state.submitting ? "Sending..." : "Send message"}
                                {!state.submitting && (
                                    <Send size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
