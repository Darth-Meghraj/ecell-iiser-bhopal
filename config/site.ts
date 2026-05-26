// config/site.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all static text, links, and configurable values.
// Update this file without touching any component code.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "E-Cell IISER Bhopal",
  shortName: "E-Cell",
  tagline: "Engineering the Future of Business at IISER Bhopal",
  description:
    "The Entrepreneurship Cell at IISER Bhopal — where scientific rigor meets the audacity to build. We're seeding the next generation of deep-tech founders.",
  url: "https://ecell.iiserbhopal.ac.in",
  ogImage: "/og.png",

  // ── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { label: "Vision", href: "#vision" },
    { label: "Pitch Portal", href: "#pitch" },
    { label: "Contact", href: "#contact" },
  ],

  // ── Hero Section ─────────────────────────────────────────────────────────
  hero: {
    badge: "Members who build stuff ",
    headline: ["Engineering the", "Future of Business", "at IISER Bhopal"],
    subheadline:
      "Where scientific rigor meets the audacity to build. E-Cell is the launchpad for student-led ventures, breakthrough ideas, and the next generation of deep-tech founders.",
    ctaPrimary: { label: "Pitch Your Idea", href: "#pitch" },
    ctaSecondary: { label: "Our Vision", href: "#vision" },
    stats: [
      { value: "∞", label: "Ideas Welcome" },
      { value: "01", label: "Founding Year" },
      { value: "100+", label: "Students Ready" },
      { value: "IISER", label: "World-Class Research" },
    ],
  },

  // ── Bento Grid / Pillars ─────────────────────────────────────────────────
  pillars: {
    sectionLabel: "What We're Building",
    headline: "Four Pillars of the Entrepreneurial Ecosystem",
    items: [
      {
        id: "incubation",
        icon: "Rocket",
        title: "Incubation Lab",
        description:
          "A dedicated physical and virtual space for student ventures. We'll provide mentorship, prototyping resources, and a structured program to take your idea from whiteboard to MVP.",
        accent: "cyan",
        size: "large", // spans 2 cols
        comingSoon: "Q3 2025",
      },
      {
        id: "hackathons",
        icon: "Zap",
        title: "Hackathons & Sprints",
        description:
          "48-hour intensive builds. Cross-disciplinary teams. Real problem statements from industry partners. The pressure-cooker that forges real founders.",
        accent: "violet",
        size: "small",
        comingSoon: "First Hackathon: Aug 2025",
      },
      {
        id: "mentorship",
        icon: "Users",
        title: "Mentorship Network",
        description:
          "Direct access to alumni founders, investors, and domain experts who have built and scaled companies. Office hours, not just inspiration.",
        accent: "green",
        size: "small",
        comingSoon: "Launching Soon",
      },
      {
        id: "alumni",
        icon: "Globe",
        title: "Alumni Network",
        description:
          "Tap into the global network of IISER alumni across top startups, research institutions, and venture capital firms. Your unfair advantage starts here.",
        accent: "amber",
        size: "medium",
        comingSoon: "Building Now",
      },
      {
        id: "funding",
        icon: "TrendingUp",
        title: "Seed Funding Access",
        description:
          "Partnerships with angel networks and early-stage funds aligned with deep-tech and science-driven ventures.",
        accent: "rose",
        size: "medium",
        comingSoon: "In Progress",
      },
    ],
  },

  // ── Pitch Portal Form ────────────────────────────────────────────────────
  pitchPortal: {
    sectionLabel: "Pitch Portal",
    headline: "Your Idea Deserves a Stage",
    subheadline:
      "Fill out the form below. Every submission is reviewed by our founding team. The best ideas will get a 1:1 session with our mentors.",
    successMessage:
      "Your pitch has been received. We'll review it and reach out within 5 business days. The future is being built — and you're part of it.",
    stages: [
      { value: "idea", label: "Just an Idea" },
      { value: "prototype", label: "Working Prototype" },
      { value: "mvp", label: "MVP / Early Traction" },
      { value: "revenue", label: "Revenue Stage" },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    tagline: "Building tomorrow's founders, today.",
    institution: "Indian Institute of Science Education and Research, Bhopal",
    address: "Bhauri, Bhopal Bypass Road, Bhopal - 462066, Madhya Pradesh",
    email: "ecell@iiserbhopal.ac.in",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/ecell-sdc-iiser-bhopal/", icon: "Linkedin" },
      { label: "Instagram", href: "https://www.instagram.com/ecell_iiserb?igsh=c2U2c3F4YTM5ejZs", icon: "Instagram" },
      { label: "Twitter / X", href: "#", icon: "Twitter" },
      { label: "GitHub", href: "#", icon: "Github" },
    ],
    copyright: `© ${new Date().getFullYear()} E-Cell IISER Bhopal. All rights reserved.`,
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
