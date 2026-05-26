"use client";
// components/sections/BentoGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Glassmorphic Bento-box grid showcasing E-Cell's four founding pillars.
// Cards use staggered scroll-triggered animations via Framer Motion.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from "framer-motion";
import {
  Rocket,
  Zap,
  Users,
  Globe,
  TrendingUp,
  Clock,
  LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/config/site";

// ── Icon Map ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Zap,
  Users,
  Globe,
  TrendingUp,
};

// ── Accent Color Map ──────────────────────────────────────────────────────────

type AccentKey = "cyan" | "violet" | "green" | "amber" | "rose";

const ACCENT_STYLES: Record<
  AccentKey,
  {
    iconBg: string;
    iconColor: string;
    border: string;
    glow: string;
    badge: string;
    badgeText: string;
  }
> = {
  cyan: {
    iconBg: "bg-cyan-400/10",
    iconColor: "text-cyan-400",
    border: "hover:border-cyan-400/20",
    glow: "group-hover:shadow-[0_0_60px_rgba(34,211,238,0.06)]",
    badge: "bg-cyan-400/10 border-cyan-400/20",
    badgeText: "text-cyan-300",
  },
  violet: {
    iconBg: "bg-violet-400/10",
    iconColor: "text-violet-400",
    border: "hover:border-violet-400/20",
    glow: "group-hover:shadow-[0_0_60px_rgba(139,92,246,0.06)]",
    badge: "bg-violet-400/10 border-violet-400/20",
    badgeText: "text-violet-300",
  },
  green: {
    iconBg: "bg-emerald-400/10",
    iconColor: "text-emerald-400",
    border: "hover:border-emerald-400/20",
    glow: "group-hover:shadow-[0_0_60px_rgba(52,211,153,0.06)]",
    badge: "bg-emerald-400/10 border-emerald-400/20",
    badgeText: "text-emerald-300",
  },
  amber: {
    iconBg: "bg-amber-400/10",
    iconColor: "text-amber-400",
    border: "hover:border-amber-400/20",
    glow: "group-hover:shadow-[0_0_60px_rgba(251,191,36,0.06)]",
    badge: "bg-amber-400/10 border-amber-400/20",
    badgeText: "text-amber-300",
  },
  rose: {
    iconBg: "bg-rose-400/10",
    iconColor: "text-rose-400",
    border: "hover:border-rose-400/20",
    glow: "group-hover:shadow-[0_0_60px_rgba(251,113,133,0.06)]",
    badge: "bg-rose-400/10 border-rose-400/20",
    badgeText: "text-rose-300",
  },
};

// ── BentoCard ─────────────────────────────────────────────────────────────────

interface BentoCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: string;
  size: string;
  comingSoon: string;
  index: number;
}

function BentoCard({
  icon,
  title,
  description,
  accent,
  comingSoon,
  size,
  index,
}: BentoCardProps) {
  const shouldReduce = useReducedMotion();
  const Icon = ICON_MAP[icon] ?? Rocket;
  const styles = ACCENT_STYLES[accent as AccentKey] ?? ACCENT_STYLES.cyan;

  const isLarge = size === "large";

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 40, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={[
        isLarge ? "md:col-span-2" : "",
        size === "medium" ? "md:col-span-1" : "",
      ].join(" ")}
    >
      <div
        className={[
          "group relative h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md p-6 md:p-8",
          "transition-all duration-500 cursor-default overflow-hidden",
          styles.border,
          styles.glow,
          "hover:bg-white/[0.04]",
        ].join(" ")}
      >
        {/* Corner gradient accent */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${
              accent === "cyan" ? "rgba(34,211,238,0.06)" :
              accent === "violet" ? "rgba(139,92,246,0.06)" :
              accent === "green" ? "rgba(52,211,153,0.06)" :
              accent === "amber" ? "rgba(251,191,36,0.06)" :
              "rgba(251,113,133,0.06)"
            } 0%, transparent 70%)`,
          }}
        />

        {/* Subtle top border glow on hover */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full gap-5">
          {/* Icon */}
          <div
            className={[
              "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
              styles.iconBg,
            ].join(" ")}
          >
            <Icon size={22} className={styles.iconColor} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white tracking-tight mb-3">{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{description}</p>
          </div>

          {/* Coming soon badge */}
          <div className="flex items-center gap-2 pt-2">
            <span
              className={[
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono",
                styles.badge,
                styles.badgeText,
              ].join(" ")}
            >
              <Clock size={10} />
              {comingSoon}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BentoGrid() {
  const { sectionLabel, headline, items } = siteConfig.pillars;

  return (
    <section id="vision" className="relative py-32 px-4">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/40 text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            {sectionLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {headline}
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          {items.map((item, i) => (
            <BentoCard key={item.id} {...item} index={i} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          <div>
            <p className="text-sm font-bold text-white mb-1">Want to shape what we build?</p>
            <p className="text-xs text-white/40 font-mono">
              Members get a seat at the table — and early access to every program.
            </p>
          </div>
          <a href="#pitch">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm font-semibold hover:bg-cyan-400/20 transition-all duration-200"
            >
              Join as a Member
              <Rocket size={14} />
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
