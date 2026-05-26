// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Root layout: font loading (Geist Sans + Geist Mono via next/font),
// global providers, and the persistent Navbar.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import StarStream from "@/components/ui/StarStream";

export const metadata: Metadata = {
  title: "E-Cell IISER Bhopal",
  description:
    "The Entrepreneurship Cell at IISER Bhopal — where scientific rigor meets the audacity to build.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body
        className={[
          GeistSans.className,
          "bg-[#0a0a0a] text-white antialiased",
          "selection:bg-cyan-400/20 selection:text-cyan-300",
        ].join(" ")}
      >
        {/* 1. Stars stay at the absolute bottom layer */}
        <StarStream /> 

        {/* 2. Pull all website content UP a layer so it sits on top of the stars */}
        <div className="relative z-[10]">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}