"use client";
// components/sections/Footer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Minimalist footer with social links and institutional information.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, MapPin, ExternalLink, Globe, Hexagon } from "lucide-react";
import { siteConfig } from "@/config/site";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  Linkedin: Globe,
  Instagram: Hexagon,
  Twitter: Globe,
  Github: Hexagon,
};

export default function Footer() {
  const { footer, name, shortName } = siteConfig;

  return (
    <footer id="contact" className="relative border-t border-white/[0.06]">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-1"
          >
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
                <span className="text-black font-black text-sm tracking-tight">EC</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm tracking-tight">{shortName}</div>
                <div className="text-white/30 text-xs font-mono">IISER Bhopal</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">{footer.tagline}</p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {footer.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon] ?? ExternalLink;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200"
                  >
                    <Icon size={15} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-white/30 mb-5">
              Contact
            </h3>
            <a
              href={`mailto:${footer.email}`}
              className="flex items-start gap-3 text-sm text-white/50 hover:text-white/80 transition-colors duration-200 group"
            >
              <Mail size={15} className="mt-0.5 shrink-0 text-white/20 group-hover:text-cyan-400 transition-colors" />
              <span className="font-mono">{footer.email}</span>
            </a>
            <div className="flex items-start gap-3 text-sm text-white/40">
              <MapPin size={15} className="mt-0.5 shrink-0 text-white/20" />
              <div>
                <div className="text-white/50">{footer.institution}</div>
                <div className="text-xs mt-1">{footer.address}</div>
              </div>
            </div>
          </motion.div>

          {/* Quick links column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-white/30 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={{ pathname: link.href }}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200 font-mono flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-white/20 group-hover:w-5 group-hover:bg-cyan-400/60 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://iiserbhopal.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200 font-mono flex items-center gap-2 group"
                >
                  <span className="w-3 h-px bg-white/20 group-hover:w-5 group-hover:bg-cyan-400/60 transition-all duration-300" />
                  IISER Bhopal
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-white/20 font-mono">{footer.copyright}</p>
          <div className="flex items-center gap-4">
            {footer.legalLinks.map((link: { href: string; label: string }) => (
              <Link
                key={link.href}
                href={{ pathname: link.href }}
                className="text-xs text-white/20 hover:text-white/40 transition-colors font-mono"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
