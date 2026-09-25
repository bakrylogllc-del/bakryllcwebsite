import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Absolute app root — do NOT use process.cwd() (can inherit a wrong parent).
// ~/package.json + ~/pnpm-lock.yaml otherwise make Turbopack treat $HOME as the
// monorepo root, fail to resolve tailwindcss, and spawn a Node worker storm.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // Keep file tracing inside this app (same home-lockfile trap).
  outputFileTracingRoot: projectRoot,
  // Allow opening the site from LAN devices (phone / other PCs) during `next dev`.
  // Without this, Next blocks /_next/* JS so React/GSAP never hydrate and animations look stuck.
  allowedDevOrigins: [
    "192.168.1.96",
    "127.0.0.1",
    "localhost",
  ],
};

export default nextConfig;
