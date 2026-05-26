# E-Cell IISER Bhopal | Official Website

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

The official digital storefront for the Entrepreneurship Cell at IISER Bhopal. Built to be fast, highly interactive, and visually striking, this platform serves as the central hub for student founders, startups, and campus initiatives.

## ✨ Features

* **Modern Design System:** Dark-mode first aesthetic featuring glassmorphism (`backdrop-filter`), custom animated gradient orbs, and neon UI accents.
* **Pitch Portal:** A multi-step, animated submission form for startup ideas.
* **Bulletproof Validation:** Client and server-side form validation powered by `zod` and `react-hook-form`.
* **Server Actions:** Zero client-side API keys. Form submissions are handled securely on the server and routed to a hidden webhook.
* **Fluid Animations:** Complex scroll reveals, layout projections, and staggered element entrances orchestrated with Framer Motion.
* **Optimized Performance:** Next.js App Router architecture with statically generated pages and optimized Geist typography.

## 🛠 Tech Stack

* **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
* **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18.17 or higher) installed.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/ecell-iiser-bhopal.git
cd ecell-iiser-bhopal
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env.local` file in the root of the project. You will need to configure the webhook URL to enable the Pitch Portal functionality:

\`\`\`env
# Required for the Pitch Portal submission server action
WEBHOOK_URL="your_google_apps_script_or_zapier_webhook_url"
\`\`\`

### 4. Run the development server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the local build.

## 📁 Project Structure

* `/app`: Core Next.js App Router files (`layout.tsx`, `page.tsx`, `globals.css`).
* `/components/sections`: Major page blocks (`Hero.tsx`, `BentoGrid.tsx`, `PitchPortal.tsx`, `Footer.tsx`).
* `/components/ui`: Reusable, smaller components (e.g., `Navbar.tsx`).
* `/config`: Centralized site configuration and Zod schemas (`site.ts`, `pitch-schema.ts`).
* `/actions`: Next.js Server Actions for handling secure backend logic (`pitch.ts`).

## 🌐 Deployment

This project is optimized for deployment on the [Vercel Platform](https://vercel.com/). 

When deploying, ensure that your `WEBHOOK_URL` is added to the Vercel Project Environment Variables to guarantee the Pitch Portal functions in production.

---
*Built at IISER Bhopal.*
