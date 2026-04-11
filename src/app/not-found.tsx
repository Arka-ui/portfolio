"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NotFound() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#13110E] text-[#B39F85] font-mono p-8 flex flex-col items-center justify-center overflow-hidden select-none">
            <div className="text-center space-y-4">
                <h1 className="font-display text-[clamp(96px,18vw,220px)] font-bold leading-none tracking-tighter text-grad-warm">404</h1>
                <h2 className="text-2xl tracking-widest text-[#DBC7A6]">SIGNAL_LOST</h2>
                <div className="w-full h-px bg-[#493B33]/50 my-4" />
                <p className="text-[#B39F85] max-w-md mx-auto leading-relaxed">
                    The requested coordinates could not be resolved. The resource may have been moved to another dimension or deleted from the timeline.
                </p>
                <p className="text-xs text-[#7D6B56] mt-2">
                    ERROR_CODE: 0x404_NOT_FOUND
                </p>
            </div>

            <div className="mt-12">
                <Link
                    href="/"
                    className="group relative px-6 py-3 border border-[#DBC7A6]/50 bg-[#DBC7A6]/10 text-[#DBC7A6] hover:bg-[#DBC7A6] hover:text-[#13110E] transition-all duration-300"
                >
                    <span className="relative z-10">INITIATE_RETURN_SEQUENCE</span>
                </Link>
            </div>

            <div className="absolute bottom-8 text-center text-xs text-[#5F564D]">
                <p>Re-calibrating navigation systems{dots}</p>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-20 z-[-1]"
                style={{
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.35) 50%)',
                    backgroundSize: '100% 4px',
                }}
            />
        </div>
    );
}
