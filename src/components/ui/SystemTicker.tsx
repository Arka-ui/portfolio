"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SystemTicker() {
    const [stats, setStats] = useState({
        cords: "0,0",
        fps: "60",
        status: "NOMINAL",
        net: "CONNECTED"
    });

    useEffect(() => {
        const updateMouse = (e: MouseEvent) => {
            setStats(prev => ({
                ...prev,
                cords: `${e.clientX},${e.clientY}`
            }));
        };

        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                // Fake FPS fluctuation for effect
                fps: (60 + Math.random() * 5 - 2.5).toFixed(0),
                status: Math.random() > 0.95 ? "SCANNING..." : "NOMINAL"
            }));
        }, 1000);

        window.addEventListener("mousemove", updateMouse);
        return () => {
            window.removeEventListener("mousemove", updateMouse);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="flex flex-col items-end gap-0.5 pointer-events-none opacity-50 select-none">
            <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-500/80 tracking-wider">
                <span className="w-16 text-right">CORD: [{stats.cords}]</span>
                <span className="w-12 text-right">FPS: {stats.fps}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-indigo-400/80 tracking-wider">
                <span className="w-16 text-right animate-pulse">{stats.status}</span>
                <span className="w-12 text-right text-green-500/80">{stats.net}</span>
            </div>
        </div>
    );
}
