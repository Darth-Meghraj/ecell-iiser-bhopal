"use client";
// components/sections/Footer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Minimalist footer with social links and institutional information.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ExternalLink } from "lucide-react"; 
import { FaLinkedin, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";
import { siteConfig } from "@/config/site";

// FIX APPLIED: Changed React.ElementType to React.ComponentType<any> to allow the size prop
const SOCIAL_ICONS: Record<string, React.ComponentType<any>> = {
  Linkedin: FaLinkedin,
  Instagram: FaInstagram,
  Twitter: FaXTwitter,
  Github: FaGithub,
};

export default function Footer() {
  const { footer, name, shortName } = siteConfig;

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      // Opens Gmail app on both iOS and Android
      window.location.href = `googlegmail://co?to=${footer.email}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${footer.email}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <footer id="contact" className="relative border-t border-white/[0.06]">
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
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo.png" 
                alt="E-Cell Logo" 
                width={36} 
                height={36} 
                className="object-contain w-auto h-auto"
              />
              <div>
                <div className="text-white font-bold text-sm tracking-tight">{shortName}</div>
                <div className="text-white/30 text-xs font-mono">IISER Bhopal</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">{footer.tagline}</p>

            <div className="flex items-center gap-3">
              {footer.socials.map((social: any) => {
                // FIX APPLIED: Cast to React.ComponentType<any> here as well
                const Icon = (SOCIAL_ICONS[social.icon] ?? ExternalLink) as React.ComponentType<any>;
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
                    <Icon size={16} />
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
              onClick={handleEmailClick}
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
              {siteConfig.footer.footerLinks.map((link: any) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href as any}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200 font-mono flex items-center gap-2 group"
                    >
                      <span className="w-3 h-px bg-white/20 group-hover:w-5 group-hover:bg-cyan-400/60 transition-all duration-300" />
                      {link.label}
                      {isExternal && (
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-60 transition-opacity ml-1" />
                      )}
                    </Link>
                  </li>
                );
              })}
              <li>
                <a
                  href="https://www.iiserb.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200 font-mono flex items-center gap-2 group"
                >
                  <span className="w-3 h-px bg-white/20 group-hover:w-5 group-hover:bg-cyan-400/60 transition-all duration-300" />
                  IISER Bhopal
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-60 transition-opacity ml-1" />
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
                href={link.href as any}
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