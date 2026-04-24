"use client";

import { motion } from "framer-motion";
import { Music, Code, User, Monitor, Smartphone, Globe, ExternalLink, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { useLanyard } from "@/hooks/useLanyard";
import { useBlueprint } from "@/context/BlueprintContext";
import BlueprintWrapper from "@/components/BlueprintWrapper";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const DISCORD_ID = "871084043838566400";
const DISCORD_AVATAR_URL = "https://cdn.discordapp.com/avatars/871084043838566400/7e3cc0e89bb88831952b204ede470ba3.webp";
// Set to a real profile URL to re-enable the link card; empty hides it.
const SPOTIFY_PROFILE_URL = "";

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-[#8fb573] shadow-[0_0_10px_rgba(143,181,115,0.45)]";
            case "idle":   return "bg-[#e0b062] shadow-[0_0_10px_rgba(224,176,98,0.4)]";
            case "dnd":    return "bg-[#d46a5c] shadow-[0_0_10px_rgba(212,106,92,0.4)]";
            case "offline": return "bg-[#5F564D]";
            default: return "bg-[#5F564D]";
        }
    };

    const statusColor = getStatusColor(discord_status);

    const sortedActivities = [...activities].sort((a: LanyardActivity, b: LanyardActivity) => {
        return getActivityPriority(a) - getActivityPriority(b);
    });

    // --- BLUEPRINT MODE RENDER ---
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
                                    <div className={`absolute -bottom-2 -right-2 w-4 h-4 ${statusColor} border border-black`} />
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
                                        <Image
                                            src={spotify.album_art_url}
                                            alt={spotify.album}
                                            fill
                                            className="object-cover grayscale opacity-80"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-xs text-[#ff6b35]/40 uppercase mb-1">Now Processing</p>
                                        <p className="font-mono text-sm text-[#ff6b35]/80 truncate">{spotify.song}</p>
                                        <p className="font-mono text-xs text-[#ff6b35]/50 truncate">{spotify.artist}</p>
                                    </div>
                                </div>
                                <div className="mt-4 h-1 bg-[#ff6b35]/10 w-full">
                                    <div
                                        className="h-full bg-[#ff6b35]/40 relative"
                                        style={{
                                            width: `${Math.min(100, ((currentTime - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)}%`
                                        }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#ff6b35] rounded-full shadow-[0_0_5px_#ff6b35]" />
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

    // --- NORMAL MODE RENDER ---
    return (
        <section id="live" className="py-20 md:py-36 border-t border-[#493B33]/25 md:pl-[72px]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-14 md:mb-20">
                    <span className="label-display mb-5 block">{t("live.label")}</span>
                    <h2 className="font-display font-bold text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-[#DBC7A6]">
                        {t("live.heading")}
                    </h2>
                    <p className="text-[#B39F85] text-sm mt-4 max-w-lg">
                        {t("live.subtitle")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 items-start">
                    {/* Left: Discord card — now spans 3 of 5 cols, larger */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full group/card"
                        >
                            <div className="relative bg-[#1B1814]/80 border border-[#493B33]/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover/card:border-[#B39F85]/40 group-hover/card:-translate-y-0.5">
                                {/* Gradient accent bar */}
                                <div className="h-0.5 w-full grad-warm opacity-60 group-hover/card:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-0 right-0 w-72 h-72 bg-[#DBC7A6]/[0.04] rounded-full blur-3xl pointer-events-none" />

                                <div className="p-8 md:p-10 relative">
                                    {/* Identity row */}
                                    <div className="flex items-center gap-6 mb-7">
                                        <a
                                            href={DISCORD_AVATAR_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative flex-shrink-0 group/avatar"
                                            aria-label="Open full-size avatar"
                                        >
                                            {discord_user.avatar ? (
                                                <Image
                                                    src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=256`}
                                                    alt="Avatar"
                                                    width={96}
                                                    height={96}
                                                    className="rounded-2xl transition-transform duration-300 group-hover/avatar:scale-[1.04] group-hover/avatar:shadow-[0_0_32px_rgba(219,199,166,0.25)] ring-2 ring-[#493B33]/60 group-hover/avatar:ring-[#DBC7A6]/40"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-2xl bg-[#DBC7A6]/10 flex items-center justify-center">
                                                    <User className="w-10 h-10 text-[#B39F85]" />
                                                </div>
                                            )}
                                            <span
                                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-[#1B1814]"
                                                style={{
                                                    backgroundColor:
                                                        discord_status === "online" ? "#8fb573" :
                                                        discord_status === "idle"   ? "#e0b062" :
                                                        discord_status === "dnd"    ? "#d46a5c" : "#5F564D"
                                                }}
                                            />
                                        </a>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display font-bold text-[#DBC7A6] text-2xl md:text-[28px] leading-tight truncate tracking-tight">
                                                {discord_user.global_name || discord_user.username}
                                            </p>
                                            <p className="text-sm text-[#7D6B56] font-mono truncate mt-1">
                                                @{discord_user.username}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span
                                                    className="text-[10px] font-mono px-2.5 py-1 rounded-full border capitalize"
                                                    style={{
                                                        color: discord_status === "online" ? "#8fb573" : discord_status === "idle" ? "#e0b062" : discord_status === "dnd" ? "#d46a5c" : "#7D6B56",
                                                        borderColor: discord_status === "online" ? "rgba(143,181,115,0.3)" : discord_status === "idle" ? "rgba(224,176,98,0.3)" : discord_status === "dnd" ? "rgba(212,106,92,0.3)" : "rgba(125,107,86,0.3)",
                                                        backgroundColor: discord_status === "online" ? "rgba(143,181,115,0.08)" : discord_status === "idle" ? "rgba(224,176,98,0.08)" : discord_status === "dnd" ? "rgba(212,106,92,0.08)" : "rgba(125,107,86,0.06)",
                                                    }}
                                                >
                                                    {discord_status}
                                                </span>
                                                <div className="flex gap-1.5 text-[#7D6B56]">
                                                    {active_on_discord_desktop && <Monitor size={12} />}
                                                    {active_on_discord_mobile && <Smartphone size={12} />}
                                                    {active_on_discord_web && <Globe size={12} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#493B33]/40 mb-4" />

                                    {/* Spotify */}
                                    {spotify && (
                                        <a
                                            href={`https://open.spotify.com/track/${spotify.track_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 p-3 rounded-xl bg-[#251E18]/70 border border-[#493B33]/45 hover:border-[#1DB954]/30 hover:bg-[#1DB954]/[0.05] transition-all duration-300 mb-3"
                                        >
                                            <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={spotify.album_art_url} alt={spotify.album} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <Music className="w-3 h-3 text-[#1DB954] flex-shrink-0" />
                                                    <span className="text-[10px] font-mono text-[#1DB954] uppercase tracking-wider">Spotify</span>
                                                </div>
                                                <p className="text-[#DBC7A6] text-[13px] font-semibold truncate group-hover:text-[#1DB954] transition-colors">
                                                    {spotify.song}
                                                </p>
                                                <p className="text-[#7D6B56] text-[11px] truncate">{spotify.artist}</p>
                                                <div className="mt-2 h-0.5 bg-[#493B33]/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#1DB954] rounded-full transition-all duration-1000 ease-linear"
                                                        style={{
                                                            width: `${Math.min(100, ((currentTime - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </a>
                                    )}

                                    {/* Activity list */}
                                    <div className="space-y-2">
                                        {sortedActivities.filter(a => a.name !== "Spotify").map((activity, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#251E18]/60 border border-[#493B33]/40">
                                                <div className="w-8 h-8 rounded-lg bg-[#493B33]/40 flex items-center justify-center flex-shrink-0">
                                                    {activity.name.toLowerCase().includes("code") || activity.name.toLowerCase().includes("visual studio")
                                                        ? <Code size={14} className="text-[#DBC7A6]" />
                                                        : <Gamepad2 size={14} className="text-[#B39F85]" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[#DBC7A6] text-[12px] font-semibold truncate">{activity.name}</p>
                                                    <p className="text-[#7D6B56] text-[11px] truncate">{activity.details || activity.state || "Active"}</p>
                                                </div>
                                                {activity.timestamps?.start && (
                                                    <span className="text-[10px] font-mono text-[#7D6B56] flex-shrink-0">
                                                        {(() => {
                                                            const e = currentTime - activity.timestamps!.start;
                                                            const h = Math.floor(e / 3600000);
                                                            const m = Math.floor((e % 3600000) / 60000);
                                                            return h > 0 ? `${h}h ${m}m` : `${m}m`;
                                                        })()}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {sortedActivities.filter(a => a.name !== "Spotify").length === 0 && !spotify && (
                                            <p className="text-[#7D6B56] text-xs text-center py-3 font-mono">{t("live.no_activity")}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Status details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="space-y-5 lg:col-span-2"
                    >
                        {/* Current timezone / local time */}
                        <div className="p-5 rounded-2xl border border-[#493B33]/45 bg-[#1B1814]/60">
                            <span className="label-mono text-[10px] block mb-3">{t("live.local_time")}</span>
                            <div className="flex items-baseline gap-3">
                                <span className="font-display font-bold text-3xl text-[#DBC7A6] tracking-tight">
                                    {new Date(currentTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}
                                </span>
                                <span className="text-xs font-mono text-[#7D6B56]">CET — France</span>
                            </div>
                            <p className="text-[12px] text-[#7D6B56] mt-2">
                                {new Date(currentTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "Europe/Paris" })}
                            </p>
                        </div>

                        {/* Quick availability */}
                        <div className="p-5 rounded-2xl border border-[#493B33]/45 bg-[#1B1814]/60">
                            <span className="label-mono text-[10px] block mb-3">{t("live.availability")}</span>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#B39F85]">{t("live.response_time")}</span>
                                    <span className="text-sm text-[#DBC7A6] font-mono">&lt; 24h</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#B39F85]">{t("live.timezone")}</span>
                                    <span className="text-sm text-[#DBC7A6] font-mono">UTC+1</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#B39F85]">{t("live.open_for_work")}</span>
                                    <span className="flex items-center gap-1.5 text-sm text-[#DBC7A6] font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#8fb573] animate-pulse" />
                                        {t("live.yes")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#B39F85]">{t("live.preferred_contact")}</span>
                                    <span className="text-sm text-[#DBC7A6] font-mono">Discord</span>
                                </div>
                                <div className="mt-1 pt-3 border-t border-[#493B33]/40">
                                    <p className="text-[12px] text-[#7D6B56] italic leading-relaxed">
                                        {t("live.irl_note")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Spotify profile link — only renders if a real profile URL is set */}
                        {spotify && SPOTIFY_PROFILE_URL && (
                            <a
                                href={SPOTIFY_PROFILE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-4 rounded-2xl border border-[#493B33]/45 bg-[#1B1814]/60 hover:bg-[#1DB954]/[0.05] hover:border-[#1DB954]/25 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 flex items-center justify-center shrink-0">
                                    <Music className="w-5 h-5 text-[#1DB954]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#B39F85] group-hover:text-[#1DB954] transition-colors font-medium">{t("live.listening")}</p>
                                    <p className="text-[11px] text-[#7D6B56] truncate">{spotify.song} — {spotify.artist}</p>
                                </div>
                                <ExternalLink size={14} className="text-[#7D6B56] group-hover:text-[#1DB954]/60 transition-colors shrink-0" />
                            </a>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
