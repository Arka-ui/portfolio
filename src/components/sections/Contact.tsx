"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import SessionIcon from "@/components/ui/SessionIcon";
import { useState } from "react";
import { sendContactMessage } from "@/lib/telemetry";
import { useLanguage } from "@/context/LanguageContext";

type Status = "idle" | "loading" | "success" | "error";

const INPUT_CLASS =
    "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] transition-all placeholder-white/20";

export default function Contact() {
    const { t } = useLanguage();
    const [name,    setName]    = useState("");
    const [email,   setEmail]   = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status,  setStatus]  = useState<Status>("idle");
    const [errMsg,  setErrMsg]  = useState("");

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
        <section id="contact" className="py-14 md:py-28 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-10 md:gap-24 items-start">

                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="label-mono mb-5 block">{t("contact.label")}</span>
                            <h2 className="font-heading font-black text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white mb-6">
                                Let&apos;s build<br />
                                <span className="text-white/25">something</span><br />
                                great.
                            </h2>
                            <p className="text-[16px] text-white/45 max-w-sm leading-relaxed">
                                {t("contact.open_for")}
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <SessionIcon size={16} className="text-white/40" />
                                </div>
                                <div>
                                    <span className="label-mono text-[10px] mb-0.5 block">{t("contact.session")}</span>
                                    <span className="text-[11px] text-white/70 font-mono break-all">05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <MapPin size={16} className="text-white/40" />
                                </div>
                                <div>
                                    <span className="label-mono text-[10px] mb-0.5 block">Location</span>
                                    <span className="text-sm text-white/70">{t("contact.location")}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — form */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <AnimatePresence mode="wait">
                            {/* ── Success state ── */}
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center text-center py-16 gap-5 border border-white/[0.06] rounded-2xl bg-white/[0.02]"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-xl text-white mb-2">{t("contact.success_title")}</h3>
                                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                                            {t("contact.success_desc")}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        {t("contact.send_another")}
                                    </button>
                                </motion.div>
                            ) : (
                                /* ── Form ── */
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="label-mono text-[10px]">{t("contact.name")}</label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                placeholder={t("contact.placeholder_name")}
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                autoComplete="name"
                                                inputMode="text"
                                                enterKeyHint="next"
                                                className={INPUT_CLASS}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="label-mono text-[10px]">{t("contact.email")}</label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder={t("contact.placeholder_email")}
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                autoComplete="email"
                                                inputMode="email"
                                                enterKeyHint="next"
                                                className={INPUT_CLASS}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="label-mono text-[10px]">{t("contact.subject")}</label>
                                        <input
                                            id="subject"
                                            type="text"
                                            required
                                            placeholder={t("contact.placeholder_subject")}
                                            value={subject}
                                            onChange={e => setSubject(e.target.value)}
                                            autoComplete="off"
                                            inputMode="text"
                                            enterKeyHint="next"
                                            className={INPUT_CLASS}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="label-mono text-[10px]">{t("contact.message")}</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            required
                                            placeholder={t("contact.placeholder_message")}
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            autoComplete="off"
                                            enterKeyHint="send"
                                            className={`${INPUT_CLASS} resize-none`}
                                        />
                                    </div>

                                    {/* Error banner */}
                                    {status === "error" && errMsg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm"
                                        >
                                            <AlertCircle size={15} className="shrink-0" />
                                            {errMsg}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="group w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                {t("contact.sending")}
                                            </>
                                        ) : (
                                            <>
                                                {t("contact.send")}
                                                <Send size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </>
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

