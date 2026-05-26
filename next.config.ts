// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better dev-time warnings
  reactStrictMode: true,

  // Moved typedRoutes out of experimental (Vercel-recommended)
  typedRoutes: true,

  // Vercel image optimization: allow IISER domain if you pull images from there
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iiserbhopal.ac.in",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;