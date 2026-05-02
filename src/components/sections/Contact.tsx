"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { sendContactMessage } from "@/lib/telemetry";
import { useLanguage } from "@/context/LanguageContext";

const SESSION_ID = "05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54";

type Status = "idle" | "loading" | "success" | "error";

const FIELD_CLASS =
    "w-full bg-transparent border-0 border-b border-[#493B33]/55 px-0 py-3 text-[#DBC7A6] text-[15px] font-sans focus:outline-none focus:border-[#DBC7A6] transition-colors duration-300 placeholder-[#5F564D]";

const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

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

    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

    return (
        <section id="contact" className="relative py-24 md:py-32 border-t border-[#493B33]/35 overflow-hidden md:pl-[88px]">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Folio head */}
                <motion.div {...enter(0)} className="flex items-center gap-4 mb-10">
                    <span className="atlas-folio">§ 08 · Correspondence</span>
                    <span aria-hidden className="flex-1 atlas-rule" />
                    <span className="atlas-folio">{today}</span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    {...enter(0.05)}
                    className="font-display font-bold leading-[0.92] tracking-tighter text-[#DBC7A6] max-w-4xl mb-6"
                    style={{ fontSize: "clamp(40px, 7vw, 100px)" }}
                >
                    Begin a letter.<br />
                    <span className="italic font-medium text-[#B39F85]">Send a thought.</span><br />
                    <span className="text-[#7D6B56]">Build something.</span>
                </motion.h2>

                <motion.p
                    {...enter(0.1)}
                    className="text-[15px] text-[#B39F85] leading-[1.7] max-w-[64ch] mb-14 md:mb-20"
                >
                    {t("contact.open_for")}
                </motion.p>

                <div className="grid md:grid-cols-12 gap-12 md:gap-16">
                    {/* Letterhead column */}
                    <motion.aside {...enter(0.15)} className="md:col-span-4">
                        <div className="atlas-folio mb-3">Letterhead</div>
                        <div className="atlas-rule mb-6" aria-hidden />

                        <ul className="space-y-5 text-[14px] leading-[1.6]">
                            <li>
                                <span className="atlas-folio block mb-1">Sender</span>
                                <span className="font-display text-[#DBC7A6] text-[20px] tracking-tight font-medium block leading-tight">Arka</span>
                                <span className="text-[#B39F85] text-[13px]">{t("contact.location")}</span>
                            </li>

                            <li>
                                <span className="atlas-folio block mb-1">GitHub</span>
                                <a
                                    href="https://github.com/arka-ui"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="atlas-link text-[#B39F85] hover:text-[#DBC7A6] text-[14px]"
                                >
                                    @arka-ui ↗
                                </a>
                            </li>

                            <li>
                                <span className="atlas-folio block mb-1">{t("contact.session")}</span>
                                <button
                                    type="button"
                                    onClick={copySession}
                                    className="text-left text-[10.5px] font-mono text-[#7D6B56] hover:text-[#DBC7A6] transition-colors break-all leading-snug w-full"
                                    aria-label="Copy Session ID"
                                    title="Click to copy"
                                >
                                    {sessionCopied ? (
                                        <span className="inline-flex items-center gap-2 text-[#DBC7A6]">
                                            <Check size={11} /> Copied to clipboard
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-start gap-2">
                                            <Copy size={11} className="mt-[2px] shrink-0" />
                                            <span>{SESSION_ID}</span>
                                        </span>
                                    )}
                                </button>
                                <a
                                    href="https://getsession.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="atlas-folio block mt-2 hover:text-[#DBC7A6] transition-colors"
                                >
                                    Download Session ↗
                                </a>
                            </li>

                            <li>
                                <span className="atlas-folio block mb-1">Postmark</span>
                                <span className="text-[#B39F85] text-[13px] font-mono">{today}</span>
                            </li>
                        </ul>
                    </motion.aside>

                    {/* Letter column */}
                    <motion.div {...enter(0.22)} className="md:col-span-8">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="border-t border-b border-[#DBC7A6]/40 py-16 px-2 text-center"
                                >
                                    <CheckCircle className="w-10 h-10 text-[#DBC7A6] mx-auto mb-5" />
                                    <h3 className="font-display font-bold text-[28px] md:text-[36px] text-[#DBC7A6] mb-2 tracking-tight">
                                        {t("contact.success_title")}
                                    </h3>
                                    <p className="text-[#B39F85] text-[14px] leading-relaxed max-w-sm mx-auto">{t("contact.success_desc")}</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="atlas-link text-[#B39F85] hover:text-[#DBC7A6] mt-8 text-[12px] font-mono uppercase tracking-[0.22em] inline-block"
                                    >
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
                                    className="space-y-6"
                                >
                                    <div className="atlas-folio mb-3">Compose</div>
                                    <div className="atlas-rule-double mb-8" aria-hidden />

                                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <label htmlFor="name" className="atlas-folio block mb-1">{t("contact.name")}</label>
                                            <input
                                                id="name" type="text" required
                                                placeholder={t("contact.placeholder_name")}
                                                value={name} onChange={e => setName(e.target.value)}
                                                autoComplete="name" inputMode="text" enterKeyHint="next"
                                                className={FIELD_CLASS}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="atlas-folio block mb-1">{t("contact.email")}</label>
                                            <input
                                                id="email" type="email" required
                                                placeholder={t("contact.placeholder_email")}
                                                value={email} onChange={e => setEmail(e.target.value)}
                                                autoComplete="email" inputMode="email" enterKeyHint="next"
                                                className={FIELD_CLASS}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="atlas-folio block mb-1">{t("contact.subject")}</label>
                                        <input
                                            id="subject" type="text" required
                                            placeholder={t("contact.placeholder_subject")}
                                            value={subject} onChange={e => setSubject(e.target.value)}
                                            autoComplete="off" inputMode="text" enterKeyHint="next"
                                            className={FIELD_CLASS}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="atlas-folio block mb-1">{t("contact.message")}</label>
                                        <textarea
                                            id="message" rows={6} required
                                            placeholder={t("contact.placeholder_message")}
                                            value={message} onChange={e => setMessage(e.target.value)}
                                            autoComplete="off" enterKeyHint="send"
                                            className={`${FIELD_CLASS} resize-none`}
                                        />
                                    </div>

                                    {status === "error" && errMsg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3 px-4 py-3 border border-[#d46a5c]/40 text-[#d46a5c] text-[13px]"
                                        >
                                            <AlertCircle size={14} className="shrink-0" />
                                            {errMsg}
                                        </motion.div>
                                    )}

                                    <div className="atlas-rule-double mt-10 mb-6" aria-hidden />

                                    <div className="flex items-end justify-between gap-4 flex-wrap">
                                        <p className="font-green-energy text-[#B39F85] text-[22px] md:text-[28px] leading-none">
                                            Yours,<span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#7D6B56] ml-3">/ Arka</span>
                                        </p>

                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[#DBC7A6] text-[#13110E] font-medium text-[14px] tracking-tight hover:bg-[#E9D7B7] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300"
                                        >
                                            {status === "loading" ? (
                                                <><Loader2 size={14} className="animate-spin" />{t("contact.sending")}</>
                                            ) : (
                                                <>
                                                    {t("contact.send")}
                                                    <Send size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
