"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, CheckCircle, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";
import SessionIcon from "@/components/ui/SessionIcon";
import { useState } from "react";
import { sendContactMessage } from "@/lib/telemetry";
import { useLanguage } from "@/context/LanguageContext";

const SESSION_ID = "05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54";

type Status = "idle" | "loading" | "success" | "error";

const INPUT_CLASS =
    "w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-amber-500/40 focus:bg-amber-500/[0.03] transition-all placeholder-white/15 backdrop-blur-sm";

export default function Contact() {
    const { t } = useLanguage();
    const [name,    setName]    = useState("");
    const [email,   setEmail]   = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status,  setStatus]  = useState<Status>("idle");
    const [errMsg,  setErrMsg]  = useState("");
    const [sessionCopied, setSessionCopied] = useState(false);

    const copySession = () => {
        navigator.clipboard.writeText(SESSION_ID);
        setSessionCopied(true);
        setTimeout(() => setSessionCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrMsg("");

        try {
            await sendContactMessage({ name, email, subject, message });
            setStatus("success");
            setName(""); setEmail(""); setSubject(""); setMessage("");
        } catch (err: unknown) {
            setErrMsg(err instanceof Error ? err.message : "Unexpected error, please try again.");
            setStatus("error");
        }
    };

    return (
        <section id="contact" className="relative py-20 md:py-32 border-t border-white/[0.04] overflow-hidden">
            {/* Dramatic gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-amber-500/[0.04] via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] bg-amber-500/[0.04] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Top: dramatic headline full-width */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 md:mb-20"
                >
                    <span className="label-mono mb-4 block">{t("contact.label")}</span>
                    <h2 className="font-heading font-black text-[clamp(40px,7vw,96px)] leading-[0.88] tracking-tighter">
                        <span className="text-white">Let&apos;s build</span><br />
                        <span className="text-gradient">something</span><br />
                        <span className="text-white/80">great.</span>
                    </h2>
                    <p className="text-base text-white/35 max-w-md leading-relaxed mt-6">
                        {t("contact.open_for")}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-12 gap-8 md:gap-12">
                    {/* Left: info cards — 4 cols */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="md:col-span-4 space-y-4"
                    >
                        {/* Session ID */}
                        <button
                            onClick={copySession}
                            className="bento-card w-full p-5 flex items-center gap-4 text-left group hover:border-amber-500/15 transition-all duration-300"
                            aria-label="Copy Session ID"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.12] flex items-center justify-center shrink-0 group-hover:bg-amber-500/[0.1] transition-colors">
                                <SessionIcon size={16} className="text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                            </div>
                            <div className="min-w-0">
                                <span className="label-mono text-[9px] mb-0.5 block">
                                    {sessionCopied ? "✓ Copied!" : t("contact.session")}
                                </span>
                                <span className="text-[10px] text-white/50 font-mono break-all group-hover:text-white/70 transition-colors line-clamp-1">
                                    {SESSION_ID}
                                </span>
                            </div>
                        </button>

                        {/* Location */}
                        <div className="bento-card p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.12] flex items-center justify-center shrink-0">
                                <MapPin size={16} className="text-teal-400/60" />
                            </div>
                            <div>
                                <span className="label-mono text-[9px] mb-0.5 block">Location</span>
                                <span className="text-sm text-white/60">{t("contact.location")}</span>
                            </div>
                        </div>

                        {/* GitHub link */}
                        <a
                            href="https://github.com/arka-ui"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bento-card p-5 flex items-center gap-4 group hover:border-white/[0.1] transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                <ArrowUpRight size={16} className="text-white/40 group-hover:text-white/70 transition-colors" />
                            </div>
                            <div>
                                <span className="label-mono text-[9px] mb-0.5 block">GitHub</span>
                                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">@arka-ui</span>
                            </div>
                        </a>
                    </motion.div>

                    {/* Right: form — 8 cols */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="md:col-span-8"
                    >
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center text-center py-20 gap-5 bento-card"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-2xl text-white mb-2">{t("contact.success_title")}</h3>
                                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">{t("contact.success_desc")}</p>
                                    </div>
                                    <button onClick={() => setStatus("idle")} className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors mt-2">
                                        {t("contact.send_another")}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="bento-card p-8 md:p-10 space-y-5"
                                >
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="label-mono text-[9px]">{t("contact.name")}</label>
                                            <input id="name" type="text" required placeholder={t("contact.placeholder_name")} value={name} onChange={e => setName(e.target.value)} autoComplete="name" inputMode="text" enterKeyHint="next" className={INPUT_CLASS} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="label-mono text-[9px]">{t("contact.email")}</label>
                                            <input id="email" type="email" required placeholder={t("contact.placeholder_email")} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email" enterKeyHint="next" className={INPUT_CLASS} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="label-mono text-[9px]">{t("contact.subject")}</label>
                                        <input id="subject" type="text" required placeholder={t("contact.placeholder_subject")} value={subject} onChange={e => setSubject(e.target.value)} autoComplete="off" inputMode="text" enterKeyHint="next" className={INPUT_CLASS} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="label-mono text-[9px]">{t("contact.message")}</label>
                                        <textarea id="message" rows={5} required placeholder={t("contact.placeholder_message")} value={message} onChange={e => setMessage(e.target.value)} autoComplete="off" enterKeyHint="send" className={`${INPUT_CLASS} resize-none`} />
                                    </div>

                                    {status === "error" && errMsg && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
                                            <AlertCircle size={15} className="shrink-0" />
                                            {errMsg}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="group w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_100%] text-black rounded-2xl font-bold text-sm hover:bg-[position:100%_0] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-500 active:scale-[0.98]"
                                    >
                                        {status === "loading" ? (
                                            <><Loader2 size={14} className="animate-spin" />{t("contact.sending")}</>
                                        ) : (
                                            <>{t("contact.send")}<Send size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" /></>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
