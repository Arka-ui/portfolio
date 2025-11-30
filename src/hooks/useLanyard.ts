"use client";

import { useEffect, useState } from "react";

const LANYARD_WS = "wss://api.lanyard.rest/socket";

export interface LanyardData {
    spotify: {
        track_id: string;
        timestamps: {
            start: number;
            end: number;
        };
        song: string;
        artist: string;
        album_art_url: string;
        album: string;
    } | null;
    listening_to_spotify: boolean;
    discord_user: {
        username: string;
        public_flags: number;
        id: string;
        discriminator: string;
        avatar: string | null;
        global_name: string | null;
    };
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: Array<{
        type: number;
        state: string;
        name: string;
        id: string;
        emoji?: { name: string; id: string; animated: boolean };
        created_at: number;
        timestamps?: { start: number; end?: number };
        details?: string;
        assets?: {
            large_text?: string;
            large_image?: string;
            small_text?: string;
            small_image?: string;
        };
    }>;
    active_on_discord_web: boolean;
    active_on_discord_mobile: boolean;
    active_on_discord_desktop: boolean;
}

export function useLanyard(discordId: string) {
    const [data, setData] = useState<LanyardData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!discordId) return;

        let socket: WebSocket | null = null;
        let heartbeatInterval: NodeJS.Timeout;

        const connect = () => {
            socket = new WebSocket(LANYARD_WS);

            socket.onopen = () => {
                setIsConnected(true);
            };

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                const { op, d, t } = message;

                // Hello (Opcode 1)
                if (op === 1) {
                    const heartbeat_interval = d.heartbeat_interval;
                    heartbeatInterval = setInterval(() => {
                        socket?.send(JSON.stringify({ op: 3 }));
                    }, heartbeat_interval);

                    // Initialize (Opcode 2)
                    socket?.send(
                        JSON.stringify({
                            op: 2,
                            d: { subscribe_to_id: discordId },
                        })
                    );
                }

                // Event (Opcode 0)
                if (op === 0) {
                    if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
                        setData(d);
                    }
                }
            };

            socket.onclose = () => {
                setIsConnected(false);
                clearInterval(heartbeatInterval);
                // Reconnect after 5s
                setTimeout(connect, 5000);
            };
        };

        connect();

        return () => {
            clearInterval(heartbeatInterval);
            socket?.close();
        };
    }, [discordId]);

    return { data, isConnected };
}
