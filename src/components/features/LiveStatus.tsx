"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Music, Code, User, Monitor, Smartphone, Globe, ExternalLink, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { useLanyard } from "@/hooks/useLanyard";
import { useBlueprint } from "@/context/BlueprintContext";
import BlueprintWrapper from "@/components/BlueprintWrapper";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const DISCORD_ID = "871084043838566400";
const SPOTIFY_PROFILE_URL = "https://open.spotify.com/user/YOUR_SPOTIFY_USER_ID";

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

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    if (!lanyardData) return null;

    const { discord_status, activities, discord_user, spotify, active_on_discord_desktop, active_on_discord_mobile, active_on_discord_web } = lanyardData;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-[#ff6b35] shadow-[0_0_10px_rgba(255,107,53,0.4)]";
            case "idle": return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]";
            case "dnd": return "bg-[#ff5c5c] shadow-[0_0_10px_rgba(255,92,92,0.4)]";
            case "offline": return "bg-white/30";
            default: return "bg-white/30";
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
        <section id="live" className="py-20 md:py-36 border-t border-white/[0.04]">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-14 md:mb-20">
                    <span className="label-mono mb-5 block">{t("live.label")}</span>
                    <h2 className="font-heading font-bold text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tighter text-white">
                        {t("live.heading")}
                    </h2>
                    <p className="text-white/30 text-sm mt-4 max-w-lg">
                        {t("live.subtitle")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Discord card */}
                    <div style={{ perspective: "1000px" }}>
                        <motion.div
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full max-w-sm"
                        >
                            <div className="relative bg-[#0e1e3a]/60 border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl">
                                {/* Gradient accent bar */}
                                <div className="h-0.5 w-full bg-gradient-to-r from-[#ff6b35] via-[#ff85c8]/30 to-[#00cfb4]" />
                                <div className="absolute top-0 right-0 w-52 h-52 bg-[#ff6b35]/[0.03] rounded-full blur-3xl pointer-events-none" />

                                <div className="p-6 relative">
                                    {/* Identity row */}
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="relative flex-shrink-0">
                                            {discord_user.avatar ? (
                                                <Image
                                                    src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=128`}
                                                    alt="Avatar"
                                                    width={56}
                                                    height={56}
                                                    className="rounded-xl"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-[#ff6b35]/15 flex items-center justify-center">
                                                    <User className="w-7 h-7 text-[#ff6b35]/40" />
                                                </div>
                                            )}
                                            <span
                                                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[2.5px] border-[#0e1e3a]"
                                                style={{
                                                    backgroundColor:
                                                        discord_status === "online" ? "#ff6b35" :
                                                        discord_status === "idle"   ? "#f59e0b" :
                                                        discord_status === "dnd"    ? "#ff5c5c" : "#6b7280"
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-white text-base leading-tight truncate">
                                                {discord_user.global_name || discord_user.username}
                                            </p>
                                            <p className="text-xs text-white/30 font-mono truncate mt-0.5">
                                                @{discord_user.username}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span
                                                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border capitalize"
                                                    style={{
                                                        color: discord_status === "online" ? "#ff6b35" : discord_status === "idle" ? "#fbbf24" : discord_status === "dnd" ? "#ff5c5c" : "#9ca3af",
                                                        borderColor: discord_status === "online" ? "rgba(255,107,53,0.25)" : discord_status === "idle" ? "rgba(251,191,36,0.25)" : discord_status === "dnd" ? "rgba(255,92,92,0.25)" : "rgba(156,163,175,0.15)",
                                                        backgroundColor: discord_status === "online" ? "rgba(255,107,53,0.07)" : discord_status === "idle" ? "rgba(251,191,36,0.07)" : discord_status === "dnd" ? "rgba(255,92,92,0.07)" : "rgba(156,163,175,0.04)",
                                                    }}
                                                >
                                                    {discord_status}
                                                </span>
                                                <div className="flex gap-1.5 text-white/18">
                                                    {active_on_discord_desktop && <Monitor size={12} />}
                                                    {active_on_discord_mobile && <Smartphone size={12} />}
                                                    {active_on_discord_web && <Globe size={12} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/[0.05] mb-4" />

                                    {/* Spotify */}
                                    {spotify && (
                                        <a
                                            href={`https://open.spotify.com/track/${spotify.track_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-[#1DB954]/25 hover:bg-[#1DB954]/[0.04] transition-all duration-300 mb-3"
                                        >
                                            <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={spotify.album_art_url} alt={spotify.album} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <Music className="w-3 h-3 text-[#1DB954] flex-shrink-0" />
                                                    <span className="text-[10px] font-mono text-[#1DB954] uppercase tracking-wider">Spotify</span>
                                                </div>
                                                <p className="text-white text-[13px] font-semibold truncate group-hover:text-[#1DB954] transition-colors">
                                                    {spotify.song}
                                                </p>
                                                <p className="text-white/30 text-[11px] truncate">{spotify.artist}</p>
                                                <div className="mt-2 h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
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
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                                                    {activity.name.toLowerCase().includes("code") || activity.name.toLowerCase().includes("visual studio")
                                                        ? <Code size={14} className="text-[#ff6b35]" />
                                                        : <Gamepad2 size={14} className="text-white/25" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-[12px] font-semibold truncate">{activity.name}</p>
                                                    <p className="text-white/25 text-[11px] truncate">{activity.details || activity.state || "Active"}</p>
                                                </div>
                                                {activity.timestamps?.start && (
                                                    <span className="text-[10px] font-mono text-white/18 flex-shrink-0">
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
                                            <p className="text-white/18 text-xs text-center py-3 font-mono">{t("live.no_activity")}</p>
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
                        className="space-y-5"
                    >
                        {/* Current timezone / local time */}
                        <div className="p-5 rounded-2xl border border-white/[0.06] bg-[#0e1e3a]/30">
                            <span className="label-mono text-[10px] block mb-3">{t("live.local_time")}</span>
                            <div className="flex items-baseline gap-3">
                                <span className="font-heading font-bold text-3xl text-white tracking-tight">
                                    {new Date(currentTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}
                                </span>
                                <span className="text-xs font-mono text-white/20">CET — France</span>
                            </div>
                            <p className="text-[12px] text-white/20 mt-2">
                                {new Date(currentTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "Europe/Paris" })}
                            </p>
                        </div>

                        {/* Quick availability */}
                        <div className="p-5 rounded-2xl border border-white/[0.06] bg-[#0e1e3a]/30">
                            <span className="label-mono text-[10px] block mb-3">{t("live.availability")}</span>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/40">{t("live.response_time")}</span>
                                    <span className="text-sm text-white/65 font-mono">&lt; 24h</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/40">{t("live.timezone")}</span>
                                    <span className="text-sm text-white/65 font-mono">UTC+1</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/40">{t("live.open_for_work")}</span>
                                    <span className="flex items-center gap-1.5 text-sm text-[#ff6b35] font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse" />
                                        {t("live.yes")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/40">{t("live.preferred_contact")}</span>
                                    <span className="text-sm text-white/65 font-mono">Discord</span>
                                </div>
                                <div className="mt-1 pt-3 border-t border-white/[0.04]">
                                    <p className="text-[12px] text-white/20 italic leading-relaxed">
                                        {t("live.irl_note")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Spotify profile link */}
                        {spotify && (
                            <a
                                href={SPOTIFY_PROFILE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-4 rounded-2xl border border-white/[0.06] bg-[#0e1e3a]/30 hover:bg-[#1DB954]/[0.04] hover:border-[#1DB954]/20 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 flex items-center justify-center shrink-0">
                                    <Music className="w-5 h-5 text-[#1DB954]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white/55 group-hover:text-[#1DB954] transition-colors font-medium">{t("live.listening")}</p>
                                    <p className="text-[11px] text-white/20 truncate">{spotify.song} — {spotify.artist}</p>
                                </div>
                                <ExternalLink size={14} className="text-white/12 group-hover:text-[#1DB954]/50 transition-colors shrink-0" />
                            </a>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
