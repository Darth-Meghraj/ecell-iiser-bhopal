"use client";
// components/ui/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Sticky, blur-backdrop navigation bar with scroll-aware opacity transition.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Handle direct visits with hashes (e.g. refreshing the page while on /#pitch)
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); 
    }
  }, [pathname]);

  // Custom handler to override Next.js default hash jumps
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault(); // Stop Next.js from jumping instantly
      const targetId = href.substring(2);
      
      if (pathname === "/") {
        // We are already on the home page, just smooth scroll
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      } else {
        // We are on another page (like /team). Route to "/" first.
        router.push("/");
        
        // Wait 300ms for the heavy homepage layout/animations to render and settle, then scroll
        setTimeout(() => {
          const elem = document.getElementById(targetId);
          if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", href);
          }
        }, 300); 
      }
    }
    setMobileOpen(false); // Always close mobile menu on click
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image 
              src="/logo.png" 
              alt="E-Cell Logo" 
              width={32} 
              height={32} 
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-white font-bold text-sm tracking-tight hidden sm:block">
              E-Cell{" "}
              <span className="text-white/30 font-normal font-mono text-xs">IISER Bhopal</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {siteConfig.nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as any}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.05] transition-all duration-200 font-mono"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/#pitch" onClick={(e) => handleNavClick(e, "/#pitch")} aria-label="Pitch your idea from desktop navigation">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(34,211,238,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-sm font-semibold hover:bg-cyan-400/20 transition-all duration-200"
              >
                Pitch Your Idea
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] p-4 flex flex-col gap-2"
          >
            {siteConfig.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-all font-mono"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/#pitch" onClick={(e) => handleNavClick(e, "/#pitch")} aria-label="Submit your pitch from mobile menu"> 
              <button className="w-full mt-2 px-4 py-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-sm font-semibold">
                Submit Your Pitch
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}