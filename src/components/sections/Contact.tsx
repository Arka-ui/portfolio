"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, CheckCircle, AlertCircle, Loader2, ArrowUpRight, Copy, Check } from "lucide-react";
import SessionIcon from "@/components/ui/SessionIcon";
import { useState } from "react";
import { sendContactMessage } from "@/lib/telemetry";
import { useLanguage } from "@/context/LanguageContext";

const SESSION_ID = "05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54";

type Status = "idle" | "loading" | "success" | "error";

const INPUT_CLASS =
    "w-full bg-transparent border border-[#493B33]/55 rounded-xl px-5 py-3.5 text-[#DBC7A6] text-sm focus:outline-none focus:border-[#DBC7A6]/60 focus:bg-[#DBC7A6]/[0.03] transition-all placeholder-[#5F564D]";

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
        <section id="contact" className="relative py-24 md:py-36 border-t border-[#493B33]/25 overflow-hidden md:pl-[72px]">
            {/* Background accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-[#B39F85]/[0.03] via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#DBC7A6]/[0.025] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] bg-[#4B3E26]/[0.18] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 md:mb-20"
                >
                    <span className="label-display mb-4 block">{t("contact.label")}</span>
                    <h2 className="font-display font-bold text-[clamp(40px,7vw,96px)] leading-[0.88] tracking-tighter">
                        <span className="text-[#DBC7A6]">Let&apos;s build</span><br />
                        <span className="text-grad-warm">something</span><br />
                        <span className="text-[#7D6B56]">great.</span>
                    </h2>
                    <p className="text-base text-[#B39F85] max-w-md leading-relaxed mt-6">
                        {t("contact.open_for")}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-12 gap-8 md:gap-12">
                    {/* Left: info cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="md:col-span-4 space-y-4"
                    >
                        {/* Session ID — selectable, with copy button + "no session?" link */}
                        <div className="bento-card w-full p-5 flex flex-col gap-3 group hover:border-[#DBC7A6]/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#DBC7A6]/[0.06] border border-[#DBC7A6]/[0.14] flex items-center justify-center shrink-0 group-hover:bg-[#DBC7A6]/[0.1] transition-colors">
                                    <SessionIcon size={16} className="text-[#B39F85] group-hover:text-[#DBC7A6] transition-colors" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="label-mono text-[9px] mb-0.5 block">
                                        {t("contact.session")}
                                    </span>
                                    <span
                                        className="text-[10px] text-[#B39F85] font-mono break-all line-clamp-1 select-all cursor-text"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {SESSION_ID}
                                    </span>
                                </div>
                                <button
                                    onClick={copySession}
                                    aria-label="Copy Session ID"
                                    className="shrink-0 w-8 h-8 rounded-lg border border-[#493B33]/55 bg-[#251E18]/60 hover:bg-[#DBC7A6]/[0.08] hover:border-[#DBC7A6]/35 text-[#7D6B56] hover:text-[#DBC7A6] transition-all flex items-center justify-center"
                                >
                                    {sessionCopied ? <Check size={13} className="text-[#DBC7A6]" /> : <Copy size={13} />}
                                </button>
                            </div>
                            <a
                                href="https://getsession.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-[#7D6B56] hover:text-[#DBC7A6] transition-colors underline underline-offset-4 decoration-[#493B33] hover:decoration-[#B39F85]/60 self-start uppercase tracking-wider"
                            >
                                download SESSION
                            </a>
                        </div>

                        {/* Location */}
                        <div className="bento-card p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#B39F85]/[0.06] border border-[#B39F85]/[0.14] flex items-center justify-center shrink-0">
                                <MapPin size={16} className="text-[#B39F85]" />
                            </div>
                            <div>
                                <span className="label-mono text-[9px] mb-0.5 block">Location</span>
                                <span className="text-sm text-[#B39F85]">{t("contact.location")}</span>
                            </div>
                        </div>

                        {/* GitHub */}
                        <a
                            href="https://github.com/arka-ui"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bento-card p-5 flex items-center gap-4 group hover:border-[#B39F85]/30 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#251E18]/60 border border-[#493B33]/50 flex items-center justify-center shrink-0">
                                <ArrowUpRight size={16} className="text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors" />
                            </div>
                            <div>
                                <span className="label-mono text-[9px] mb-0.5 block">GitHub</span>
                                <span className="text-sm text-[#B39F85] group-hover:text-[#DBC7A6] transition-colors">@arka-ui</span>
                            </div>
                        </a>
                    </motion.div>

                    {/* Right: form */}
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
                                    <div className="w-16 h-16 rounded-2xl bg-[#DBC7A6]/10 border border-[#DBC7A6]/25 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-[#DBC7A6]" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-2xl text-[#DBC7A6] mb-2">{t("contact.success_title")}</h3>
                                        <p className="text-[#B39F85] text-sm leading-relaxed max-w-xs">{t("contact.success_desc")}</p>
                                    </div>
                                    <button onClick={() => setStatus("idle")} className="text-xs font-mono text-[#7D6B56] hover:text-[#DBC7A6] transition-colors mt-2">
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
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#d46a5c]/[0.08] border border-[#d46a5c]/25 text-[#d46a5c] text-sm">
                                            <AlertCircle size={15} className="shrink-0" />
                                            {errMsg}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="group w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#DBC7A6] text-[#13110E] rounded-xl font-bold text-sm hover:bg-[#E9D7B7] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
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
