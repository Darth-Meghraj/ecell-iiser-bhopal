"use client"

// components/splash-screen.tsx
// Cinematic intro animation shown once on first load.
// Sequence:
//   0.0s  — black screen, particles begin spawning
//   0.4s  — logo mark draws in
//   0.8s  — "E-CELL" letters stagger in one by one
//   1.6s  — tagline fades up
//   2.4s  — progress bar fills
//   3.2s  — entire screen does a radial-wipe reveal, exposing the site underneath
//   3.8s  — component unmounts

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useAnimate, stagger } from "framer-motion"

// ── Particle canvas ──────────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    type Particle = {
      x: number; y: number; vx: number; vy: number
      radius: number; alpha: number; decay: number; color: string
    }

    const particles: Particle[] = []
    const colors = ["#00f5ff", "#b266ff", "#ffffff", "#00c8d4"]
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // Burst particles outward from center
    for (let i = 0; i < 120; i++) {
      const angle  = (Math.PI * 2 * i) / 120 + Math.random() * 0.3
      const speed  = Math.random() * 4 + 1
      const delay  = Math.random() * 60  // frames
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 0.5,
        alpha: 0,
        decay: Math.random() * 0.006 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Floating ambient particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5,
        decay: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let frame = 0
    let raf: number

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      for (const p of particles) {
        if (frame < 10) { p.alpha = Math.min(p.alpha + 0.05, 0.9); }
        p.x += p.vx
        p.y += p.vy
        if (p.decay > 0) p.alpha -= p.decay
        if (p.alpha < 0) p.alpha = 0

        // Wrap ambient particles
        if (p.decay === 0) {
          if (p.x < 0) p.x = canvas.width
          if (p.x > canvas.width) p.x = 0
          if (p.y < 0) p.y = canvas.height
          if (p.y > canvas.height) p.y = 0
        }

        if (p.alpha <= 0) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  )
}

// ── Animated logo mark (SVG path draw-in) ────────────────────────────────────

function LogoMark() {
  return (
    <motion.svg
      width="64" height="64" viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon */}
      <motion.path
        d="M32 4 L58 18 L58 46 L32 60 L6 46 L6 18 Z"
        stroke="#00f5ff" strokeWidth="1.5" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        style={{ filter: "drop-shadow(0 0 8px rgba(0,245,255,0.8))" }}
      />
      {/* Inner spark */}
      <motion.path
        d="M32 16 L38 28 L50 30 L41 39 L43 52 L32 46 L21 52 L23 39 L14 30 L26 28 Z"
        stroke="#b266ff" strokeWidth="1" fill="rgba(178,102,255,0.15)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.7 }}
        style={{ filter: "drop-shadow(0 0 6px rgba(178,102,255,0.8))" }}
      />
      {/* Center dot */}
      <motion.circle
        cx="32" cy="32" r="3" fill="#00f5ff"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.1, type: "spring", bounce: 0.6 }}
        style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }}
      />
    </motion.svg>
  )
}

// ── Letter-by-letter text reveal ─────────────────────────────────────────────

const LETTERS = "E-CELL".split("")

function KineticText() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.05em" }}>
      {LETTERS.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.9 + i * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: "inline-block",
            fontFamily: "'Exo 2', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(4rem, 12vw, 9rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            background: char === "-"
              ? "rgba(255,255,255,0.2)"
              : "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}

// ── Tagline ───────────────────────────────────────────────────────────────────

function Tagline() {
  const words = "IISER BHOPAL  ·  ENTREPRENEURSHIP CELL".split(" ")
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em", justifyContent: "center" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: word === "·" ? 0.25 : 0.45 }}
          transition={{ duration: 0.4, delay: 1.65 + i * 0.04 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      style={{ width: "200px", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}
    >
      {/* Track */}
      <div style={{
        width: "100%", height: "1px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "9999px", overflow: "hidden",
      }}>
        {/* Fill */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: "100%", borderRadius: "9999px",
            background: "linear-gradient(90deg, #00f5ff, #b266ff)",
            transformOrigin: "left",
            boxShadow: "0 0 8px rgba(0,245,255,0.6)",
          }}
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.7 }}
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff" }}
      >
        INITIALIZING
      </motion.span>
    </motion.div>
  )
}

// ── Curtain wipe (clips away to reveal site) ──────────────────────────────────

function CurtainWipe({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 0 0)" }}
      animate={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.7, delay: 3.2, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onComplete}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "#050508",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Horizontal scan line sweep */}
      <motion.div
        initial={{ top: "-2px", opacity: 0 }}
        animate={{ top: "102%", opacity: [0, 0.8, 0.8, 0] }}
        transition={{ duration: 0.7, delay: 3.15, ease: "linear" }}
        style={{
          position: "absolute", left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, #00f5ff, transparent)",
          boxShadow: "0 0 12px rgba(0,245,255,0.8)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  )
}

// ── Main SplashScreen ─────────────────────────────────────────────────────────

export function SplashScreen({ onFinished }: { onFinished: () => void }) {
  const [wiping, setWiping] = useState(false)

  // Start wipe after 3.0s
  useEffect(() => {
    const t = setTimeout(() => setWiping(true), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, backgroundColor: "#050508", overflow: "hidden" }}>
      {/* Particle layer */}
      <ParticleCanvas />

      {/* Central content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "1.5rem",
        perspective: "800px",
      }}>
        {/* Glow orbs */}
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(178,102,255,0.1) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none", transform: "translate(80px, 40px)",
        }} />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <LogoMark />
        </motion.div>

        {/* Kinetic headline */}
        <KineticText />

        {/* Tagline */}
        <Tagline />

        {/* Progress */}
        <ProgressBar />
      </div>

      {/* Corner labels */}
      {[
        { text: "EST. 2024", pos: { top: "1.5rem", left: "1.5rem" } },
        { text: "BHOPAL, MP",  pos: { top: "1.5rem", right: "1.5rem" } },
        { text: "IISER BHOPAL", pos: { bottom: "1.5rem", left: "1.5rem" } },
        { text: "v1.0.0",     pos: { bottom: "1.5rem", right: "1.5rem" } },
      ].map(({ text, pos }) => (
        <motion.span
          key={text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 2 }}
          style={{
            position: "absolute", ...pos,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#fff",
            pointerEvents: "none",
          }}
        >
          {text}
        </motion.span>
      ))}

      {/* The curtain wipe */}
      {wiping && <CurtainWipe onComplete={onFinished} />}
    </div>
  )
}
