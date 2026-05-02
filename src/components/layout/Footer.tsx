"use client";

import { useState } from "react";
import { useLanyard } from "@/hooks/useLanyard";
import { useLanguage } from "@/context/LanguageContext";
import { useWarp } from "@/context/WarpContext";

const DISCORD_ID = "871084043838566400";
const SESSION_ID = "05459c70a2245442430b1b0dd484650013a8ad3c425957e3f2dc16ccce07cb5f54";

export default function Footer() {
    const { data } = useLanyard(DISCORD_ID);
    const { t } = useLanguage();
    const { warpTo } = useWarp();
    const [sessionCopied, setSessionCopied] = useState(false);

    const scrollToTop = () => warpTo("#");

    const copySession = () => {
        navigator.clipboard.writeText(SESSION_ID);
        setSessionCopied(true);
        setTimeout(() => setSessionCopied(false), 2000);
    };

    const status = data?.discord_status ?? "offline";

    return (
        <footer className="relative border-t border-[#493B33]/35 pt-16 pb-16 md:pl-[88px] pb-mobile-hud md:pb-16">
            <div className="container mx-auto px-6 md:px-12">
                {/* Imprint head */}
                <div className="atlas-folio mb-6">§ Colophon</div>
                <div className="atlas-rule mb-12" aria-hidden />

                {/* 4-column colophon: imprint · contact · session · meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-10">
                    <div className="space-y-3">
                        <div className="atlas-folio">Imprint</div>
                        <p className="text-[12px] leading-[1.65] text-[#B39F85]">
                            Set in <span className="text-[#DBC7A6]">Sora</span>, <span className="text-[#DBC7A6]">Syne</span>, and <span className="text-[#DBC7A6]">Space&nbsp;Mono</span>.<br />
                            Composed in Cambrai, France.<br />
                            Issue №&nbsp;IV · MMXXVI.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="atlas-folio">Channels</div>
                        <ul className="text-[12px] leading-[1.85] space-y-0.5">
                            <li>
                                <a
                                    href="https://github.com/arka-ui"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="atlas-link text-[#B39F85] hover:text-[#DBC7A6]"
                                >
                                    GitHub <span className="text-[#5F564D]">/</span> @arka-ui
                                </a>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => warpTo("#contact")}
                                    className="atlas-link text-[#B39F85] hover:text-[#DBC7A6]"
                                >
                                    Letter <span className="text-[#5F564D]">/</span> § 08
                                </button>
                            </li>
                            <li>
                                <span className="text-[#7D6B56] font-mono inline-flex items-center gap-1.5">
                                    <span
                                        className="inline-block w-1.5 h-1.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                status === "online" ? "#8fb573"
                                                : status === "idle" ? "#e0b062"
                                                : status === "dnd" ? "#d46a5c"
                                                : "#5F564D"
                                        }}
                                        aria-hidden
                                    />
                                    Discord <span className="text-[#5F564D]">/</span>
                                    <span className="uppercase tracking-[0.18em] text-[10px]">{status}</span>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <div className="atlas-folio">Session</div>
                        <button
                            type="button"
                            onClick={copySession}
                            className="text-left text-[10.5px] font-mono text-[#7D6B56] hover:text-[#DBC7A6] transition-colors break-all leading-snug"
                            aria-label="Copy Session ID"
                            title="Click to copy"
                        >
                            {sessionCopied ? "↳ Copied to clipboard" : SESSION_ID}
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="atlas-folio">Folio</div>
                        <div className="text-[12px] text-[#B39F85] leading-[1.65]">
                            <p>{t("footer.rights")}</p>
                            <p className="text-[#7D6B56] mt-1">© {new Date().getFullYear()} Arka.</p>
                        </div>
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className="atlas-link text-[#B39F85] hover:text-[#DBC7A6] text-[11px] font-mono uppercase tracking-[0.22em]"
                        >
                            ↑ Return to top
                        </button>
                    </div>
                </div>

                {/* Bottom rule + slogan */}
                <div className="atlas-rule mt-16 mb-4" aria-hidden />
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <span className="atlas-folio">Arka · Field Atlas · MMXXVI</span>
                    <span className="atlas-folio">End of issue</span>
                </div>
            </div>
        </footer>
    );
}
