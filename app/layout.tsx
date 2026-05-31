// app/layout.tsx

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import StarStream from "@/components/ui/StarStream";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/config/site"; // ✅ FIX: Import site config

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  variable: "--font-favorit", 
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Schema: Organization
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "sameAs": [
      "https://www.linkedin.com/company/ecell-sdc-iiser-bhopal/",
      "https://www.instagram.com/ecell_iiserb"
    ],
    "contactPoint": { 
      "@type": "ContactPoint", 
      "email": "iice@iiserb.ac.in" 
    },
    "parentOrganization": { 
      "@type": "EducationalOrganization", 
      "name": "IISER Bhopal" 
    }
  };

  // JSON-LD Schema: WebSite (Enables Sitelinks Search Box)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${dmSans.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={[
          GeistSans.className,
          "bg-[#0a0a0a] text-white antialiased",
          "selection:bg-cyan-400/20 selection:text-cyan-300",
        ].join(" ")}
      >
        <StarStream /> 
        
        <div className="relative z-[10]">
          <Navbar />
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}