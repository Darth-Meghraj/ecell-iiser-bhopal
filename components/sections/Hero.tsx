"use client";
// components/sections/Hero.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Hero section with animated orb background, kinetic headline, and CTAs.
// ─────────────────────────────────────────────────────────────────────────────
import { motion, useReducedMotion, Variants} from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";

// ── Animated Orbs Background ──────────────────────────────────────────────────

function AnimatedOrbs() {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Primary cyan orb */}
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Violet orb */}
      <motion.div
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -20, 40, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Center green hint */}
      <motion.div
        className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 15, -15, 0],
          y: [0, -15, 15, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Horizontal line accent */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm"
    >
      <span className="text-2xl font-bold text-white font-mono tracking-tight">{value}</span>
      <span className="text-xs text-white/40 uppercase tracking-widest font-mono">{label}</span>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Hero() {
  const { hero } = siteConfig;

  const containerVariants : Variants= {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants : Variants = {
    hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <AnimatedOrbs />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            {hero.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white">
            {hero.headline.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                      {line}
                    </span>
                    {/* Underline glow */}
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
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed mb-10"
        >
          {hero.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href={hero.ctaPrimary.href}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(34,211,238,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-cyan-400 text-black font-bold text-base transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.2)]"
            >
              {hero.ctaPrimary.label}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>
          </Link>

          <Link href={hero.ctaSecondary.href}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white/70 font-medium text-base hover:border-white/20 hover:text-white hover:bg-white/[0.03] transition-all duration-300"
            >
              {hero.ctaSecondary.label}
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          {hero.stats.map((stat, i) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} delay={0.8 + i * 0.1} />
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-white/20 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
