import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RootContent from "@/components/layout/RootContent";
import { WarpProvider } from "@/context/WarpContext";
import { BlueprintProvider } from "@/context/BlueprintContext";
import { LanguageProvider } from "@/context/LanguageContext";
import CommandPalette from "@/components/features/CommandPalette";
import Telemetry from "@/components/Telemetry";

const monocraft = localFont({
    src: [
        { path: "../../public/fonts/Monocraft/Monocraft-Light.ttf",        weight: "300", style: "normal" },
        { path: "../../public/fonts/Monocraft/Monocraft.ttf",              weight: "400", style: "normal" },
        { path: "../../public/fonts/Monocraft/Monocraft-Italic.ttf",       weight: "400", style: "italic" },
        { path: "../../public/fonts/Monocraft/Monocraft-SemiBold.ttf",     weight: "600", style: "normal" },
        { path: "../../public/fonts/Monocraft/Monocraft-Bold.ttf",         weight: "700", style: "normal" },
        { path: "../../public/fonts/Monocraft/Monocraft-Bold-Italic.ttf",  weight: "700", style: "italic" },
        { path: "../../public/fonts/Monocraft/Monocraft-Black.ttf",        weight: "900", style: "normal" },
    ],
    variable: "--font-monocraft",
    display: "swap",
});

const greenEnergy = localFont({
    src: "../../public/fonts/Green_Energy.ttf",
    variable: "--font-green-energy",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Arka | Backend Developer — TypeScript, APIs & Security",
    description: "Backend developer specializing in TypeScript: secure API design, performance optimization, server & domain management, and SEO. Framework chosen per project.",
    applicationName: "Arka Portfolio",
    authors: [{ name: "Arka", url: "https://arka-ui.github.io/portfolio/" }],
    keywords: ["Arka", "Backend Developer", "TypeScript", "API Development", "Web Security", "Performance Optimization", "Server Management", "Domain Management", "SEO", "Node.js"],
    creator: "Arka",
    publisher: "Arka",
    metadataBase: new URL("https://arka-ui.github.io"),
    openGraph: {
        title: "Arka | Backend Developer — TypeScript, APIs & Security",
        description: "Backend developer specializing in TypeScript: secure API design, performance optimization, server & domain management, and SEO. Framework chosen per project.",
        url: "https://arka-ui.github.io/portfolio/",
        siteName: "Arka Portfolio",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Arka Portfolio Preview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Arka | Backend Developer — TypeScript, APIs & Security",
        description: "Backend developer — TypeScript, secure APIs, performance optimization, server management, and SEO.",
        creator: "@arka_dev",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arka",
    url: "https://arka-ui.github.io/portfolio/",
    email: "mailto:contact@setka.dev",
    jobTitle: "Backend Developer",
    knowsAbout: [
        "TypeScript",
        "API development",
        "Web security",
        "Backend performance optimization",
        "Server administration",
        "Domain management",
        "SEO",
    ],
    sameAs: ["https://github.com/arka-ui"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${monocraft.variable} ${greenEnergy.variable} antialiased bg-background text-foreground overflow-x-hidden grain`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
                />
                <WarpProvider>
                    <LanguageProvider>
                        <BlueprintProvider>
                            <CommandPalette />
                            <Telemetry />
                            <RootContent>{children}</RootContent>
                        </BlueprintProvider>
                    </LanguageProvider>
                </WarpProvider>
            </body>
        </html>
    );
}
