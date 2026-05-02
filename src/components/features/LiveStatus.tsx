"use client";

import { motion } from "framer-motion";
import { Music, Code, User, Monitor, Smartphone, Globe, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { useLanyard } from "@/hooks/useLanyard";
import { useBlueprint } from "@/context/BlueprintContext";
import BlueprintWrapper from "@/components/BlueprintWrapper";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const DISCORD_ID = "871084043838566400";
const DISCORD_AVATAR_URL = "https://cdn.discordapp.com/avatars/871084043838566400/7e3cc0e89bb88831952b204ede470ba3.webp";

interface LanyardActivity {
    name: string;
    type: number;
    details?: string;
    state?: string;
    timestamps?: { start: number; end?: number };
    assets?: { large_image?: string; };
    id?: string;
}

const getActivityPriority = (act: LanyardActivity) => {
    if (act.name === "Visual Studio Code" || act.name.includes("Code") || act.name.includes("Terminal")) return 0;
    if (act.name === "Spotify" || act.name === "Apple Music") return 1;
    return 2;
};

const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function LiveStatus() {
    const { data: lanyardData } = useLanyard(DISCORD_ID);
    const { isBlueprintMode } = useBlueprint();
    const { t } = useLanguage();
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;
    if (!lanyardData) return null;

    const { discord_status, activities, discord_user, spotify, active_on_discord_desktop, active_on_discord_mobile, active_on_discord_web } = lanyardData;

    const sortedActivities = [...activities].sort((a: LanyardActivity, b: LanyardActivity) => {
        return getActivityPriority(a) - getActivityPriority(b);
    });

    const statusDot = (status: string) =>
        status === "online" ? "#8fb573"
        : status === "idle"   ? "#e0b062"
        : status === "dnd"    ? "#d46a5c"
        : "#5F564D";

    // ── Blueprint mode preserved ──
    if (isBlueprintMode) {
        return (
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <BlueprintWrapper
                        label="IDENTITY_CORE"
                        description="User Identification Module"
                        direction="left"
                        techSpecs={{
                            "User ID": discord_user.id,
                            "Discriminator": discord_user.discriminator,
                            "Avatar Hash": discord_user.avatar?.substring(0, 8) + "..." || "N/A"
                        }}
                    >
                        <div className="bg-[#060d1f]/80 border border-[#ff6b35]/30 p-6 rounded-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent opacity-50" />
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <Image
                                        src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`}
                                        alt="Avatar"
                                        width={80}
                                        height={80}
                                        className="rounded-none border-2 border-[#ff6b35]/50 grayscale"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border border-black" style={{ backgroundColor: statusDot(discord_status) }} />
                                </div>
                                <div>
                                    <h3 className="font-mono text-xl text-[#ff6b35] tracking-wider">{discord_user.username.toUpperCase()}</h3>
                                    <p className="font-mono text-xs text-[#ff6b35]/40 mt-1">UID: {discord_user.id}</p>
                                    <div className="flex gap-2 mt-3">
                                        {active_on_discord_desktop && <Monitor size={16} className="text-[#ff6b35]/50" />}
                                        {active_on_discord_mobile && <Smartphone size={16} className="text-[#ff6b35]/50" />}
                                        {active_on_discord_web && <Globe size={16} className="text-[#ff6b35]/50" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BlueprintWrapper>

                    {spotify && (
                        <BlueprintWrapper
                            label="MEDIA_GATE"
                            description="Audio Stream Processor"
                            direction="right"
                            techSpecs={{
                                "Service": "Spotify API",
                                "Track ID": spotify.track_id,
                                "Sync": "Active"
                            }}
                        >
                            <div className="bg-[#060d1f]/80 border border-[#ff6b35]/30 p-6 rounded-lg relative overflow-hidden h-full flex flex-col justify-center">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 border border-[#ff6b35]/30">
                                        <Image src={spotify.album_art_url} alt={spotify.album} fill className="object-cover grayscale opacity-80" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-xs text-[#ff6b35]/40 uppercase mb-1">Now Processing</p>
                                        <p className="font-mono text-sm text-[#ff6b35]/80 truncate">{spotify.song}</p>
                                        <p className="font-mono text-xs text-[#ff6b35]/50 truncate">{spotify.artist}</p>
                                    </div>
                                </div>
                            </div>
                        </BlueprintWrapper>
                    )}

                    <div className="lg:col-span-2">
                        <BlueprintWrapper
                            label="ACT_STREAM"
                            description="Active Process List"
                            direction="bottom"
                            techSpecs={{
                                "Process Count": activities.length.toString(),
                                "Priority": "Sorted",
                                "State": "Live"
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sortedActivities.map((activity, index) => (
                                    <div key={index} className="bg-[#060d1f]/80 border border-[#ff6b35]/30 p-4 flex items-center gap-4">
                                        <div className="font-mono text-xs text-[#ff6b35]/60 w-6">0{index + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-mono text-sm text-[#ff6b35]/80 truncate">{activity.name}</p>
                                            <p className="font-mono text-xs text-[#ff6b35]/40 truncate">{activity.state || activity.details || "Running..."}</p>
                                        </div>
                                        <div className="w-2 h-2 bg-[#ff6b35]/40 animate-pulse rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </BlueprintWrapper>
                    </div>
                </div>
            </section>
        );
    }

    // ── Atlas mode (default) ──
    return (
        <section id="live" className="py-24 md:py-32 border-t border-[#493B33]/35 md:pl-[88px]">
            <div className="container mx-auto px-6 md:px-12">
                {/* Folio head */}
                <motion.div {...enter(0)} className="flex items-center gap-4 mb-10">
                    <span className="atlas-folio">§ 07 · Signal</span>
                    <span aria-hidden className="flex-1 atlas-rule" />
                    <span className="atlas-folio inline-flex items-center gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: statusDot(discord_status) }}
                        />
                        <span className="uppercase">{discord_status}</span>
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    {...enter(0.05)}
                    className="font-display font-bold leading-[0.92] tracking-tighter text-[#DBC7A6] max-w-3xl mb-5"
                    style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
                >
                    {t("live.heading")}
                </motion.h2>
                <motion.p
                    {...enter(0.1)}
                    className="text-[15px] text-[#B39F85] leading-[1.7] max-w-[64ch] mb-12 md:mb-14"
                >
                    {t("live.subtitle")}
                </motion.p>

                <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    {/* Discord identity card — preserved (a card represents a person) */}
                    <motion.div {...enter(0.15)} className="lg:col-span-7">
                        <div className="border border-[#493B33]/55 bg-[#1B1814]/80">
                            {/* Top hairline (no gradient) */}
                            <div className="h-px bg-[#493B33]/55" aria-hidden />

                            <div className="p-6 md:p-8">
                                {/* Identity row */}
                                <div className="flex items-center gap-5 mb-6">
                                    <a
                                        href={DISCORD_AVATAR_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative shrink-0"
                                        aria-label="Open full-size avatar"
                                    >
                                        {discord_user.avatar ? (
                                            <Image
                                                src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=256`}
                                                alt="Avatar"
                                                width={84}
                                                height={84}
                                                className="border border-[#493B33]/70"
                                            />
                                        ) : (
                                            <div className="w-[84px] h-[84px] bg-[#251E18] flex items-center justify-center border border-[#493B33]/70">
                                                <User className="w-10 h-10 text-[#B39F85]" />
                                            </div>
                                        )}
                                        <span
                                            aria-hidden
                                            className="absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-[#1B1814]"
                                            style={{ backgroundColor: statusDot(discord_status) }}
                                        />
                                    </a>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-display font-bold text-[#DBC7A6] text-[24px] leading-tight truncate tracking-tight">
                                            {discord_user.global_name || discord_user.username}
                                        </p>
                                        <p className="text-[12px] text-[#7D6B56] font-mono truncate mt-0.5">
                                            @{discord_user.username}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 atlas-folio">
                                            <span className="text-[#DBC7A6]">[ {discord_status.toUpperCase()} ]</span>
                                            <span className="flex gap-1.5 text-[#7D6B56]">
                                                {active_on_discord_desktop && <Monitor size={12} />}
                                                {active_on_discord_mobile && <Smartphone size={12} />}
                                                {active_on_discord_web && <Globe size={12} />}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hairline */}
                                <div className="atlas-rule my-5" aria-hidden />

                                {/* Spotify */}
                                {spotify && (
                                    <a
                                        href={`https://open.spotify.com/track/${spotify.track_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 py-4 mb-3 border-t border-b border-[#493B33]/35 hover:border-[#1DB954]/30 transition-colors duration-300"
                                    >
                                        <div className="relative w-14 h-14 overflow-hidden flex-shrink-0">
                                            <Image src={spotify.album_art_url} alt={spotify.album} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="atlas-folio mb-0.5 inline-flex items-center gap-1.5">
                                                <Music className="w-3 h-3 text-[#1DB954]" />
                                                <span className="text-[#1DB954]">Spotify · Now Playing</span>
                                            </div>
                                            <p className="text-[#DBC7A6] text-[14px] font-medium truncate group-hover:text-[#1DB954] transition-colors">
                                                {spotify.song}
                                            </p>
                                            <p className="text-[#7D6B56] text-[12px] truncate">{spotify.artist}</p>
                                            <div className="mt-2 h-px bg-[#493B33]/50">
                                                <div
                                                    className="h-full bg-[#1DB954]/85"
                                                    style={{
                                                        width: `${Math.min(100, ((currentTime - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {/* Activity list */}
                                <ul className="space-y-2">
                                    {sortedActivities.filter(a => a.name !== "Spotify").map((activity, i) => (
                                        <li key={i} className="flex items-center gap-3 py-2 border-b border-[#493B33]/30 last:border-b-0">
                                            <span className="font-mono text-[10px] text-[#7D6B56] w-8 tabular-nums">
                                                {String(i + 1).padStart(2, "0")}.
                                            </span>
                                            <span className="text-[#7D6B56] shrink-0">
                                                {activity.name.toLowerCase().includes("code") || activity.name.toLowerCase().includes("visual studio")
                                                    ? <Code size={13} />
                                                    : <Gamepad2 size={13} />}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#DBC7A6] text-[13px] font-medium truncate">{activity.name}</p>
                                                <p className="text-[#7D6B56] text-[11px] truncate">{activity.details || activity.state || "Active"}</p>
                                            </div>
                                            {activity.timestamps?.start && (
                                                <span className="font-mono text-[10px] text-[#7D6B56] flex-shrink-0 tabular-nums">
                                                    {(() => {
                                                        const e = currentTime - activity.timestamps!.start;
                                                        const h = Math.floor(e / 3600000);
                                                        const m = Math.floor((e % 3600000) / 60000);
                                                        return h > 0 ? `${h}h ${m}m` : `${m}m`;
                                                    })()}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                    {sortedActivities.filter(a => a.name !== "Spotify").length === 0 && !spotify && (
                                        <li className="atlas-folio text-center py-4">{t("live.no_activity")}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right column — typographic ledger panels */}
                    <motion.div {...enter(0.22)} className="lg:col-span-5 space-y-10">
                        {/* Local time */}
                        <div>
                            <div className="atlas-folio mb-3">{t("live.local_time")}</div>
                            <div className="atlas-rule mb-4" aria-hidden />
                            <div className="flex items-baseline gap-3">
                                <span className="font-display font-bold text-[#DBC7A6] text-[44px] md:text-[56px] tracking-tighter tabular-nums leading-none">
                                    {new Date(currentTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}
                                </span>
                                <span className="atlas-folio">CET · France</span>
                            </div>
                            <p className="text-[12px] text-[#7D6B56] font-mono mt-2 uppercase tracking-[0.18em]">
                                {new Date(currentTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "Europe/Paris" })}
                            </p>
                        </div>

                        {/* Availability */}
                        <div>
                            <div className="atlas-folio mb-3">{t("live.availability")}</div>
                            <div className="atlas-rule mb-2" aria-hidden />
                            <dl className="text-[13px] divide-y divide-[#493B33]/30">
                                {[
                                    { label: t("live.response_time"), val: "< 24h" },
                                    { label: t("live.timezone"), val: "UTC+1" },
                                    { label: t("live.open_for_work"), val: t("live.yes"), accent: true },
                                    { label: t("live.preferred_contact"), val: "Discord" },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-baseline justify-between py-2.5 gap-4">
                                        <dt className="text-[#B39F85]">{row.label}</dt>
                                        <dd className={`font-mono uppercase tracking-[0.18em] text-[11px] inline-flex items-center gap-1.5 ${row.accent ? "text-[#DBC7A6]" : "text-[#7D6B56]"}`}>
                                            {row.accent && <span className="w-1.5 h-1.5 rounded-full bg-[#8fb573] animate-pulse" />}
                                            {row.val}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="text-[12px] text-[#7D6B56] italic leading-[1.6] mt-4 max-w-[36ch]">
                                {t("live.irl_note")}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
