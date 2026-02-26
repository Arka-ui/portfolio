"use client";

import React, { useEffect, useState } from 'react';

export default function SystemFailure() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black text-red-600 font-mono p-8 flex flex-col items-start justify-start overflow-hidden select-none cursor-none">
            <div className="animate-pulse">
                <h1 className="text-4xl font-bold mb-4">SYSTEM_HALTED</h1>
                <p className="text-xl mb-8">CRITICAL_PROCESS_DIED</p>
            </div>

            <div className="space-y-2 text-sm opacity-80">
                <p>Error Code: 0x000000EF (CRITICAL_PROCESS_DIED)</p>
                <p>Parameters:</p>
                <p>0x0000000000000001</p>
                <p>0x0000000000000000</p>
                <p>0x0000000000000000</p>
                <p>0x0000000000000000</p>
            </div>

            <div className="mt-12 p-4 border border-red-800 bg-red-900/10 w-full max-w-2xl">
                <p className="mb-2">Technical Information:</p>
                <p>*** STOP: 0x000000EF (0x00000001, 0x00000000, 0x00000000, 0x00000000)</p>
                <p className="mt-4">
                    The system has detected an unauthorized modification of the kernel memory.
                    To protect system integrity, all processes have been suspended.
                </p>
                <p className="mt-2 text-xs text-red-400">
                    Path: /usr/sys/kernel/integrity_check.sys
                </p>
            </div>

            <div className="mt-auto">
                <p>Collecting error info... 100%</p>
                <p className="mt-2">Contact your system administrator or technical support group for assistance.</p>
                <p className="mt-4 animate-pulse">Rebooting system{dots}</p>
            </div>

            {/* Fake "Matrix" background effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-[-1]"
                style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, .3) 25%, rgba(255, 0, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .3) 75%, rgba(255, 0, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, .3) 25%, rgba(255, 0, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .3) 75%, rgba(255, 0, 0, .3) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px'
                }}
            />
        </div>
    );
}
