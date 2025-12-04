import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootContent from "@/components/RootContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Arka | Full Stack Developer",
  description: "Portfolio of Arka, a passionate Full Stack Developer.",
};


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
