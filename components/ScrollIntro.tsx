"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// SCRAMBLE TEXT HOOK
// ─────────────────────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$Σ∆Ω≈";

function useScramble(target: string, active: boolean, speed = 36, stagger = 52) {
  const [display, setDisplay] = useState(target.split("").map(() => " ").join(""));
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) { setDisplay(target.split("").map(() => " ").join("")); return; }
    let elapsed = 0;
    const resolved = new Array(target.length).fill(false);
    ref.current = setInterval(() => {
      elapsed += speed;
      const next = target.split("").map((ch, i) => {
        if (ch === " " || ch === "—") return ch;
        if (elapsed > i * stagger + 300) resolved[i] = true;
        return resolved[i] ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      setDisplay(next);
      if (resolved.every(Boolean)) clearInterval(ref.current!);
    }, speed);
    return () => clearInterval(ref.current!);
  }, [active, target, speed, stagger]);

  return display;
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND CANVAS  — star field + subtle particles (always on)
// ─────────────────────────────────────────────────────────────────────────────
function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let animId: number, t = 0, last = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Stars
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.5 + 0.1,
      ts: Math.random() * 0.015 + 0.004,
      to: Math.random() * Math.PI * 2,
      col: ["#ffffff","#cce8ff","#c8b8ff","#aaf0ff"][Math.floor(Math.random()*4)],
    }));

    // Shooting stars
    type Shoot = { x:number; y:number; vx:number; vy:number; op:number; life:number; maxLife:number; delay:number; timer:number };
    const mkS = (delay:number): Shoot => ({
      x:Math.random()*window.innerWidth*0.6, y:Math.random()*window.innerHeight*0.4,
      vx:Math.random()*7+5, vy:Math.random()*3+1, op:0, life:0, maxLife:55, delay, timer:0,
    });
    const shoots = [0,220,500,800].map(mkS);

    const loop = (now: number) => {
      const dt = Math.min((now-last)/1000, 0.05); last=now; t+=dt;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="#06060e"; ctx.fillRect(0,0,canvas.width,canvas.height);

      // Stars
      stars.forEach(s => {
        const tw = Math.sin(t*s.ts*60+s.to);
        ctx.globalAlpha = Math.max(0.05, s.a + tw*0.3);
        ctx.fillStyle = s.col;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      });

      // Shooting stars
      shoats: shoots.forEach(s => {
        s.timer += dt*60;
        if (s.timer < s.delay) return;
        s.life++;
        s.op = s.life < 10 ? s.life/10 : s.life > s.maxLife-10 ? (s.maxLife-s.life)/10 : 1;
        s.x+=s.vx; s.y+=s.vy;
        if (s.life >= s.maxLife) { Object.assign(s, mkS(0)); s.delay=Math.random()*400+100; return; }
        const g = ctx.createLinearGradient(s.x-s.vx*14,s.y-s.vy*14,s.x,s.y);
        g.addColorStop(0,"rgba(255,255,255,0)");
        g.addColorStop(1,`rgba(180,230,255,${s.op})`);
        ctx.strokeStyle=g; ctx.lineWidth=1.5;
        ctx.shadowBlur=8; ctx.shadowColor="rgba(140,210,255,0.8)";
        ctx.beginPath(); ctx.moveTo(s.x-s.vx*14,s.y-s.vy*14); ctx.lineTo(s.x,s.y); ctx.stroke();
        ctx.shadowBlur=0;
      });

      ctx.globalAlpha=1;
      animId=requestAnimationFrame(loop);
    };
    animId=requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize",resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGO SVG  — geometric crystal, draws itself as scroll starts
// ─────────────────────────────────────────────────────────────────────────────
function LogoMark({ scrollProg }: { scrollProg: number }) {
  const draw      = Math.min(1, scrollProg * 5);
  const ring1Deg  =  scrollProg * 300;
  const ring2Deg  = -scrollProg * 200;
  const innerDeg  =  scrollProg * 180;

  const d = (len: number) => ({
    strokeDasharray: `${len}`,
    strokeDashoffset: `${len * (1 - draw)}`,
    transition: "none",
  });

  return (
    <svg width="210" height="210" viewBox="0 0 110 110" fill="none" style={{ overflow:"visible" }}>

      {/* ── Outer dashed orbit ring ── */}
      <g style={{ transform:`rotate(${ring1Deg}deg)`, transformOrigin:"55px 55px" }}>
        <circle cx="55" cy="55" r="52" stroke="rgba(0,245,255,0.20)" strokeWidth="0.7" strokeDasharray="3 9"/>
        <circle cx="55" cy="55" r="47" stroke="rgba(178,102,255,0.28)" strokeWidth="0.7" strokeDasharray="10 5 2 5"/>
        {/* 8 orbital nodes (Math rounded to avoid hydration mismatch) */}
        {Array.from({length:8}).map((_,i)=>{
          const a=(i/8)*Math.PI*2;
          const cx = +(55 + Math.cos(a) * 47).toFixed(3);
          const cy = +(55 + Math.sin(a) * 47).toFixed(3);
          return <circle key={i} cx={cx} cy={cy} r="1.4"
            fill={i%2===0?"#00f5ff":"#b266ff"}
            style={{opacity:draw,filter:`drop-shadow(0 0 4px ${i%2===0?"#00f5ff":"#b266ff"})`}}/>;
        })}
      </g>

      {/* ── Hexagon — self-drawing ── */}
      <polygon points="55,8 90,27.5 90,72.5 55,92 20,72.5 20,27.5"
        stroke="rgba(0,245,255,0.55)" strokeWidth="1.1" fill="rgba(0,245,255,0.025)"
        style={{filter:"drop-shadow(0 0 6px rgba(0,245,255,0.3))",...d(260)}}/>

      {/* ── Inner spinning ring ── */}
      <g style={{ transform:`rotate(${ring2Deg}deg)`, transformOrigin:"55px 55px" }}>
        <circle cx="55" cy="55" r="34" stroke="rgba(0,245,255,0.35)" strokeWidth="0.8" strokeDasharray="6 4"/>
        {/* 6 tick marks (Math rounded to avoid hydration mismatch) */}
        {Array.from({length:6}).map((_,i)=>{
          const a=(i/6)*Math.PI*2;
          const x1 = +(55 + Math.cos(a) * 31).toFixed(3);
          const y1 = +(55 + Math.sin(a) * 31).toFixed(3);
          const x2 = +(55 + Math.cos(a) * 34).toFixed(3);
          const y2 = +(55 + Math.sin(a) * 34).toFixed(3);
          return <line key={i}
            x1={x1} y1={y1}
            x2={x2} y2={y2}
            stroke="#00f5ff" strokeWidth="1.2"
            style={{opacity:draw}}/>;
        })}
      </g>

      {/* ── Rotating diamond ── */}
      <g style={{ transform:`rotate(${innerDeg}deg)`, transformOrigin:"55px 55px" }}>
        <polygon points="55,26 76,49 55,72 34,49"
          stroke="rgba(178,102,255,0.85)" strokeWidth="1"
          fill="rgba(178,102,255,0.05)"
          style={{filter:"drop-shadow(0 0 8px rgba(178,102,255,0.5))",...d(145)}}/>
        {[[55,26],[76,49],[55,72],[34,49]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2.2"
            fill={i%2===0?"#b266ff":"#00f5ff"}
            style={{opacity:draw,filter:`drop-shadow(0 0 6px ${i%2===0?"#b266ff":"#00f5ff"})`}}/>
        ))}
      </g>

      {/* ── Star triangles ── */}
      <polygon points="55,30 72,60 38,60"
        stroke="rgba(0,245,255,0.45)" strokeWidth="0.7" fill="rgba(0,245,255,0.025)"
        style={d(96)}/>
      <polygon points="55,80 38,50 72,50"
        stroke="rgba(178,102,255,0.45)" strokeWidth="0.7" fill="rgba(178,102,255,0.025)"
        style={d(96)}/>

      {/* ── Hex vertex glow dots ── */}
      {[[55,8],[90,27.5],[90,72.5],[55,92],[20,72.5],[20,27.5]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2.6"
          fill={i%2===0?"#00f5ff":"#b266ff"}
          style={{opacity:draw,filter:`drop-shadow(0 0 8px ${i%2===0?"#00f5ff":"#b266ff"})`}}/>
      ))}

      {/* ── Core ── */}
      <circle cx="55" cy="55" r="12" fill="#06060e"
        stroke="rgba(0,245,255,0.9)" strokeWidth="1.3"
        style={{filter:"drop-shadow(0 0 14px rgba(0,245,255,0.55))"}}/>
      <circle cx="55" cy="55" r="6.5"
        fill="rgba(0,245,255,0.18)"
        style={{filter:"drop-shadow(0 0 12px #00f5ff)"}}/>
      <circle cx="55" cy="55" r="3"
        fill="#00f5ff"
        style={{filter:"drop-shadow(0 0 20px #00f5ff)"}}/>
      <circle cx="55" cy="55" r="1.2" fill="#ffffff"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GROW LINE
// ─────────────────────────────────────────────────────────────────────────────
function GrowLine({ color="#00f5ff", delay=0 }: { color?:string; delay?:number }) {
  return (
    <motion.div
      initial={{ scaleX:0, opacity:0 }}
      animate={{ scaleX:1, opacity:1 }}
      transition={{ duration:1.3, delay, ease:[0.16,1,0.3,1] }}
      style={{
        height:"1px", transformOrigin:"center",
        background:`linear-gradient(90deg,transparent,${color},transparent)`,
        boxShadow:`0 0 10px ${color}55`,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function ScrollIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => scrollYProgress.on("change", setProg), [scrollYProgress]);

  // ── Logo: zooms toward viewer, fades on exit ──────────────────────────
  const logoScale   = useTransform(scrollYProgress, [0, 0.28], [1, 42]);
  const logoOpacity = useTransform(scrollYProgress, [0.17, 0.28], [1, 0]);

  // ── Text block: rises after logo disappears, zooms out on exit ────────
  const textY       = useTransform(scrollYProgress, [0.24, 0.42], [80, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.24, 0.38, 0.72, 0.85], [0, 1, 1, 0]);
  const textScale   = useTransform(scrollYProgress, [0.72, 0.86], [1, 5.5]);
  const textBlur    = useTransform(scrollYProgress, [0.72, 0.86], [0, 28]);

  // ── Sub-elements ──────────────────────────────────────────────────────
  const subOpacity  = useTransform(scrollYProgress, [0.36, 0.48, 0.70, 0.82], [0, 1, 1, 0]);
  const subY        = useTransform(scrollYProgress, [0.36, 0.48], [20, 0]);

  // ── Scroll cue ────────────────────────────────────────────────────────
  const cueOpacity  = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Scramble triggers
  const ecell   = useScramble("E-CELL",         prog > 0.26, 38, 62);
  const sub     = useScramble("IISER  BHOPAL",  prog > 0.35, 32, 46);
  const sys     = useScramble("SYS.BOOT // SEQUENCE ALPHA", prog > 0.24, 28, 34);

  // Energy bar (progress 0.28 → 0.65 drives it 0 → 100%)
  const barPct = Math.min(100, Math.max(0, (prog - 0.28) / 0.37 * 100));

  const phase2 = prog > 0.23;

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
        @keyframes blink { 0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0} 51%{opacity:0} }
        .cursor::after { content:'_'; animation:blink 1s step-end infinite; color:#00f5ff; }
        @keyframes hpulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        .hp { animation: hpulse 2.2s ease-in-out infinite; }
        @keyframes neon-flicker {
          0%,19%,21%,23%,25%,54%,56%,100%{ opacity:1 }
          20%,24%,55%{ opacity:.4 }
        }
        .neon { animation: neon-flicker 6s infinite; }
      `}</style>

      <div ref={containerRef} style={{ height:"300vh", position:"relative", zIndex:50 }}>
        <div style={{
          position:"sticky", top:0, height:"100vh", width:"100%",
          overflow:"hidden", background:"#06060e",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>

          {/* Star field + shooting stars */}
          <BackgroundCanvas />

          {/* Scan line (phase 2 only) */}
          {phase2 && <div className="scanline" aria-hidden />}

          {/* Vignette */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
            background:"radial-gradient(ellipse at 50% 42%, transparent 20%, rgba(6,6,14,0.75) 100%)",
          }} aria-hidden />

          {/* ── PHASE 1: Logo zoom ─────────────────────────────────── */}
          <motion.div style={{
            position:"absolute", zIndex:3,
            scale:logoScale, opacity:logoOpacity,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <LogoMark scrollProg={prog} />
          </motion.div>

          {/* ── PHASE 2: Text reveal ───────────────────────────────── */}
          <motion.div style={{
            position:"absolute", zIndex:4,
            y:textY, opacity:textOpacity,
            scale:textScale,
            filter:useTransform(textBlur, v=>`blur(${v}px)`),
            display:"flex", flexDirection:"column", alignItems:"center",
          }}>

            {/* Mono system label */}
            <div className="hp" style={{
              fontFamily:"'JetBrains Mono',monospace", fontWeight:300,
              fontSize:"clamp(0.5rem,1.4vw,0.72rem)",
              letterSpacing:"0.55em", color:"rgba(0,245,255,0.65)",
              textTransform:"uppercase", marginBottom:"2.2rem",
            }}>
              {sys}
            </div>

            {/* ── Main title ── */}
            <div style={{ position:"relative", width:"100%", textAlign:"center" }}>

              {/* Ambient glow behind text */}
              <div style={{
                position:"absolute", inset:"-40px",
                background:"radial-gradient(ellipse at center, rgba(178,102,255,0.14) 0%, transparent 68%)",
                filter:"blur(24px)", pointerEvents:"none",
              }}/>

              {/* Top rule */}
              <div style={{ marginBottom:"1rem" }}>
                <GrowLine color="#00f5ff" delay={0.05} />
              </div>

              {/* E-CELL */}
              <div className="neon" style={{
                fontFamily:"'Exo 2',sans-serif", fontWeight:900,
                fontSize:"clamp(5.5rem,18vw,14rem)", lineHeight:1,
                letterSpacing:"-0.02em",
                background:"linear-gradient(158deg,#ffffff 0%,#d4b0ff 42%,#00f5ff 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                filter:"drop-shadow(0 0 55px rgba(178,102,255,0.42))",
                userSelect:"none",
              }}>
                {ecell}
              </div>

              {/* Bottom rule */}
              <div style={{ marginTop:"1rem" }}>
                <GrowLine color="#b266ff" delay={0.2} />
              </div>

              {/* Energy bar */}
              <div style={{
                marginTop:"1.4rem",
                width:"100%", height:"2px",
                background:"rgba(0,245,255,0.10)", position:"relative", borderRadius:2,
              }}>
                <div style={{
                  position:"absolute", inset:0, borderRadius:2,
                  width:`${barPct}%`,
                  background:"linear-gradient(90deg,#00f5ff,#b266ff)",
                  boxShadow:"0 0 14px #00f5ff, 0 0 28px #b266ff55",
                  transition:"width 0.06s linear",
                }}/>
                {/* Moving dot at tip */}
                <div style={{
                  position:"absolute", top:"50%", transform:"translate(-50%,-50%)",
                  left:`${barPct}%`,
                  width:8, height:8, borderRadius:"50%",
                  background:"#fff", boxShadow:"0 0 10px #00f5ff",
                  transition:"left 0.06s linear",
                }}/>
              </div>
            </div>

            {/* IISER BHOPAL */}
            <motion.div style={{ y:subY, opacity:subOpacity, marginTop:"1.6rem" }}>
              <span style={{
                fontFamily:"'Exo 2',sans-serif", fontWeight:200, fontStyle:"italic",
                fontSize:"clamp(0.9rem,3.2vw,1.9rem)",
                letterSpacing:"0.30em", color:"rgba(255,255,255,0.52)",
              }} className="cursor">
                {sub}
              </span>
            </motion.div>

            {/* HUD corner data (minimal, 2 items only) */}
            <motion.div style={{ y:subY, opacity:subOpacity, marginTop:"3rem",
              display:"flex", gap:"3rem", alignItems:"center",
            }}>
              {[
                { val:"2025", lbl:"Founded" },
                { val:"∞",    lbl:"Ideas"   },
                { val:"IND",  lbl:"Nation"  },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"3rem" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{
                      fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
                      fontSize:"clamp(0.9rem,2.5vw,1.4rem)",
                      color:"#00f5ff", textShadow:"0 0 14px rgba(0,245,255,0.55)",
                    }}>
                      {item.val}
                    </div>
                    <div style={{
                      fontFamily:"'JetBrains Mono',monospace", fontWeight:300,
                      fontSize:"0.52rem", letterSpacing:"0.3em",
                      color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginTop:4,
                    }}>
                      {item.lbl}
                    </div>
                  </div>
                  {i<2 && <div style={{width:1,height:28,background:"rgba(0,245,255,0.2)"}}/>}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Scroll cue ──────────────────────────────────────────── */}
          <motion.div style={{
            position:"absolute", bottom:"2.8rem", zIndex:5,
            opacity:cueOpacity,
            display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem",
          }}>
            <span style={{
              fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem",
              letterSpacing:"0.4em", color:"rgba(0,245,255,0.55)", textTransform:"uppercase",
            }}>
              Initiate Sequence
            </span>
            <motion.div
              animate={{ y:[0,7,0], opacity:[0.4,1,0.4] }}
              transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
            >
              <ChevronDown size={18} style={{ color:"rgba(0,245,255,0.5)", filter:"drop-shadow(0 0 5px #00f5ff)" }}/>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </>
  );
}