// app/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import ScrollIntro from "@/components/ScrollIntro"; 
import Hero from "@/components/sections/Hero";
import BentoGrid from "@/components/sections/BentoGrid";
import PitchPortal from "@/components/sections/PitchPortal";
import Footer from "@/components/sections/Footer";
import InstaFeed from "@/components/sections/InstaFeed";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "E-Cell", "IISER Bhopal", "Entrepreneurship Cell", "Startup",
    "Student Entrepreneurs", "Deep Tech", "Science Startup",
    "India", "Incubation", "Hackathon",
  ],
  authors: [{ name: "E-Cell IISER Bhopal" }],
  creator: "E-Cell IISER Bhopal",
  openGraph: {
    type: "website", locale: "en_IN", url: siteConfig.url,
    title: siteConfig.name, description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image", title: siteConfig.name,
    description: siteConfig.description, images: [siteConfig.ogImage],
    creator: "@ecell_iiserbh",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: "/favicon.ico", shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(siteConfig.url),
};

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* 1. Hybrid cinematic intro — auto-plays + scroll-driven */}
      <ScrollIntro />

      {/* 2. Hero */}
      <Hero />

      {/* 3. Bento Grid */}
      <BentoGrid />

      {/* 4. Instagram Feed */}
      <InstaFeed />

      {/* 5. Pitch Portal */}
      <PitchPortal />

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}