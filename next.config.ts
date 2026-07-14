import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the site from LAN devices (phone / other PCs) during `next dev`.
  // Without this, Next blocks /_next/* JS so React/GSAP never hydrate and animations look stuck.
  allowedDevOrigins: [
    "192.168.1.96",
    "127.0.0.1",
    "localhost",
  ],
};

export default nextConfig;
