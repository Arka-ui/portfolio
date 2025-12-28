"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music, X } from "lucide-react";
import Image from "next/image";
import { useLanyard } from "@/hooks/useLanyard";
import { useState, useEffect } from "react";

// Placeholder ID - User needs to replace this
const DISCORD_ID = "871084043838566400";

export default function MusicPlayer() {
    const { data } = useLanyard(DISCORD_ID);
    const [isVisible, setIsVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-show when song changes
    useEffect(() => {
        if (data?.spotify) {
            setIsVisible(true);
        }
    }, [data?.spotify?.track_id]);

    if (!mounted || !data?.spotify) return null;

    const { song, artist, album_art_url } = data.spotify;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: 50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 50, x: 50 }}
                    className="fixed bottom-4 right-4 z-50 max-w-xs w-full"
                >
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-3 relative overflow-hidden group">
                        {/* Progress Bar Background (Simulated) */}
                        <div className="absolute bottom-0 left-0 h-1 bg-primary/50 w-full opacity-50" />

                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 animate-spin-slow">
                            <Image
                                src={album_art_url}
                                alt="Album Art"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <Music className="w-3 h-3 text-green-400" />
                                <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold">Now Playing</span>
                            </div>
                            <p className="font-medium text-sm truncate text-white">{song}</p>
                            <p className="text-xs text-muted-foreground truncate">{artist}</p>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
