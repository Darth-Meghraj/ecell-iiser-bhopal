"use client";
// components/sections/InstaFeed.tsx

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function InstaFeed() {
  const POST_ID = "DUvA99MAQaC"; 

  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-slate-light)] mb-4 tracking-tight">
            Latest from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-amber-primary)] to-[var(--color-amber-hover)]">Cell</span>
          </h2>
          <p className="text-[var(--color-slate-medium)] font-mono text-sm uppercase tracking-widest">
            Follow our journey on Instagram
          </p>
        </motion.div>

        {/* Instagram Embed Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[400px] bg-[rgba(26,31,53,0.6)] border border-[var(--color-border)] rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-[0_16px_42px_rgba(2,6,23,0.45)]"
        >
          {/* Sanitized HTML5 standard iframe */}
          <iframe
            src={`https://www.instagram.com/p/${POST_ID}/embed`}
            className="w-full aspect-[4/5] rounded-xl bg-black border-0 overflow-hidden"
            allow="encrypted-media"
            title="Instagram Post from E-Cell IISER Bhopal"
          ></iframe>
          
          {/* VISIBLE SEO / Crawler Content Block */}
          <div className="mt-5 p-4 bg-[rgba(26,31,53,0.72)] rounded-xl border border-[var(--color-divider)]">
            <h3 className="text-[var(--color-slate-light)] font-semibold text-sm mb-1">
              Latest from E-Cell
            </h3>
            <p className="text-[var(--color-slate-medium)] text-xs leading-relaxed">
              Join E-Cell IISER Bhopal for the latest updates on upcoming pitch events, startup incubation programs, and campus entrepreneurship news.
            </p>
          </div>

          {/* Social Link */}
          <div className="mt-5 text-center flex justify-center">
             <a 
               href={siteConfig.footer.socials.find((s: any) => s.label === "Instagram")?.href || "#"} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-sm font-bold text-[var(--color-amber-primary)] hover:text-[var(--color-amber-hover)] transition-colors"
             >
               @ecell_iiserbhopal
             </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}