"use client";

import { motion } from "framer-motion";
import { Music, Code, User, Monitor, Smartphone, Globe } from "lucide-react";
import Image from "next/image";
import { useLanyard } from "@/hooks/useLanyard";

// Placeholder ID - User needs to replace this
const DISCORD_ID = "871084043838566400";

export default function LiveStatus() {
    const { data: lanyardData, isConnected } = useLanyard(DISCORD_ID);

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
        online: "bg-green-500",
        idle: "bg-yellow-500",
        dnd: "bg-red-500",
        offline: "bg-gray-500",
    }[discord_status] || "bg-gray-500";

    return (
        <section className="py-10 container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card/30 backdrop-blur-md rounded-2xl p-6 w-full max-w-md mx-auto relative overflow-hidden group shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Header: Avatar, Name, Status */}
                <div className="relative z-10 flex items-center gap-4 mb-6">
                    <div className="relative">
                        {discord_user.avatar ? (
                            <Image
                                src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`}
                                alt="Avatar"
                                width={80}
                                height={80}
                                className="rounded-full border-2 border-card"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-10 h-10 text-muted-foreground" />
                            </div>
                        )}
                        <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-card ${statusColor}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl">{discord_user.global_name || discord_user.username}</h3>
                        <p className="text-sm text-muted-foreground">@{discord_user.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 capitalize border border-white/5">
                                {discord_status}
                            </span>
                            {/* Device Icons */}
                            <div className="flex gap-1 text-muted-foreground">
                                {active_on_discord_desktop && <Monitor size={14} />}
                                {active_on_discord_mobile && <Smartphone size={14} />}
                                {active_on_discord_web && <Globe size={14} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spotify Card */}
                {spotify && (
                    <div className="relative z-10 mb-4 bg-[#1DB954]/10 border border-[#1DB954]/20 p-3 rounded-lg flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <Image
                                src={spotify.album_art_url}
                                alt={spotify.album}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-[#1DB954] font-bold uppercase tracking-wider mb-0.5">Listening to Spotify</p>
                            <p className="font-medium text-sm truncate">{spotify.song}</p>
                            <p className="text-xs text-muted-foreground truncate">by {spotify.artist}</p>
                        </div>
                        <Music className="absolute top-3 right-3 w-4 h-4 text-[#1DB954] animate-pulse" />
                    </div>
                )}

                {/* Activities List */}
                <div className="space-y-3 relative z-10">
                    {activities && activities.length > 0 ? (
                        activities
                            .filter(act => act.type !== 2) // Filter out Spotify (type 2) as it's shown above
                            .map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                    {activity.assets?.large_image ? (
                                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={`https://cdn.discordapp.com/app-assets/${activity.id}/${activity.assets.large_image}.png`}
                                                alt={activity.name}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    // Fallback if image fails (some IDs are special)
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <Code className="w-10 h-10 p-2 bg-primary/10 text-primary rounded" />
                                    )}

                                    <div className="overflow-hidden">
                                        <p className="font-medium text-sm truncate">{activity.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
                                        <p className="text-xs text-muted-foreground truncate">{activity.state}</p>
                                        {activity.timestamps && activity.timestamps.start && (
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {(() => {
                                                    const elapsed = Date.now() - activity.timestamps.start;
                                                    const hours = Math.floor(elapsed / 3600000);
                                                    const minutes = Math.floor((elapsed % 3600000) / 60000);
                                                    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m elapsed`;
                                                })()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                    ) : (
                        !spotify && <p className="text-sm text-muted-foreground italic text-center py-2">No other activities currently.</p>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
