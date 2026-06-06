"use client";

import { useRef, MouseEvent as ReactMouseEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Mail } from "lucide-react";
import StarStream from "@/components/ui/StarStream";

// --- CUSTOM ICONS ---
const Github = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const Linkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// --- TEAM DATA ---
const coordinators = [
  {
    name: "Dishank. K",
    image: "/team/dishank.jpg",
    role: "Coordinator",
    department: "BS engineering 3rd Year",
    bio: "You miss 100% of the shots you don't take - Wayne Gretzky - Michael Scott",
    color: "violet",
    socials: { email: "mailto:dishank24@iiserb.ac.in" }
  },
  {
    name: "Madhav Basatia",
    image: "/team/madhav.jpg",
    role: "Coordinator",
    department: "BS Economics 3rd Year",
    bio: "Decoding the unseen.",
    color: "cyan",
    socials: { email: "mailto:madhav24@iiserb.ac.in" },
  },
];

const team = [
  {
    name: "Ayush Sarkar",
    image: "/team/ayush.jpg",
    role: "Junior Associate",
    department: "BTech · 2nd Year",
    bio: "Learning deeply. Building relentlessly. (The 'tech' guy)",
    color: "cyan",
    socials: {
      linkedin: "https://www.linkedin.com/in/ayush-sarkar-04b7b5371",
      github: "https://github.com/AyushS05",
      email: "mailto:ayushsarkar052006@gmail.com",
    },
  },
  {
    name: "Sarvesh Shamkuwar",
    image: "/team/sarvesh.jpg",
    role: "Junior Associate",
    department: "BS Economics · 2nd Year",
    bio: "I'm like an index fund: highly diversified across every single department.",
    color: "green",
    socials: {
      linkedin: "https://www.linkedin.com/in/sarvesh-shamkuwar-b5b1062b4",
      email: "mailto:sarvesh25@iiserb.ac.in",
    },
  },
  {
    name: "Aarushi Bhattacharya",
    image: "/team/aarushi.jpg",
    role: "Social Media Head",
    department: "Economics · 2nd Year",
    bio: "THE PURPOSE OF LIFE IS LIFE OF PURPOSE",
    color: "violet",
    socials: { email: "mailto:aarushi25@iiserb.ac.in" },
  },
  {
    name: "Gyan Deepika Gandepalli",
    image: "/team/gyan.jpg",
    role: "Social Media Team",
    department: "BS Economics · 2nd Year",
    bio: "Hotel (I panicked)",
    color: "cyan",
    socials: {
      linkedin: "https://www.linkedin.com/in/gyan-deepika-gandepalli-23820b2a4",
      email: "mailto:gyan25@iiserb.ac.in",
    },
  },
  {
    name: "Lekhraj Sawner",
    image: "/team/lekhraj.jpg",
    role: "Junior Associate",
    department: "BTech (Engineering Science) · 2nd Year",
    bio: "Tech logic. Business magic",
    color: "green",
    socials: {
      linkedin: "https://www.linkedin.com/in/lekhraj-sawner-32767a378",
      email: "mailto:lekhraj25@iiserb.ac.in",
    },
  },
  {
    name: "Ayush Bhoi",
    image: "/team/ayush_b.jpg",
    role: "Event Management",
    department: "BTech · 2nd Year",
    bio: "A Cool Techy Person who likes talking with people ;)",
    color: "violet",
    socials: { email: "mailto:ayushb25@iiserb.ac.in" },
  },
  {
    name: "Smruti Ranjan Sethy",
    image: "/team/smruti.jpg",
    role: "Junior Associate",
    department: "BS Economics · 2nd Year",
    bio: "I read half of a business book once, so I'm basically an industry expert.",
    color: "cyan",
    socials: { linkedin: "https://www.linkedin.com/in/smruti-ranjan-sethy-056807268" },
  },
  {
    name: "Shrinivas Manoj Ingawale",
    image: "/team/shrinivas.jpg",
    role: "PR Team",
    department: "BS-MS · 2nd Year",
    bio: "Curious about startups, entrepreneurship, and discovering new business ideas.",
    color: "violet",
    socials: { email: "mailto:ingawale25@iiserb.ac.in" },
  },
];

// --- STYLING MAPPING ---
const colorStyles: Record<string, { bg: string; text: string; border: string; glow: string; dot: string }> = {
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.12)]",
    dot: "bg-cyan-400",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.12)]",
    dot: "bg-violet-400",
  },
  green: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.12)]",
    dot: "bg-emerald-400",
  },
};

// --- ANIMATED SECTION HEADING ---
function SectionHeading({ label, color }: { label: string; color: "cyan" | "violet" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const gradientFrom = color === "cyan" ? "from-cyan-400" : "from-violet-400";
  const gradientVia = color === "cyan" ? "via-sky-300" : "via-purple-300";
  const gradientTo = color === "cyan" ? "to-teal-400" : "to-pink-400";
  const lineColor = color === "cyan" ? "via-cyan-400" : "via-violet-400";

  return (
    <div ref={ref} className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative inline-block"
      >
        {/* Glow behind text */}
        <span
          className={`absolute inset-0 blur-2xl opacity-20 font-display text-6xl md:text-7xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} bg-clip-text text-transparent pointer-events-none select-none`}
          aria-hidden
        >
          {label}
        </span>
        <h2
          className={`relative font-display text-6xl md:text-7xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} bg-clip-text text-transparent pb-4`}
        >
          {label}
        </h2>
      </motion.div>

      {/* Animated divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto w-40 h-px bg-gradient-to-r from-transparent ${lineColor} to-transparent`}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}

// --- MEET THE TEAM ANIMATED HERO ---
function MeetTheTeamHero() {
  const chars = "Meet the".split("");
  
  return (
    <div className="max-w-4xl mx-auto text-center mb-28">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-3 mb-10 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-sans text-white/70 text-xs font-semibold uppercase tracking-[0.2em]">The Core Network</span>
      </motion.div>

      {/* "Meet the" — sans-serif, character-by-character reveal */}
      <div className="flex items-baseline justify-center gap-2 flex-wrap mb-4">
        <div className="flex items-baseline">
          {chars.map((char, i) => (
            <motion.span
              key={i}
              className="font-sans text-4xl md:text-6xl font-medium text-white/90 tracking-tight"
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </div>

      {/* "Team" — New sleek 3D Spring Animation */}
      <div className="relative flex justify-center items-center mb-10" style={{ height: "clamp(100px, 15vw, 160px)" }}>
        
        {/* Glowing halo behind the word */}
        <motion.div
          className="absolute inset-0 flex justify-center items-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
        >
          <div className="w-72 h-32 rounded-full bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-emerald-500/30 blur-3xl" />
        </motion.div>

        {/* Actual "Team" text */}
        <motion.span
          className="font-display relative z-10 bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent select-none px-6 pb-4 drop-shadow-2xl"
          style={{
            fontSize: "clamp(80px, 14vw, 150px)",
            lineHeight: 1.1,
            transformStyle: "preserve-3d"
          }}
          initial={{ opacity: 0, y: 50, rotateX: 60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, rotateX: -5, scale: 1 }}
          transition={{
            delay: 0.7,
            type: "spring",
            stiffness: 120,
            damping: 12,
            mass: 1.2
          }}
        >
          Team
        </motion.span>

        {/* Sparkle dots that burst outward */}
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full shadow-lg"
            style={{
              background: ["#22d3ee","#a78bfa","#34d399","#f472b6","#60a5fa","#fb923c", "#e879f9", "#2dd4bf"][i],
              top: "50%",
              left: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, Math.cos((i / 8) * Math.PI * 2) * 140],
              y: [0, Math.sin((i / 8) * Math.PI * 2) * 80],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{ delay: 1.0 + i * 0.03, duration: 1.2, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
        className="font-sans text-white/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed tracking-wide"
      >
        The innovators, builders, and thinkers driving the entrepreneurship ecosystem at IISER Bhopal.
      </motion.p>
    </div>
  );
}

// --- TILT CARD ---
function TiltCard({ member, isCoordinator = false }: { member: any; isCoordinator?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const style = colorStyles[member.color];

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !sheenRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (x - rect.width / 2) / (rect.width / 2);
    const dy = (y - rect.height / 2) / (rect.height / 2);
    cardRef.current.style.transform = `perspective(900px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale3d(1.02,1.02,1.02)`;
    sheenRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 65%)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !sheenRef.current) return;
    cardRef.current.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    sheenRef.current.style.background = "transparent";
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl transition-all duration-200 ease-out overflow-hidden ${style.glow} ${isCoordinator ? "p-7 md:p-8" : "p-6"}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Top color accent line */}
      <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${style.text.replace("text-", "via-")} to-transparent opacity-40`} />

      <div ref={sheenRef} className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300" />

      <div className="relative z-10 flex-1 flex flex-col" style={{ transform: "translateZ(20px)" }}>
        {/* Image */}
        <div className="relative mb-5 group rounded-2xl overflow-hidden border border-white/[0.08] shadow-md">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className={`w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${isCoordinator ? "h-52" : "h-44"}`}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className={`w-full ${isCoordinator ? "h-52" : "h-44"} flex items-center justify-center font-display text-7xl ${style.bg} ${style.text}`}>
              {member.name.charAt(0)}
            </div>
          )}

          {/* Social overlay */}
          {member.socials && (
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/55 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
              {member.socials.linkedin && (
                <a href={member.socials.linkedin} target="_blank" rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/35 hover:scale-110 transition-all shadow-lg backdrop-blur-md border border-white/10">
                  <Linkedin size={18} />
                </a>
              )}
              {member.socials.github && (
                <a href={member.socials.github} target="_blank" rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/35 hover:scale-110 transition-all shadow-lg backdrop-blur-md border border-white/10">
                  <Github size={18} />
                </a>
              )}
              {member.socials.email && (
                <a href={member.socials.email}
                  className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/35 hover:scale-110 transition-all shadow-lg backdrop-blur-md border border-white/10">
                  <Mail size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mb-3">
          <h3 className="font-sans text-xl font-semibold text-white mb-1 tracking-tight leading-tight">{member.name}</h3>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${style.dot}`} />
            <p className={`font-sans text-xs font-bold uppercase tracking-[0.15em] ${style.text}`}>{member.role}</p>
          </div>
        </div>

        <p className="font-sans text-white/35 text-[11px] uppercase tracking-[0.12em] mb-3">{member.department}</p>
        <p className="font-sans text-white/65 text-sm leading-relaxed flex-1 italic">"{member.bio}"</p>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE ---
export default function TeamPage() {
  return (
    <>
      <StarStream />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        /* Outfit for body text — very modern, premium tech aesthetic */
        .font-sans { font-family: 'Outfit', sans-serif !important; }
        
        /* Dancing Script for the elegant cursive displays */
        .font-display { font-family: 'Dancing Script', cursive !important; }
        
        /* Smooth card transform */
        [style*="transformStyle"] { will-change: transform; }
      `}} />

      <main className="font-sans relative z-10 min-h-screen bg-transparent pt-28 pb-28 px-6 md:px-12">

        {/* ── Hero ── */}
        <MeetTheTeamHero />

        {/* ── Coordinators ── */}
        <section className="max-w-4xl mx-auto mb-24">
          <SectionHeading label="Coordinators" color="cyan" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coordinators.map((coord) => (
              <TiltCard key={coord.name} member={coord} isCoordinator />
            ))}
          </div>
        </section>

        {/* ── Core Team ── */}
        <section className="max-w-6xl mx-auto">
          <SectionHeading label="Core Team" color="violet" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {team.map((member) => (
              <TiltCard key={member.name} member={member} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}