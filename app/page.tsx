"use client";

/**
 * SECTION 1 — Hero
 * File: app/page.tsx (this file) + components/CyberGridBackground.tsx
 * Styles: Tailwind in this file; see SECTIONS.md for the full map
 *
 * SECTION 2 — Wire:         components/WireSection.tsx  (CSS inline)
 * SECTION 3 — Services:     components/ServicesSection.tsx  (CSS → app/globals.css)
 * SECTION 4 — HyperScroll:  components/HyperScrollSection.tsx  (CSS inline)
 * SECTION 5 — Text reveal: components/TextRevealSection.tsx  (CSS inline)
 * SECTION 6 — Featured title: components/FeaturedWorkSection.tsx (headline only)
 * SECTION 7 — Contact morph:  components/ContactMorphSection.tsx
 * SECTION 8 — Footer:       components/SiteFooter.tsx
 */

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { CyberGridBackground } from "@/components/CyberGridBackground";
import { WireSection } from "@/components/WireSection";
import { ServicesSection } from "@/components/ServicesSection";
import { HyperScrollSection } from "@/components/HyperScrollSection";
import { TextRevealSection } from "@/components/TextRevealSection";
import { FeaturedWorkSection } from "@/components/FeaturedWorkSection";
import { ContactMorphSection } from "@/components/ContactMorphSection";
import { SoftLightGrid } from "@/components/SoftLightGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteScrollProgress } from "@/components/SiteScrollProgress";
import { LoadingGate, type IntroMode } from "@/components/LoadingGate";
import { Header } from "@/components/Header";

type CineStep = 0 | 1 | 2 | 3;

export default function Home() {
  const [servicesMode, setServicesMode] = useState(false);
  const [intro, setIntro] = useState<{ ready: boolean; mode: IntroMode }>({
    ready: false,
    mode: "normal",
  });
  const [cineStep, setCineStep] = useState<CineStep>(0);

  const onLoaderReady = useCallback((mode: IntroMode) => {
    setIntro({ ready: true, mode });
  }, []);

  // Cinematic steps only after full loading screen
  useEffect(() => {
    if (!intro.ready) return;
    if (intro.mode !== "cinematic") {
      setCineStep(3);
      return;
    }

    setCineStep(0);
    const t1 = window.setTimeout(() => setCineStep(1), 40);
    const t2 = window.setTimeout(() => setCineStep(2), 1200);
    const t3 = window.setTimeout(() => setCineStep(3), 2300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [intro.ready, intro.mode]);

  useEffect(() => {
    const services = document.getElementById("services");
    if (!services) return;

    const update = () => {
      const triggerLine = window.innerHeight * 0.35;
      const top = services.getBoundingClientRect().top;
      setServicesMode(top <= triggerLine);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const brandHidden = !intro.ready || servicesMode;
  const brandAnimate = brandHidden
    ? { opacity: 0, y: intro.ready ? -42 : 28, scale: 1 }
    : intro.mode === "normal" || cineStep >= 2
      ? { opacity: 1, y: -42, scale: 1 }
      : cineStep >= 1
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 0, y: 36, scale: 0.94 };

  const taglineAnimate =
    intro.ready && !servicesMode && (intro.mode === "normal" || cineStep >= 3)
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 18 };

  return (
    <LoadingGate onReady={onLoaderReady}>
    <main className="relative w-full max-w-[100vw] overflow-x-clip bg-[#E6E2D6]">
      {/* Fixed progress: Wire → end of page (HUD-style bottom bar) */}
      <SiteScrollProgress />
      <Header />

      {/* ═══════════════════════════════════════════
          SECTION 1 — Hero (BAKRY LLC)
          files: app/page.tsx · CyberGridBackground.tsx · ui/text-hover-effect.tsx
      ═══════════════════════════════════════════ */}
      <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden select-none [&_*]:select-none">
        <div className="pointer-events-none absolute inset-0 z-0">
          <CyberGridBackground />
        </div>
        <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-8 sm:px-6">
          <motion.div
            initial={false}
            animate={brandAnimate}
            transition={
              intro.mode === "normal"
                ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                : { duration: 1.05, ease: [0.22, 1, 0.36, 1] }
            }
            className="flex w-full flex-col items-center justify-center"
          >
            <div className="h-[min(45vw,200px)] w-full min-h-[160px] max-w-5xl sm:h-[220px] md:h-[280px] lg:h-[300px]">
              <TextHoverEffect text="BAKRY LLC" />
            </div>
            <motion.div
              initial={false}
              animate={taglineAnimate}
              transition={
                intro.mode === "normal"
                  ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
              }
              className="mt-4 flex flex-col items-center gap-2"
            >
              <p className="max-w-xl text-center text-[10px] tracking-[0.16em] text-[#2A2A2A] uppercase sm:text-sm sm:tracking-[0.2em] md:text-base">
                Web • Mobile • SaaS • Automation
              </p>
              <p className="text-center text-[9px] tracking-[0.22em] text-[#55624A] uppercase sm:text-xs sm:tracking-[0.28em] md:text-sm">
                Design. Develop. Scale.
              </p>
              <span
                aria-hidden
                className="mt-1 h-1.5 w-1.5 rounded-sm bg-[#C6B28A]"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — Wire cards
          file: components/WireSection.tsx  ·  styles: inline <style> in that file
      ═══════════════════════════════════════════ */}
      <WireSection />

      {/* ═══════════════════════════════════════════
          SECTION 3 — Services (click opens overlay)
          file: components/ServicesSection.tsx
          styles: app/globals.css (.services-* / #services-*)
          open/close wipe timing: app/globals.css (#services-frame)
      ═══════════════════════════════════════════ */}
      <ServicesSection />

      {/* ═══════════════════════════════════════════
          SECTION 4 — HyperScroll 3D tunnel
          file: components/HyperScrollSection.tsx  ·  styles: inline
      ═══════════════════════════════════════════ */}
      <HyperScrollSection />

      {/* ═══════════════════════════════════════════
          SECTION 5 — Text reveal lines
          file: components/TextRevealSection.tsx  ·  styles: inline
      ═══════════════════════════════════════════ */}
      <TextRevealSection />

      {/* Soft Light band — one shared fixed grid behind Featured Work + Contact */}
      <div id="soft-light-band" className="soft-light-band relative">
        <style>{`
          .soft-light-band {
            --soft-cell-w: 12.5vw;
            --soft-cell-h: 12.5svh;
            --soft-grid-line: rgba(17, 17, 17, 0.1);
            --soft-grid-bg:
              linear-gradient(to right, var(--soft-grid-line) 1px, transparent 1px),
              linear-gradient(to bottom, var(--soft-grid-line) 1px, transparent 1px);
            background-color: #E6E2D6;
            background-image: var(--soft-grid-bg);
            background-size: var(--soft-cell-w) var(--soft-cell-h);
            background-position: 0 0;
            background-repeat: repeat;
            background-attachment: fixed;
          }

          @media (max-width: 760px) {
            /* Phone: one repeating grid on the band — no fixed, no overlay */
            .soft-light-band {
              background-attachment: scroll;
              background-repeat: repeat;
            }
          }
        `}</style>
        <SoftLightGrid />
        <FeaturedWorkSection />
        <ContactMorphSection />
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 8 — Site footer
          file: components/SiteFooter.tsx
      ═══════════════════════════════════════════ */}
      <SiteFooter />
    </main>
    </LoadingGate>
  );
}
