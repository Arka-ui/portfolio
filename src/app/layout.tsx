import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RootContent from "@/components/RootContent";
import ScrollManager from "@/components/ScrollManager";
import { WarpProvider } from "@/context/WarpContext";
import { BlueprintProvider } from "@/context/BlueprintContext";
import { LanguageProvider } from "@/context/LanguageContext";
import KineticBlur from "@/components/ui/KineticBlur";
import CommandPalette from "@/components/CommandPalette";

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
  title: "Arka | Full Stack Developer",
  description: "Creating premium digital experiences.",
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
