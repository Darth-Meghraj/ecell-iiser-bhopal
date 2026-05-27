"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion, useScroll, useTransform,
  useMotionValue, useMotionValueEvent, animate,
} from "framer-motion";
import { ChevronsDown } from "lucide-react";

// 🚀 ADDED: Global memory so it only plays once per session.
let hasPlayedIntro = false;

// ─────────────────────────────────────────────────────────────────────────────
// SCRAMBLE TEXT
// ─────────────────────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$Σ∆Ω≈<>?/\\|{}[]*&%";

function ScrambleText({ text, active, speed = 36, stagger = 60, style }: {
  text: string; active: boolean; speed?: number; stagger?: number;
  style?: React.CSSProperties;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!elRef.current) return;
    if (!active) {
      elRef.current.innerText = text.split("").map(() => "\u00A0").join("");
      return;
    }
    let elapsed = 0;
    const resolved = new Array(text.length).fill(false);
    const iv = setInterval(() => {
      elapsed += speed;
      const next = text.split("").map((ch, i) => {
        if (ch === " " || ch === "—") return ch;
        if (elapsed > i * stagger + 600) resolved[i] = true;
        return resolved[i] ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      if (elRef.current) elRef.current.innerText = next;
      if (resolved.every(Boolean)) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [active, text, speed, stagger]);
  return <div ref={elRef} style={style} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARC REACTOR LOGO
// ─────────────────────────────────────────────────────────────────────────────
function ArcReactor({ progress }: { progress: ReturnType<typeof useMotionValue<number>> }) {
  const ring1Rotate  = useTransform(progress, [0, 1], [0, 360]);
  const ring2Rotate  = useTransform(progress, [0, 1], [0, -420]);
  const ring3Rotate  = useTransform(progress, [0, 1], [0, 180]);
  const corePower    = useTransform(progress, [0, 0.3], [0, 1]);
  const irisOpen     = useTransform(progress, [0.75, 0.96], [150, 240]);
  const flashScale   = useTransform(progress, [0.95, 0.98], [0, 250]);
  const flashOpacity = useTransform(progress, [0.95, 0.965], [0, 1]);

  return (
    <div style={{ position: "relative", width: 300, height: 300 }}>
      <motion.div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 20, height: 20, x: "-50%", y: "-50%",
        borderRadius: "50%", background: "#ffffff",
        boxShadow: "0 0 60px 30px #ffffff, 0 0 100px 50px #00f5ff",
        scale: flashScale, opacity: flashOpacity, zIndex: 50,
        willChange: "transform,opacity",
      }} />
      <motion.div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)",
        filter: "blur(50px)", opacity: corePower, zIndex: -1,
      }} />
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#2a2d3e" />
            <stop offset="50%"  stopColor="#0a0b10" />
            <stop offset="100%" stopColor="#3d435c" />
          </linearGradient>
          <linearGradient id="copper-accent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#00f5ff" stopOpacity="0.2" />
            <stop offset="50%"  stopColor="#050508" />
            <stop offset="100%" stopColor="#0044ff" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="plasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="30%"  stopColor="#00f5ff" />
            <stop offset="70%"  stopColor="#0044ff" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="url(#copper-accent)" stroke="#1a1d2e" strokeWidth="2" />
        <circle cx="150" cy="150" r="130" fill="url(#titanium)" stroke="#000" strokeWidth="6" />
        <motion.g style={{ rotate: ring1Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="115" stroke="#00f5ff" strokeWidth="1" strokeDasharray="2 12" opacity="0.5" />
          <circle cx="150" cy="150" r="105" stroke="url(#titanium)" strokeWidth="12" strokeDasharray="60 20" strokeLinecap="round" />
          <circle cx="150" cy="150" r="105" stroke="#00f5ff" strokeWidth="2" strokeDasharray="0 80" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #00f5ff)" }} />
        </motion.g>
        <motion.g style={{ rotate: ring2Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="85" stroke="#0a0b10" strokeWidth="16" />
          <circle cx="150" cy="150" r="85" stroke="#00f5ff" strokeWidth="4" strokeDasharray="15 45" style={{ filter: "drop-shadow(0 0 10px #00f5ff)" }} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i}
              x1={+(150 + Math.cos(a) * 75).toFixed(2)} y1={+(150 + Math.sin(a) * 75).toFixed(2)}
              x2={+(150 + Math.cos(a) * 95).toFixed(2)} y2={+(150 + Math.sin(a) * 95).toFixed(2)}
              stroke="#1a1d2e" strokeWidth="4" />;
          })}
        </motion.g>
        <motion.g style={{ rotate: ring3Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="60" stroke="#0044ff" strokeWidth="8" opacity="0.3" />
          <motion.circle cx="150" cy="150" r="60" stroke="#00f5ff" strokeWidth="8"
            strokeDasharray="200 100" strokeDashoffset={irisOpen} strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 15px #00f5ff)" }} />
        </motion.g>
        <motion.circle cx="150" cy="150" r="45" fill="url(#plasma)" style={{ opacity: corePower }} />
        <motion.circle cx="150" cy="150" r="20" fill="#ffffff"
          style={{ opacity: corePower, filter: "drop-shadow(0 0 20px #fff)" }} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL NUDGE
// ─────────────────────────────────────────────────────────────────────────────
function ScrollNudge({ opacity }: { opacity: import("framer-motion").MotionValue<number> }) {
  return (
    <motion.div style={{
      position: "absolute", bottom: "2rem", left: 0, right: 0,
      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
      opacity, zIndex: 20, pointerEvents: "none",
    }}>
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        style={{
          position: "absolute", bottom: "0.5rem",
          width: 48, height: 48, borderRadius: "50%",
          border: "1px solid rgba(0,245,255,0.5)",
        }}
      />
      <span style={{
        fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem",
        letterSpacing: "0.45em", textTransform: "uppercase",
        color: "rgba(0,245,255,0.8)", textShadow: "0 0 12px rgba(0,245,255,0.6)",
      }}>
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronsDown size={24} style={{ color: "#00f5ff", filter: "drop-shadow(0 0 8px #00f5ff)" }} />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN  — one-time experience, no scroll-up replay
// ─────────────────────────────────────────────────────────────────────────────
export default function ScrollIntro() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const autoCtrlRef     = useRef<ReturnType<typeof animate> | null>(null);
  const prevScrollRef   = useRef(0);
  const handedOffRef    = useRef(false);
  const doneRef         = useRef(false); // guard so we never replay

  // 🚀 ADDED: State to physically unmount the container after fade out
  const [isMounted, setIsMounted] = useState(!hasPlayedIntro);
  
  const [isDone, setIsDone] = useState(false);
  const [sc, setSc] = useState({ sys: false, ecell: false, sub: false });

  // ── Progress sources ──────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const scrollProg = useMotionValue<number>(0);
  const autoProg   = useMotionValue<number>(0);
  const progress   = useMotionValue<number>(0);

  // Combined: whichever is ahead
  useEffect(() => {
    const sync = () => progress.set(Math.max(autoProg.get(), scrollProg.get()));
    const ua = autoProg.on("change", sync);
    const us = scrollProg.on("change", sync);
    return () => { ua(); us(); };
  }, [autoProg, scrollProg, progress]);

  // ── Full reset helper ─────────────────────────────────────────────────
  const reset = useCallback(() => {
    autoCtrlRef.current?.stop();
    autoCtrlRef.current = null;
    autoProg.set(0);
    scrollProg.set(0);
    progress.set(0);
    handedOffRef.current = false;
    setIsDone(false);
    setSc({ sys: false, ecell: false, sub: false });
  }, [autoProg, scrollProg, progress]);


  // ─────────────────────────────────────────────────────────────────────
  // 🚀 THE FIX: THE KILL SWITCH
  // Replaces the old 'scrollToHero' behavior.
  // Instead of leaving the 400vh container on the page, this completely
  // deletes it after the fade animation finishes, removing the blank space.
  // ─────────────────────────────────────────────────────────────────────
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    hasPlayedIntro = true; // Save to global memory
    setIsDone(true); // Triggers the opacity fade in CSS
    
    // Wait for the opacity fade to finish (0.3s), then nuke the container
    setTimeout(() => {
      setIsMounted(false);
      // Because 400vh just vanished, we instantly snap to the top 
      // of the page so the Hero section is perfectly aligned.
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 300);
  }, []);

  // ── Auto-play once on mount ───────────────────────────────────────────
  const startAuto = useCallback(() => {
    if (!isMounted) return;
    autoCtrlRef.current?.stop();
    autoCtrlRef.current = animate(autoProg, 1, {
      duration: 12,
      ease: [0.42, 0, 0.48, 1],
      onComplete: () => setTimeout(finish, 300),
    });
  }, [autoProg, finish, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => startAuto(), 1500);
    return () => clearTimeout(t);
  }, [startAuto, isMounted]);

  // ── Mirror scroll into scrollProg; finish if scroll reaches end ───────
  useMotionValueEvent(scrollYProgress, "change", (v: number) => {
    if (!isMounted) return;
    
    const prev    = prevScrollRef.current;
    const goingUp = v < prev - 0.001;
    prevScrollRef.current = v;

    if (goingUp) {
      if (autoCtrlRef.current && !handedOffRef.current) {
        handedOffRef.current = true;
        autoCtrlRef.current.stop();
        autoCtrlRef.current = null;
        autoProg.set(0);
      }
      if (v < 0.03) {
        reset();
        setTimeout(() => startAuto(), 800);
        return;
      }
    }

    if (!goingUp && handedOffRef.current && !autoCtrlRef.current && v > 0.03) {
      handedOffRef.current = false;
      autoProg.set(v);
      autoCtrlRef.current = animate(autoProg, 1, {
        duration: 12 * (1 - v),
        ease: "linear",
        onComplete: () => setTimeout(finish, 300),
      });
    }

    if (v >= 0.99) finish();
    scrollProg.set(v);
  });

  // ── Derived transforms ────────────────────────────────────────────────
  const textY        = useTransform(progress, [0.22, 0.40], [80, 0]);
  const textOpacity  = useTransform(progress, [0.22, 0.36, 0.80, 0.92], [0, 1, 1, 0]);
  const textScale    = useTransform(progress, [0.80, 0.93], [1, 2]);
  const subOpacity   = useTransform(progress, [0.34, 0.46, 0.78, 0.91], [0, 1, 1, 0]);
  const subY         = useTransform(progress, [0.34, 0.46], [20, 0]);
  const reactorScale = useTransform(progress, [0.74, 0.95], [1, 4]);
  const scanOpacity  = useTransform(progress, [0.20, 0.25, 0.82, 0.87], [0, 1, 1, 0]);
  const introOpacity = useTransform(progress, [0.97, 1.0], [1, 0]);
  const nudgeOpacity = useTransform(progress, [0, 0.04, 0.18], [1, 1, 0]);

  useMotionValueEvent(progress, "change", (v: number) => {
    setSc({ sys: v > 0.22, ecell: v > 0.25, sub: v > 0.34 });
  });

  // 🚀 If it's done or memory says they saw it, render NOTHING!
  // This physically deletes the 400vh invisible space from the DOM.
  if (!isMounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,200;0,900;1,200&family=JetBrains+Mono:wght@300;400;700&display=swap');
        @keyframes scan {
          0%   { top:-2px; opacity:0 }
          5%   { opacity:.6 }
          95%  { opacity:.6 }
          100% { top:100vh; opacity:0 }
        }
        .scanline {
          position:absolute; left:0; right:0; height:2px;
          pointer-events:none; z-index:10;
          background:linear-gradient(90deg,transparent,rgba(0,245,255,0.3),transparent);
          animation:scan 4s ease-in-out infinite;
        }
      `}</style>

      <div ref={containerRef} style={{ height: "400vh", position: "relative", zIndex: 50 }}>
        <motion.div style={{
          position: "sticky", top: 0, height: "100vh", width: "100%",
          overflow: "hidden", background: "#050508",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: isDone ? 0 : introOpacity,
          pointerEvents: isDone ? "none" : "auto",
          transition: isDone ? "opacity 0.3s" : "none",
        }}>

          <motion.div className="scanline" style={{ opacity: scanOpacity }} aria-hidden />

          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "radial-gradient(ellipse at 50% 42%, transparent 10%, #050508 80%)",
          }} aria-hidden />

          <motion.div style={{
            position: "absolute", zIndex: 3,
            display: "flex", alignItems: "center", justifyContent: "center",
            scale: reactorScale, willChange: "transform",
          }}>
            <ArcReactor progress={progress} />
          </motion.div>

          <motion.div style={{
            position: "absolute", zIndex: 4, pointerEvents: "none",
            y: textY, opacity: textOpacity, scale: textScale,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <ScrambleText
              text="VENTURE.CORE // BOOTSTRAP SEQUENCE"
              active={sc.sys} speed={30} stagger={50}
              style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 300,
                fontSize: "clamp(0.5rem,1.4vw,0.72rem)", letterSpacing: "0.55em",
                color: "rgba(0,245,255,0.65)", textTransform: "uppercase",
                marginBottom: "2.2rem", height: "1rem",
              }}
            />
            <ScrambleText
              text="E-CELL"
              active={sc.ecell} speed={42} stagger={90}
              style={{
                fontFamily: "'Exo 2',sans-serif", fontWeight: 900,
                fontSize: "clamp(5.5rem,18vw,14rem)", lineHeight: 1,
                letterSpacing: "-0.02em",
                background: "linear-gradient(158deg,#ffffff 0%,#d4b0ff 42%,#00f5ff 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(178,102,255,0.3))",
                userSelect: "none", textAlign: "center", minHeight: "14rem",
              }}
            />
            <motion.div style={{ y: subY, opacity: subOpacity, marginTop: "1.6rem" }}>
              <ScrambleText
                text="IISER  BHOPAL"
                active={sc.sub} speed={36} stagger={60}
                style={{
                  fontFamily: "'Exo 2',sans-serif", fontWeight: 200, fontStyle: "italic",
                  fontSize: "clamp(0.9rem,3.2vw,1.9rem)", letterSpacing: "0.30em",
                  color: "rgba(255,255,255,0.6)", height: "2rem", textAlign: "center",
                }}
              />
            </motion.div>
          </motion.div>

          <ScrollNudge opacity={nudgeOpacity} />

        </motion.div>
      </div>
    </>
  );
}