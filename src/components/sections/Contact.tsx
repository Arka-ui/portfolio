"use client";

import { motion } from "framer-motion";
import { Send, Mail, MapPin, Wifi } from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';
import BlueprintWrapper from "@/components/BlueprintWrapper";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
    // Note: If you see a 403 Forbidden error, check your Formspree settings.
    // Ensure the domain (localhost or production) is allowed in your Formspree dashboard.
    const [state, handleSubmit] = useForm("xblnyneb");
    const { t } = useLanguage();

    if (state.succeeded) {
        return (
            <section className="py-32 container mx-auto px-4 relative overflow-hidden" id="contact">
                <div className="max-w-md mx-auto text-center border border-green-500/30 bg-green-500/10 p-12 rounded-2xl backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50"
                    >
                        <Wifi className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4 font-mono text-green-400">{t("contact.success_title")}</h2>
                    <p className="text-green-300/80 font-mono">{t("contact.success_desc")}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-32 relative overflow-hidden" id="contact">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* Left Column: Status & Info */}
                    <div className="space-y-12">
                        <BlueprintWrapper label="COMM_HUB" description="Signal Status" direction="right">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-sm"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    SIGNAL_ONLINE
                                </motion.div>

                                <h2 className="text-5xl md:text-6xl font-heading font-bold text-white tracking-tighter">
                                    {t("contact.title")}
                                </h2>
                                <p className="text-slate-400 text-lg max-w-md">
                                    {t("contact.subtitle")}
                                </p>
                            </div>
                        </BlueprintWrapper>

                        <div className="space-y-6 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <Mail size={20} className="text-indigo-400" />
                                </div>
                                <div className="font-mono text-sm">
                                    <span className="block text-slate-500 text-xs mb-1">EMAIL_TARGET</span>
                                    hello@arka.dev
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <MapPin size={20} className="text-cyan-400" />
                                </div>
                                <div className="font-mono text-sm">
                                    <span className="block text-slate-500 text-xs mb-1">LOCATION_NODE</span>
                                    Remote / Digital Space
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Terminal Form */}
                    <BlueprintWrapper label="INPUT_TERMINAL" description="Data Entry Point" direction="left">
                        <div className="relative bg-slate-950/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t("contact.name")}</label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all font-mono text-sm"
                                            placeholder={t("contact.placeholder_name")}
                                            required
                                        />
                                        <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t("contact.email")}</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all font-mono text-sm"
                                            placeholder={t("contact.placeholder_email")}
                                            required
                                        />
                                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-xs font-mono text-slate-500 uppercase tracking-wider">Subject</label>
                                    <input
                                        id="subject"
                                        type="text"
                                        name="subject"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all font-mono text-sm"
                                        placeholder="Project Inquiry"
                                        required
                                    />
                                    <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-400 text-xs" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-mono text-slate-500 uppercase tracking-wider">{t("contact.message")}</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all resize-none font-mono text-sm"
                                        placeholder={t("contact.placeholder_message")}
                                        required
                                    />
                                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={state.submitting}
                                    className="w-full group relative flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-lg font-bold text-sm uppercase tracking-wide transition-all hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="relative flex items-center gap-2">
                                        {state.submitting ? 'Transmitting...' : 'Execute Transmission'}
                                        {!state.submitting && <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </BlueprintWrapper>
                </div>
            </div>
        </section>
    );
}
