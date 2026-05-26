"use client";
// components/sections/InstaFeed.tsx

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function InstaFeed() {
  const POST_ID = "DUvA99MAQaC"; 

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Latest from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Cell</span>
          </h2>
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">
            Follow our journey on Instagram
          </p>
        </motion.div>

        {/* Instagram Embed Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[400px] bg-white/[0.02] border border-white/[0.08] rounded-3xl p-4 md:p-6 backdrop-blur-md shadow-2xl"
        >
          {/* Sanitized HTML5 standard iframe with no legacy properties */}
          <iframe
            src={`https://www.instagram.com/p/${POST_ID}/embed`}
            className="w-full aspect-[4/5] rounded-xl bg-black border-0 overflow-hidden"
            allow="encrypted-media"
          ></iframe>
          
          <div className="mt-6 text-center flex justify-center">
             <a 
               href={siteConfig.footer.socials.find((s: any) => s.label === "Instagram")?.href || "#"} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
             >
               @ecell_iiserbhopal
             </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}