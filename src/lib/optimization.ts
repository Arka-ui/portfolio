import { useEffect } from "react";

// 🔒 SECURITY CONFIGURATION
// Replace this with your actual GitHub raw URL after pushing
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/Arka-ui/portfolio/main/src/lib/optimization.ts";

export const useOptimizationConfig = () => {
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

    return config;
};
