"use client";

import { motion } from "framer-motion";
import { useWarp } from "@/context/WarpContext";
import { useLanguage } from "@/context/LanguageContext";

const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function Hero() {
    const { warpTo } = useWarp();
    const { t } = useLanguage();

    return (
        <section
            id="hero"
            className="relative min-h-[92vh] flex items-stretch overflow-hidden pt-16 md:pt-12 md:pl-[88px]"
        >
            {/* Side margin tick ruler — desktop only */}
            <div
                aria-hidden
                className="hidden md:block absolute top-0 bottom-0 w-2 left-[88px] atlas-tick opacity-30"
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col justify-between py-10 md:py-14">
                {/* ── Top folio strip ── */}
                <motion.div
                    {...enter(0)}
                    className="flex items-center justify-between gap-6 mb-10 md:mb-14"
                >
                    <div className="flex items-center gap-4 atlas-folio">
                        <span>§ 01 · Opening</span>
                        <span aria-hidden className="hidden sm:inline-block w-12 atlas-rule" />
                        <span className="hidden sm:inline">Anno MMXXVI</span>
                    </div>
                    <span className="atlas-folio-strong inline-flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DBC7A6] opacity-50" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#DBC7A6]" />
                        </span>
                        <span>{t("hero.available")}</span>
                    </span>
                </motion.div>

                {/* ── Main broadside ── */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-14 items-end flex-1">
                    <motion.div {...enter(0.05)}>
                        <h1 className="font-display text-[#DBC7A6]" style={{ letterSpacing: "-0.045em" }}>
                            <span className="block font-bold leading-[0.84]" style={{ fontSize: "clamp(56px, 13vw, 184px)" }}>
                                {t("hero.line_1")}
                            </span>
                            <span className="block font-medium italic text-[#B39F85] leading-[0.92] mt-1" style={{ fontSize: "clamp(38px, 8.5vw, 116px)", letterSpacing: "-0.025em" }}>
                                {t("hero.line_2")}
                            </span>
                            <span className="block font-bold text-[#7D6B56] leading-[0.84] mt-1" style={{ fontSize: "clamp(56px, 13vw, 184px)" }}>
                                {t("hero.line_3")}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Right spine — vertical printed dust-jacket */}
                    <motion.aside
                        {...enter(0.18)}
                        className="hidden md:flex flex-col items-start gap-5 max-w-[180px] pb-3 border-l border-[#493B33]/55 pl-5"
                    >
                        <span className="atlas-folio">Pt. I — Opening</span>
                        <span className="atlas-folio-strong">{t("hero.role")}</span>
                        <ul className="space-y-1 text-[11px] font-mono text-[#7D6B56]">
                            <li>2026 · Issue 04</li>
                            <li>Cambrai · Fr</li>
                            <li>Self-taught · OSS</li>
                            <li>en · fr · es · de</li>
                        </ul>
                    </motion.aside>
                </div>

                {/* ── Atlas rule under headline ── */}
                <motion.div {...enter(0.25)} className="atlas-rule-double mt-10 md:mt-14" aria-hidden />

                {/* ── Bio + ledger CTAs ── */}
                <motion.div
                    {...enter(0.32)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mt-10"
                >
                    <p className="md:col-span-7 text-[15px] md:text-[16px] text-[#B39F85] leading-[1.65] max-w-[36ch]">
                        {t("hero.bio")}
                    </p>

                    <div className="md:col-span-5 flex flex-col items-start md:items-end gap-3 md:gap-2 self-end">
                        <button
                            type="button"
                            onClick={() => warpTo("#projects")}
                            className="atlas-link group text-[#DBC7A6] text-[15px] md:text-[17px] tracking-tight font-medium"
                        >
                            <span aria-hidden className="font-mono text-[10px] tracking-[0.22em] text-[#7D6B56] group-hover:text-[#B39F85] transition-colors">→ § 04</span>
                            <span>{t("hero.cta_projects")}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => warpTo("#contact")}
                            className="atlas-link group text-[#B39F85] text-[15px] md:text-[17px] tracking-tight font-medium"
                        >
                            <span aria-hidden className="font-mono text-[10px] tracking-[0.22em] text-[#7D6B56] group-hover:text-[#DBC7A6] transition-colors">→ § 08</span>
                            <span>{t("hero.cta_contact")}</span>
                        </button>
                    </div>
                </motion.div>

                {/* ── Bottom scroll cue ── */}
                <motion.button
                    {...enter(0.45)}
                    type="button"
                    onClick={() => warpTo("#instruments")}
                    aria-label="Scroll to next section: § 02 · Instruments"
                    className="self-start mt-10 md:mt-14 inline-flex items-center gap-3 atlas-folio hover:text-[#DBC7A6] focus-visible:text-[#DBC7A6] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#DBC7A6]/60 transition-colors group"
                >
                    <span aria-hidden className="block w-12 atlas-rule group-hover:w-20 group-focus-visible:w-20 transition-all duration-500" />
                    <span>↓ § 02 · Instruments</span>
                </motion.button>
            </div>
        </section>
    );
}
