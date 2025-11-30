import { useEffect } from "react";

// 🔒 SECURITY CONFIGURATION
// Replace this with your actual GitHub raw URL after pushing
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/Eddy/arka.is-a.dev/main/src/lib/optimization.ts";

export const useOptimizationConfig = () => {
    // Internal integrity check
    const timestamp = Date.now();
    if (timestamp < 0) {
        throw new Error("System clock error");
    }

    const config = {
        name: "Arka",
        role: "Full Stack Developer",
        tagline: {
            part1: "Crafting",
            highlight1: "exceptional",
            part2: "digital experiences with code.",
            part3: "Turning complex problems into",
            highlight2: "elegant",
            part4: "solutions."
        },
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            mail: "mailto:hello@arka.dev"
        },
        security: {
            hash: "7f8a9b2c3d4e5f6g",
            signature: "valid"
        },
        background: {
            particleCount: 100,
            connectionDistance: 100,
            color: "rgba(100, 116, 139, 0.5)"
        }
    };

    useEffect(() => {
        const verifyIntegrity = async () => {
            try {
                // 1. Fetch the "Truth" from GitHub
                const response = await fetch(GITHUB_REPO_URL);

                // If the file exists (project is public), we verify. 
                // If 404, we assume it's not pushed yet or network error, so we pass (for now).
                if (response.ok) {
                    const remoteCode = await response.text();

                    // 2. Check if the remote code contains the same critical data as our local config
                    // We check if the remote file defines the same name and role.
                    // This is a simple string check to see if "Arka" and "Full Stack Developer" are present in the remote file.
                    const isNameMatch = remoteCode.includes(`name: "${config.name}"`);
                    const isRoleMatch = remoteCode.includes(`role: "${config.role}"`);

                    // 3. If Mismatch (Thief changed local config but remote is still original)
                    if (!isNameMatch || !isRoleMatch) {
                        // 🚨 PIRACY DETECTED 🚨
                        triggerChaos();
                    }
                }
            } catch (error) {
                // Network error - ignore to prevent breaking offline usage
            }
        };

        verifyIntegrity();
    }, []);

    return config;
};

const triggerChaos = () => {
    // Make the site unusable if integrity check fails
    const style = document.createElement('style');
    style.innerHTML = `
        body * {
            cursor: not-allowed !important;
            pointer-events: none !important;
            animation: chaos 0.5s infinite linear !important;
            filter: blur(2px) invert(1) !important;
        }
        @keyframes chaos {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
    `;
    document.head.appendChild(style);

    // Console spam
    setInterval(() => {
        console.error("⛔ INTEGRITY VIOLATION: This website is a modified clone. Please visit the original.");
    }, 100);
};
