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
  return (
    <html
      lang="en"
      // 3. Inject the dmSans variable here
      className={`${GeistSans.variable} ${GeistMono.variable} ${dmSans.variable} dark`}
      suppressHydrationWarning
    >
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