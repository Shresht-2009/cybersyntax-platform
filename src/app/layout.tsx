import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CyberSyntax – Mentorship Platform",
  description: "Master Cybersecurity, Data Science & Finance with expert mentors. Research opportunities, structured courses, and guided learning paths.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
