import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RootContent from "@/components/layout/RootContent";
import ScrollManager from "@/components/layout/ScrollManager";
import { WarpProvider } from "@/context/WarpContext";
import { BlueprintProvider } from "@/context/BlueprintContext";
import { LanguageProvider } from "@/context/LanguageContext";
import KineticBlur from "@/components/ui/KineticBlur";
import CommandPalette from "@/components/features/CommandPalette";

// Primary Heading Font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Body Font
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arka | Creative Full Stack Developer",
  description: "Creative Developer specializing in building premium digital experiences, modern web applications, and immersive user interfaces.",
  applicationName: "Arka Portfolio",
  authors: [{ name: "Arka", url: "https://arka.is-a.dev" }],
  keywords: ["Arka", "Portfolio", "Full Stack Developer", "Web Developer", "React", "Next.js", "Creative Developer", "UI/UX Design"],
  creator: "Arka",
  publisher: "Arka",
  metadataBase: new URL("https://arka.is-a.dev"),
  openGraph: {
    title: "Arka | Creative Full Stack Developer",
    description: "Creative Developer specializing in building premium digital experiences, modern web applications, and immersive user interfaces.",
    url: "https://arka.is-a.dev",
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
      <body className={`${jakarta.variable} ${outfit.variable} antialiased bg-background text-foreground overflow-x-hidden`}>
        <WarpProvider>
          <LanguageProvider>
            <BlueprintProvider>
              <ScrollManager />
              <KineticBlur />
              <CommandPalette />
              <RootContent>{children}</RootContent>
            </BlueprintProvider>
          </LanguageProvider>
        </WarpProvider>
      </body>
    </html>
  );
}
