import { useEffect, useState } from 'react';

// 🔒 OBFUSCATED SECURITY CORE
// We use misleading names to hide the true purpose of this file.

// Advanced obfuscation for the source of truth
const _0x1a2b = () => {
    // "https://raw.githubusercontent.com/Arka-ui/portfolio/main/src/lib/optimization.ts"
    const p1 = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29t"; // https://raw.githubusercontent.com
    const p2 = "L0Fya2EtdWkvcG9ydGZvbGlvL21haW4="; // /Arka-ui/portfolio/main
    const p3 = "L3NyYy9saWIvb3B0aW1pemF0aW9uLnRz"; // /src/lib/optimization.ts
    return atob(p1) + atob(p2) + atob(p3);
};

// Obfuscated configuration decoder for Domain
const getTelemetryConfig = () => {
    // Generates "arka-ui.github.io"
    const _0x5f2 = [97, 114, 107, 97, 45, 117, 105, 46, 103, 105, 116, 104, 117, 98, 46, 105, 111];
    return _0x5f2.map(c => String.fromCharCode(c)).join('');
};

// Obfuscated configuration decoder for Scope (Path)
const getTelemetryScope = () => {
    // Generates "portfolio"
    const _0x9a1 = [112, 111, 114, 116, 102, 111, 108, 105, 111];
    return _0x9a1.map(c => String.fromCharCode(c)).join('');
};

interface SystemHealth {
    status: 'optimal' | 'critical';
    code: string;
}

export const useSystemTelemetry = () => {
    const [health, setHealth] = useState<SystemHealth>({ status: 'optimal', code: '0x00' });

    useEffect(() => {
        const runDiagnostics = async () => {
            const TARGET_ID = getTelemetryConfig();
            const TARGET_SCOPE = getTelemetryScope();
            const ENDPOINT = _0x1a2b();

            // 1. Domain & Path Verification (Obfuscated as "Network Latency Check")
            const currentHost = window.location.hostname;
            const currentPath = window.location.pathname;
            const isDev = currentHost === 'localhost' || currentHost === '127.0.0.1';

            // Strict check: Must be official domain AND path.
            if (!isDev) {
                if (currentHost !== TARGET_ID) {
                    setHealth({ status: 'critical', code: '0xERR_NET_LATENCY_TIMEOUT' });
                    return;
                }
                // Must start with /portfolio
                if (!currentPath.startsWith('/' + TARGET_SCOPE)) {
                    setHealth({ status: 'critical', code: '0xERR_SCOPE_INVALID' });
                    return;
                }
            }

            // 2. Integrity Check (Obfuscated as "Cache Validation")
            try {
                const response = await fetch(ENDPOINT);
                if (response.ok) {
                    const remoteData = await response.text();

                    // Simple check: does the remote file contain the "Arka" signature?
                    // We check for specific strings that MUST exist in the official code.
                    const hasSignature = remoteData.includes('name: "Arka"') && remoteData.includes('role: "Full Stack Developer"');

                    if (!hasSignature) {
                        // "Cache corruption" -> actually integrity failure
                        setHealth({ status: 'critical', code: '0xERR_CACHE_INTEGRITY_VIOLATION' });
                    }
                } else {
                    // If we can't reach GitHub (404), fail.
                    if (response.status === 404) {
                        setHealth({ status: 'critical', code: '0xERR_UPSTREAM_NOT_FOUND' });
                    }
                }
            } catch (e) {
                // Network error - ignore
            }
        };

        runDiagnostics();
    }, []);

    return health;
};
