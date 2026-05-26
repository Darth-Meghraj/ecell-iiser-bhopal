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
        {/* Persistent navigation */}
        <Navbar />

        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
