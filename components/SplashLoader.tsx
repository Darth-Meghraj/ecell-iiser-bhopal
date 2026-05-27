"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useTransform, useMotionValueEvent, useMotionValue, animate } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// CIPHER TEXT ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$Σ∆Ω≈<>?/\\|{}[]*&%";

function ScrambleText({ text, active, speed = 36, stagger = 60, className, style }: any) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;
    if (!active) { 
      elRef.current.innerText = text.split("").map(() => "\u00A0").join(""); 
      return; 
    }
    
    let elapsed = 0;
    const resolved = new Array(text.length).fill(false);
    const interval = setInterval(() => {
      elapsed += speed;
      const next = text.split("").map((ch: string, i: number) => {
        if (ch === " " || ch === "—") return ch;
        if (elapsed > i * stagger + 600) resolved[i] = true;
        return resolved[i] ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      
      if (elRef.current) elRef.current.innerText = next;
      if (resolved.every(Boolean)) clearInterval(interval);
    }, speed);
    
    return () => clearInterval(interval);
  }, [active, text, speed, stagger]);

  return <div ref={elRef} className={className} style={style} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARC REACTOR 
// ─────────────────────────────────────────────────────────────────────────────
function ArcReactor({ progress }: { progress: any }) {
  const ring1Rotate = useTransform(progress, [0, 1], [0, 360]); 
  const ring2Rotate = useTransform(progress, [0, 1], [0, -420]); 
  const ring3Rotate = useTransform(progress, [0, 1], [0, 180]); 

  const corePower = useTransform(progress, [0, 0.3], [0, 1]);
  const irisOpen = useTransform(progress, [0.75, 0.96], [150, 240]); 

  const flashScale = useTransform(progress, [0.95, 0.98], [0, 250]);
  const flashOpacity = useTransform(progress, [0.95, 0.96], [0, 1]);

  return (
    <div style={{ position: "relative", width: 300, height: 300 }}>
      <motion.div
        style={{
          position: "absolute", top: "50%", left: "50%", width: 20, height: 20, x: "-50%", y: "-50%",
          borderRadius: "50%", background: "#ffffff", boxShadow: "0 0 60px 30px #ffffff, 0 0 100px 50px #00f5ff",
          scale: flashScale, opacity: flashOpacity, zIndex: 50, willChange: "transform, opacity"
        }}
      />
      <motion.div style={{
        position: "absolute", inset: 0, background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)",
        filter: "blur(50px)", opacity: corePower, zIndex: -1
      }} />
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none" style={{ overflow:"visible" }}>
        <defs>
          <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2d3e" />
            <stop offset="50%" stopColor="#0a0b10" />
            <stop offset="100%" stopColor="#3d435c" />
          </linearGradient>
          <linearGradient id="copper-accent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#050508" />
            <stop offset="100%" stopColor="#0044ff" stopOpacity="0.4"/>
          </linearGradient>
          <radialGradient id="plasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#00f5ff" />
            <stop offset="70%" stopColor="#0044ff" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <circle cx="150" cy="150" r="140" fill="url(#copper-accent)" stroke="#1a1d2e" strokeWidth="2"/>
        <circle cx="150" cy="150" r="130" fill="url(#titanium)" stroke="#000" strokeWidth="6"/>

        <motion.g style={{ rotate: ring1Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="115" stroke="#00f5ff" strokeWidth="1" strokeDasharray="2 12" opacity="0.5"/>
          <circle cx="150" cy="150" r="105" stroke="url(#titanium)" strokeWidth="12" strokeDasharray="60 20" strokeLinecap="round"/>
          <circle cx="150" cy="150" r="105" stroke="#00f5ff" strokeWidth="2" strokeDasharray="0 80" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #00f5ff)" }}/>
        </motion.g>

        <motion.g style={{ rotate: ring2Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="85" stroke="#0a0b10" strokeWidth="16" />
          <circle cx="150" cy="150" r="85" stroke="#00f5ff" strokeWidth="4" strokeDasharray="15 45" style={{ filter: "drop-shadow(0 0 10px #00f5ff)" }}/>
          {Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={+(150 + Math.cos(a) * 75).toFixed(2)} y1={+(150 + Math.sin(a) * 75).toFixed(2)}
              x2={+(150 + Math.cos(a) * 95).toFixed(2)} y2={+(150 + Math.sin(a) * 95).toFixed(2)} stroke="#1a1d2e" strokeWidth="4" />
          })}
        </motion.g>

        <motion.g style={{ rotate: ring3Rotate, transformOrigin: "150px 150px" }}>
          <circle cx="150" cy="150" r="60" stroke="#0044ff" strokeWidth="8" opacity="0.3"/>
          <motion.circle cx="150" cy="150" r="60" stroke="#00f5ff" strokeWidth="8" strokeDasharray="200 100" strokeDashoffset={irisOpen} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 15px #00f5ff)" }}/>
        </motion.g>

        <motion.circle cx="150" cy="150" r="45" fill="url(#plasma)" style={{ opacity: corePower }} />
        <motion.circle cx="150" cy="150" r="20" fill="#ffffff" style={{ opacity: corePower, filter: "drop-shadow(0 0 20px #fff)" }} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTOMATED SPLASH LOADER
// ─────────────────────────────────────────────────────────────────────────────
export default function SplashLoader({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const progress = useMotionValue(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const controls = animate(progress, 1, {
      duration: 7.0,
      ease: [0.45, 0, 0.55, 1],
      onComplete: () => {
        document.body.style.overflow = ""; 
        setIsVisible(false);
        if (onComplete) onComplete();
      }
    });

    return () => {
      controls.stop();
      document.body.style.overflow = "";
    };
  }, [progress, onComplete]);

  const [scrambleStates, setScrambleStates] = useState({ sys: false, ecell: false, sub: false });
  useMotionValueEvent(progress, "change", (v) => {
    const sys = v > 0.15; 
    const ecell = v > 0.20;
    const sub = v > 0.30;
    if (scrambleStates.sys !== sys || scrambleStates.ecell !== ecell || scrambleStates.sub !== sub) {
      setScrambleStates({ sys, ecell, sub });
    }
  });

  const textY       = useTransform(progress, [0.15, 0.35], [80, 0]);
  
  // 🚀 FIXED TIMINGS: Text now stays fully opaque until 88% of the animation, fading out right at the flashbang (96%)
  const textOpacity = useTransform(progress, [0.15, 0.30, 0.88, 0.96], [0, 1, 1, 0]); 
  const textScale   = useTransform(progress, [0.85, 0.96], [1, 1.8]);
  
  const subOpacity  = useTransform(progress, [0.30, 0.45, 0.88, 0.96], [0, 1, 1, 0]);
  const subY        = useTransform(progress, [0.30, 0.45], [20, 0]);
  
  const scanlineOpacity = useTransform(progress, [0.15, 0.20, 0.85, 0.87], [0, 1, 1, 0]);
  const reactorScale = useTransform(progress, [0.75, 0.96], [1, 4]);

  if (!isVisible) return null;

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
          position:absolute; left:0; right:0; height:2px; pointer-events:none; z-index:10;
          background: linear-gradient(90deg,transparent,rgba(0,245,255,0.3),transparent);
          animation: scan 4s ease-in-out infinite;
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 6.8, duration: 0.3 }} 
        style={{
          position:"fixed", inset:0, zIndex:9999, overflow:"hidden", background:"#050508", 
          display: "flex", alignItems:"center", justifyContent:"center"
        }}
      >
        <motion.div className="scanline" style={{ opacity: scanlineOpacity }} aria-hidden />
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1, background:"radial-gradient(ellipse at 50% 42%, transparent 10%, #050508 80%)" }} aria-hidden />

        <motion.div style={{ position:"absolute", zIndex:3, display: "flex", alignItems:"center", justifyContent:"center", scale: reactorScale, willChange: "transform" }}>
          <ArcReactor progress={progress} />
        </motion.div>

        <motion.div style={{ position:"absolute", zIndex:4, y:textY, opacity:textOpacity, scale:textScale, display: "flex", flexDirection:"column", alignItems:"center", pointerEvents: "none" }}>
          <ScrambleText text="VENTURE.CORE // BOOTSTRAP SEQUENCE" active={scrambleStates.sys} speed={30} stagger={50} style={{
            fontFamily:"'JetBrains Mono',monospace", fontWeight:300, fontSize:"clamp(0.5rem,1.4vw,0.72rem)", letterSpacing:"0.55em", color:"rgba(0,245,255,0.65)", textTransform:"uppercase", marginBottom:"2.2rem", height: "1rem"
          }} />

          <div style={{ position:"relative", width:"100%", textAlign:"center" }}>
            <ScrambleText text="E-CELL" active={scrambleStates.ecell} speed={42} stagger={90} style={{
              fontFamily:"'Exo 2',sans-serif", fontWeight:900, fontSize:"clamp(5.5rem,18vw,14rem)", lineHeight:1, letterSpacing:"-0.02em", background:"linear-gradient(158deg,#ffffff 0%,#d4b0ff 42%,#00f5ff 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", filter:"drop-shadow(0 0 30px rgba(178,102,255,0.3))", userSelect:"none", minHeight: "14rem"
            }} />
          </div>

          <motion.div style={{ y:subY, opacity:subOpacity, marginTop:"1.6rem" }}>
            <ScrambleText text="IISER  BHOPAL" active={scrambleStates.sub} speed={36} stagger={60} style={{
              fontFamily:"'Exo 2',sans-serif", fontWeight:200, fontStyle:"italic", fontSize:"clamp(0.9rem,3.2vw,1.9rem)", letterSpacing:"0.30em", color:"rgba(255,255,255,0.6)", height: "2rem"
            }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}