import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/devicons/devicon/**",
      },
    ],
  },

  // Required for Three.js / R3F in server components
  transpilePackages: ["three"],

  // Security: prevent exposing server-side module names
  serverExternalPackages: ["resend", "@vercel/blob"],
};

export default nextConfig;
