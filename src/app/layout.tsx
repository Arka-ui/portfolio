import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";
import { BlueprintProvider } from "@/context/BlueprintContext";
import Footer from "@/components/Footer";
import BlueprintOverlay from "@/components/BlueprintOverlay";
import BlueprintCursor from "@/components/BlueprintCursor";
import BlueprintGrid from "@/components/BlueprintGrid";
import SystemFailure from "@/components/ui/SystemFailure";
import { useSystemTelemetry } from "@/lib/sys-core";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Arka | Full Stack Developer",
  description: "Portfolio of Arka, a passionate Full Stack Developer.",
};

function RootContent({ children }: { children: React.ReactNode }) {
  const health = useSystemTelemetry();

  if (health.status === 'critical') {
    return <SystemFailure />;
  }

  return (
    <BlueprintProvider>
      <BlueprintOverlay />
      <BlueprintCursor />
      <BlueprintGrid />
      <InteractiveBackground />
      <Navbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </BlueprintProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <RootContent>{children}</RootContent>
      </body>
    </html>
  );
}
