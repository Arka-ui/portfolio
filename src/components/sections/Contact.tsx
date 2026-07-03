"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const SESSION_ID = "05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54";
const CONTACT_EMAIL = "contact@setka.dev";

const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function Contact() {
    const { t } = useLanguage();
    const [sessionCopied, setSessionCopied] = useState(false);

    const copySession = () => {
        navigator.clipboard.writeText(SESSION_ID);
        setSessionCopied(true);
        setTimeout(() => setSessionCopied(false), 2000);
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

                    {/* Letter column — direct correspondence, no form */}
                    <motion.div {...enter(0.22)} className="md:col-span-8">
                        <div className="atlas-folio mb-3">Compose</div>
                        <div className="atlas-rule-double mb-10" aria-hidden />

                        <p className="text-[15px] md:text-[16px] text-[#B39F85] leading-[1.7] max-w-[52ch] mb-10">
                            {t("contact.subtitle")}
                        </p>

                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="atlas-link group inline-flex items-baseline gap-3 text-[#DBC7A6] font-display font-medium tracking-tight"
                            style={{ fontSize: "clamp(22px, 4vw, 44px)" }}
                        >
                            <span aria-hidden className="font-mono text-[10px] tracking-[0.22em] text-[#7D6B56] group-hover:text-[#B39F85] transition-colors">→</span>
                            <span>{CONTACT_EMAIL}</span>
                        </a>

                        <div className="atlas-rule-double mt-12 mb-6" aria-hidden />

                        <p className="italic text-[#B39F85] text-[16px] md:text-[18px] leading-none tracking-tight">
                            Yours,<span className="not-italic text-[10px] tracking-[0.22em] uppercase text-[#7D6B56] ml-3">/ Arka</span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
