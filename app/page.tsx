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
 * SECTION 6 — Featured:     components/FeaturedWorkSection.tsx  (CSS → globals + inline)
 * SECTION 7 — Contact+form: components/ContactSection.tsx  (CSS inline)
 * SECTION 8 — Footer:       components/SiteFooter.tsx
 */

import { useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Header } from "@/components/Header";
import { CyberGridBackground } from "@/components/CyberGridBackground";
import { WireSection } from "@/components/WireSection";
import { ServicesSection } from "@/components/ServicesSection";
import { HyperScrollSection } from "@/components/HyperScrollSection";
import { TextRevealSection } from "@/components/TextRevealSection";
import { FeaturedWorkSection } from "@/components/FeaturedWorkSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  const controls = useAnimation();
  const taglineControls = useAnimation();
  const [servicesMode, setServicesMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 800));
      if (cancelled) return;
      await controls.start({
        y: -50,
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
      });
      if (cancelled) return;
      await taglineControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [controls, taglineControls]);

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

  return (
    <main className="relative w-full max-w-[100vw] overflow-x-hidden bg-[#0b1230]">
      <Header servicesMode={servicesMode} />

      {/* ═══════════════════════════════════════════
          SECTION 1 — Hero (BAKRY LLC)
          files: app/page.tsx · CyberGridBackground.tsx · ui/text-hover-effect.tsx
      ═══════════════════════════════════════════ */}
      <section className="relative flex min-h-[100svh] w-full flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <CyberGridBackground />
        </div>
        <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-center px-4 pb-8 pt-24 sm:px-6 md:pt-28">
          <motion.div
            animate={controls}
            initial={{ y: 0 }}
            className={`flex w-full flex-col items-center justify-center transition-opacity duration-500 ${
              servicesMode ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="h-[min(45vw,200px)] w-full min-h-[160px] max-w-5xl sm:h-[220px] md:h-[280px] lg:h-[300px]">
              <TextHoverEffect text="BAKRY LLC" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={taglineControls}
              className="mt-4 flex flex-col items-center gap-2"
            >
              <p className="max-w-xl text-center text-[10px] tracking-[0.16em] text-white/70 uppercase sm:text-sm sm:tracking-[0.2em] md:text-base">
                Web • Mobile • SaaS • Automation
              </p>
              <p className="text-center text-[9px] tracking-[0.22em] text-cyan uppercase sm:text-xs sm:tracking-[0.28em] md:text-sm">
                Design. Develop. Scale.
              </p>
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

      {/* ═══════════════════════════════════════════
          SECTION 6 — Featured Work
          file: components/FeaturedWorkSection.tsx
          styles: inline + app/globals.css (.featured-work-section)
      ═══════════════════════════════════════════ */}
      <FeaturedWorkSection />

      {/* ═══════════════════════════════════════════
          SECTION 7 — Contact story + form + footer
          file: components/ContactSection.tsx  ·  styles: inline
          footer: components/SiteFooter.tsx
      ═══════════════════════════════════════════ */}
      <ContactSection />
    </main>
  );
}
