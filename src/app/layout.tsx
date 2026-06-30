import type { Metadata } from "next";
import { Space_Grotesk, Syncopate } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { Cursor } from "@/components/shared/Cursor";
import { ParticleBackground } from "@/components/shared/ParticleBackground";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CyberSyntax – Mentorship Platform",
  description:
    "Master Cybersecurity, Data Science & Finance with expert mentors. Research opportunities, structured courses, and guided learning paths.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${syncopate.variable}`}>
      <body className="antialiased min-h-screen" style={{ fontFamily: 'var(--font-space), "Space Grotesk", system-ui, sans-serif' }}>
        <Cursor />
        <ParticleBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
