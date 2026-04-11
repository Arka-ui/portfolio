import type { Metadata } from "next";
import { Syne, Sora, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import RootContent from "@/components/layout/RootContent";
import ScrollManager from "@/components/layout/ScrollManager";
import { WarpProvider } from "@/context/WarpContext";
import { BlueprintProvider } from "@/context/BlueprintContext";
import { LanguageProvider } from "@/context/LanguageContext";
import CommandPalette from "@/components/features/CommandPalette";
import Telemetry from "@/components/Telemetry";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const greenEnergy = localFont({
  src: "../../public/fonts/Green_Energy.ttf",
  variable: "--font-green-energy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arka | Creative Full Stack Developer",
  description: "Creative Developer specializing in building premium digital experiences, modern web applications, and immersive user interfaces.",
  applicationName: "Arka Portfolio",
  authors: [{ name: "Arka", url: "https://arka-ui.github.io/portfolio/" }],
  keywords: ["Arka", "Portfolio", "Full Stack Developer", "Web Developer", "React", "Next.js", "Creative Developer", "UI/UX Design"],
  creator: "Arka",
  publisher: "Arka",
  metadataBase: new URL("https://arka-ui.github.io"),
  openGraph: {
    title: "Arka | Creative Full Stack Developer",
    description: "Creative Developer specializing in building premium digital experiences, modern web applications, and immersive user interfaces.",
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
    title: "Arka | Creative Full Stack Developer",
    description: "Check out my portfolio featuring my latest full stack web projects.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} ${syne.variable} ${spaceMono.variable} ${greenEnergy.variable} antialiased bg-background text-foreground overflow-x-hidden grain`}>
        <WarpProvider>
          <LanguageProvider>
            <BlueprintProvider>
              <ScrollManager />
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
