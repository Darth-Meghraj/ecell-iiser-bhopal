// app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Root landing page. Composes all sections in order.
// This is a Server Component; all interactivity lives in client-side sections.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Hero from "@/components/sections/Hero";
import BentoGrid from "@/components/sections/BentoGrid";
import PitchPortal from "@/components/sections/PitchPortal";
import Footer from "@/components/sections/Footer";

// ── Metadata ──────────────────────────────────────────────────────────────────
// Statically generated — no dynamic data needed for SEO.

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "E-Cell",
    "IISER Bhopal",
    "Entrepreneurship Cell",
    "Startup",
    "Student Entrepreneurs",
    "Deep Tech",
    "Science Startup",
    "India",
    "Incubation",
    "Hackathon",
  ],
  authors: [{ name: "E-Cell IISER Bhopal" }],
  creator: "E-Cell IISER Bhopal",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@ecell_iiserbh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(siteConfig.url),
};

// ── Page ──────────────────────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    // REMOVED: bg-[#0a0a0a] so the background is completely transparent!
    <main className="min-h-screen">
      {/* 1. Hero — Above the fold. Sells the vision immediately. */}
      <Hero />

      {/* 2. Bento Grid — The "What We're Building" pillars */}
      <BentoGrid />

      {/* 3. Pitch Portal — The primary conversion goal of the site */}
      <PitchPortal />

      {/* 4. Footer */}
      <Footer />
    </main>
  );
}

