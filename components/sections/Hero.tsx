"use client";
// components/sections/Hero.tsx

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm"
    >
      <span className="text-2xl font-bold text-white font-mono tracking-tight">{value}</span>
      <span className="text-xs text-white/40 uppercase tracking-widest font-mono">{label}</span>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Hero() {
  const { hero } = siteConfig;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
    show: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      
      {/* Subtle Vignette — darkens edges, focuses eye to center without blocking background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.8) 100%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            {hero.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {hero.headline.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                      {line}
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/60 to-violet-400/0" />
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 leading-relaxed mb-10"
        >
          {hero.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href={hero.ctaPrimary.href}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(34,211,238,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-cyan-400 text-black font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            >
              {hero.ctaPrimary.label}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Link>

          <Link href={hero.ctaSecondary.href}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 backdrop-blur-md text-white/70 font-medium text-base hover:border-white/30 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
            >
              {hero.ctaSecondary.label}
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {hero.stats.map((stat, i) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} delay={0.9 + i * 0.1} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}