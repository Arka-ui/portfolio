"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Music, Code, User, Monitor, Smartphone, Globe, ExternalLink, Gamepad2 } from "lucide-react";
import Image from "next/image";
import { useLanyard } from "@/hooks/useLanyard";
import { useBlueprint } from "@/context/BlueprintContext";
import BlueprintWrapper from "@/components/BlueprintWrapper";
import { useEffect, useState } from "react";

// Placeholder ID - User needs to replace this
const DISCORD_ID = "871084043838566400";
const SPOTIFY_PROFILE_URL = "https://open.spotify.com/user/YOUR_SPOTIFY_USER_ID"; // Replace with actual profile

export default function LiveStatus() {
    const { data: lanyardData } = useLanyard(DISCORD_ID);
    const { isBlueprintMode } = useBlueprint();
    const [currentTime, setCurrentTime] = useState(Date.now());

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

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

    if (!lanyardData) {
        return (
            <div className="flex justify-center py-10">
                <div className="bg-card/30 p-6 rounded-xl border border-white/5 text-center max-w-md mx-auto animate-pulse">
                    <p className="text-muted-foreground">Connecting to Discord...</p>
                </div>
            </div>
        );
    }

    const { discord_status, activities, discord_user, spotify, active_on_discord_desktop, active_on_discord_mobile, active_on_discord_web } = lanyardData;

    const statusColor = {
        online: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
        idle: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
        dnd: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
        offline: "bg-gray-500",
    }[discord_status] || "bg-gray-500";

    // Sort activities: Dev > Music > Games > Other
    const sortedActivities = [...activities].sort((a, b) => {
        const getPriority = (act: { name: string; type: number }) => {
            if (act.name === "Visual Studio Code" || act.name.includes("Code") || act.name.includes("Terminal")) return 0;
            if (act.name === "Spotify" || act.name === "Apple Music") return 1;
            return 2;
        };
        return getPriority(a) - getPriority(b);
    });

    // --- BLUEPRINT MODE RENDER ---
    if (isBlueprintMode) {
        return (
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Module 1: Identity Core */}
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
                        <div className="bg-[#001529]/80 border border-cyan-500/30 p-6 rounded-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <Image
                                        src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`}
                                        alt="Avatar"
                                        width={80}
                                        height={80}
                                        className="rounded-none border-2 border-cyan-500/50 grayscale"
                                    />
                                    <div className={`absolute -bottom-2 -right-2 w-4 h-4 ${statusColor} border border-black`} />
                                </div>
                                <div>
                                    <h3 className="font-mono text-xl text-cyan-400 tracking-wider">{discord_user.username.toUpperCase()}</h3>
                                    <p className="font-mono text-xs text-cyan-700 mt-1">UID: {discord_user.id}</p>
                                    <div className="flex gap-2 mt-3">
                                        {active_on_discord_desktop && <Monitor size={16} className="text-cyan-600" />}
                                        {active_on_discord_mobile && <Smartphone size={16} className="text-cyan-600" />}
                                        {active_on_discord_web && <Globe size={16} className="text-cyan-600" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BlueprintWrapper>

                    {/* Module 2: Media Processor (Spotify) */}
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
                            <div className="bg-[#001529]/80 border border-cyan-500/30 p-6 rounded-lg relative overflow-hidden h-full flex flex-col justify-center">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 border border-cyan-500/30">
                                        <Image
                                            src={spotify.album_art_url}
                                            alt={spotify.album}
                                            fill
                                            className="object-cover grayscale opacity-80"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-xs text-cyan-700 uppercase mb-1">Now Processing</p>
                                        <p className="font-mono text-sm text-cyan-300 truncate">{spotify.song}</p>
                                        <p className="font-mono text-xs text-cyan-600 truncate">{spotify.artist}</p>
                                    </div>
                                </div>
                                {/* Progress Bar Simulation */}
                                <div className="mt-4 h-1 bg-cyan-900/30 w-full">
                                    <div
                                        className="h-full bg-cyan-500/50 relative"
                                        style={{
                                            width: `${Math.min(100, ((currentTime - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)}%`
                                        }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]" />
                                    </div>
                                </div>
                            </div>
                        </BlueprintWrapper>
                    )}

                    {/* Module 3: Activity Stream */}
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
                                    <div key={index} className="bg-[#001529]/80 border border-cyan-500/30 p-4 flex items-center gap-4">
                                        <div className="font-mono text-xs text-cyan-500 w-6">0{index + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-mono text-sm text-cyan-300 truncate">{activity.name}</p>
                                            <p className="font-mono text-xs text-cyan-700 truncate">{activity.state || activity.details || "Running..."}</p>
                                        </div>
                                        <div className="w-2 h-2 bg-cyan-500/50 animate-pulse rounded-full" />
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
        <section className="py-20 container mx-auto px-4 perspective-1000">
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-lg mx-auto relative overflow-hidden group shadow-2xl hover:shadow-primary/20 transition-shadow duration-500"
            >
                {/* Iridescent Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center gap-6 mb-8 transform-gpu translate-z-10">
                    <div className="relative">
                        <div className="relative w-24 h-24">
                            {discord_user.avatar ? (
                                <Image
                                    src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`}
                                    alt="Avatar"
                                    fill
                                    className="rounded-full border-4 border-card shadow-lg"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border-4 border-card">
                                    <User className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                            {/* Status Pulse */}
                            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-card ${statusColor} z-20`}>
                                <div className={`absolute inset-0 rounded-full ${statusColor} animate-ping opacity-75`} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-3xl text-white tracking-tight">{discord_user.global_name || discord_user.username}</h3>
                        <p className="text-base text-muted-foreground font-medium">@{discord_user.username}</p>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-3 py-1 rounded-full bg-white/5 capitalize border border-white/5 font-medium text-white/80">
                                {discord_status}
                            </span>
                            <div className="flex gap-2 text-muted-foreground">
                                {active_on_discord_desktop && <Monitor size={16} />}
                                {active_on_discord_mobile && <Smartphone size={16} />}
                                {active_on_discord_web && <Globe size={16} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spotify Card */}
                {spotify && (
                    <a
                        href={`https://open.spotify.com/track/${spotify.track_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 mb-6 bg-black/20 hover:bg-black/30 border border-white/5 hover:border-[#1DB954]/50 p-4 rounded-2xl flex items-center gap-5 transition-all duration-300 group/spotify transform-gpu translate-z-20"
                    >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg group-hover/spotify:scale-105 transition-transform duration-300">
                            <Image
                                src={spotify.album_art_url}
                                alt={spotify.album}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/spotify:opacity-100 transition-opacity">
                                <ExternalLink className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-[#1DB954] font-bold uppercase tracking-wider">Listening to Spotify</p>
                                <Music className="w-4 h-4 text-[#1DB954] animate-bounce" />
                            </div>
                            <p className="font-bold text-lg text-white truncate group-hover/spotify:text-[#1DB954] transition-colors">{spotify.song}</p>
                            <p className="text-sm text-white/60 truncate">by {spotify.artist}</p>

                            {/* Progress Bar */}
                            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
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

                {/* Activities List */}
                <div className="space-y-3 relative z-10 transform-gpu translate-z-10">
                    {sortedActivities.length > 0 ? (
                        sortedActivities.map((activity, index) => {
                            const isSpotify = activity.name === "Spotify";
                            if (isSpotify) return null; // Skip Spotify in list as it has a dedicated card

                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                                >
                                    {activity.assets?.large_image ? (
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                            <Image
                                                src={`https://cdn.discordapp.com/app-assets/${activity.id}/${activity.assets.large_image}.png`}
                                                alt={activity.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            {activity.name.includes("Code") ? <Code size={24} /> : <Gamepad2 size={24} />}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-white truncate">{activity.name}</p>
                                        <p className="text-xs text-white/60 truncate">{activity.details}</p>
                                        <p className="text-xs text-white/40 truncate">{activity.state}</p>
                                    </div>

                                    {activity.timestamps && activity.timestamps.start && (
                                        <div className="text-xs text-white/30 font-mono bg-black/20 px-2 py-1 rounded">
                                            {(() => {
                                                const elapsed = currentTime - activity.timestamps.start;
                                                const hours = Math.floor(elapsed / 3600000);
                                                const minutes = Math.floor((elapsed % 3600000) / 60000);
                                                return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
                                            })()}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        !spotify && <p className="text-sm text-muted-foreground italic text-center py-4">No other activities currently.</p>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
