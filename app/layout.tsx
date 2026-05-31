// app/layout.tsx

import type { Metadata } from "next";
// 1. Import DM_Sans from next/font/google instead of localFont
import { DM_Sans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import StarStream from "@/components/ui/StarStream";
import { Analytics } from "@vercel/analytics/next";

// 2. Configure the Google Font
const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  // We keep the variable name the same so your CSS/Tailwind doesn't break
  variable: "--font-favorit", 
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Cell IISER Bhopal",
  description:
    "The Entrepreneurship Cell at IISER Bhopal, where scientific rigor meets the audacity to build.",
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
    "name": "E-Cell IISER Bhopal",
    "url": "https://ecell.iiserbhopal.ac.in",
    "logo": "https://ecell.iiserbhopal.ac.in/logo.png",
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
    "name": "E-Cell IISER Bhopal",
    "url": "https://ecell.iiserbhopal.ac.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ecell.iiserbhopal.ac.in/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html
      lang="en"
      // 3. Inject the dmSans variable here
      className={`${GeistSans.variable} ${GeistMono.variable} ${dmSans.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Inject Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* Inject WebSite Schema */}
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