"use client";

/**
 * SECTION 7 — Contact (scroll story + form) + mounts SECTION 8 footer
 * Styles: inline <style> in this file
 * Footer: components/SiteFooter.tsx
 * See SECTIONS.md
 *
 * MOBILE FIX PASS:
 * - svh/dvh instead of vh so mobile browser chrome doesn't jump the layout
 * - decorative rings/crosses shrunk + repositioned so they never sit under the title text
 * - hero title now has a safe max-width + smaller min font so it can't overflow narrow screens
 * - pin distances ("+=38%" etc.) are shorter on mobile so pinned scroll doesn't feel stuck
 * - horizontal padding added around text blocks so nothing touches the screen edge
 * - .cp-section--works forces overflow hidden on mobile so scaled cards don't bleed into next section
 */

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { SiteFooter } from "@/components/SiteFooter";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CrossSVG = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // ── Custom cursor (desktop only) ───────────────────────────────────────────
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cursor = sectionRef.current?.querySelector<HTMLElement>(".cp-cursor");
    if (!cursor) return;
    if (!fine) {
      cursor.style.display = "none";
      return;
    }

    gsap.set(cursor, { force3D: true, x: -100, y: -100, opacity: 0 });

    const onMove = (e: MouseEvent) => {
      gsap.set(cursor, { opacity: 1 });
      gsap.to(cursor, { x: e.clientX - 16, y: e.clientY - 16, ease: "power3", overwrite: "auto" });
    };
    const onLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.1, ease: "none" });

    document.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseleave", onLeave);

    const hoverTargets = sectionRef.current?.querySelectorAll<HTMLElement>('[data-cursor="hover"]');
    hoverTargets?.forEach((el) => {
      el.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 2.5 }));
      el.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 1 }));
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── GSAP ScrollTrigger ─────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const isNarrow = window.matchMedia("(max-width: 900px)").matches;

      // Mobile gets shorter pin distances + lighter scrub so pinned sections
      // don't feel "stuck" on a small screen with less scroll travel available.
      const scrub = isNarrow ? 0.4 : 0.65;
      const introEnd = isNarrow ? "+=22%" : "+=38%";
      const introCopyEnd = isNarrow ? "+=16%" : "+=28%";
      const worksEnd = isNarrow ? "+=45%" : "+=70%";
      const ctaEnd = isNarrow ? "+=60%" : "+=100%";

      // Hero circle — pin the section, animate the image (avoids element jump)
      gsap.fromTo(
        ".cp-hero__image",
        { scale: isNarrow ? 2.1 : 3.2, opacity: 0.35, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".cp-section--intro",
            start: "top top",
            end: introEnd,
            pin: true,
            scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.to(".cp-ring--right", {
        scale: isNarrow ? 2.5 : 4,
        ease: "none",
        transformOrigin: "center",
        scrollTrigger: {
          trigger: ".cp-section--intro",
          start: "top top",
          end: introEnd,
          scrub,
        },
      });

      gsap.to(".cp-ring--left", {
        scale: isNarrow ? 1.6 : 2.4,
        ease: "none",
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: ".cp-section--intro",
          start: "top top",
          end: introEnd,
          scrub,
        },
      });

      gsap.to(".cp-hero__title--1", {
        xPercent: isNarrow ? -14 : -28,
        ease: "none",
        scrollTrigger: {
          trigger: ".cp-section--intro",
          start: "top top",
          end: introEnd,
          scrub,
        },
      });

      gsap.to(".cp-hero__title--2", {
        xPercent: isNarrow ? 14 : 28,
        ease: "none",
        scrollTrigger: {
          trigger: ".cp-section--intro",
          start: "top top",
          end: introEnd,
          scrub,
        },
      });

      gsap.to(".cp-hero__copy", {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: ".cp-section--intro",
          start: "top top",
          end: introCopyEnd,
          scrub,
        },
      });

      gsap.to(".cp-cross-1", {
        rotate: 360,
        ease: "none",
        scrollTrigger: {
          trigger: ".cp-section--intro",
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      });

      gsap.to(".cp-cross-2", {
        rotate: 720,
        ease: "none",
        scrollTrigger: {
          trigger: ".cp-section--intro",
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      });

      // Text block — soft parallax, no pin
      gsap.fromTo(
        ".cp-box",
        { y: isNarrow ? 40 : 80, opacity: 0.55 },
        {
          y: isNarrow ? -20 : -40,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".cp-section--text",
            start: "top 85%",
            end: "bottom 15%",
            scrub,
          },
        }
      );

      gsap.fromTo(
        ".cp-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: ".cp-section--text",
            start: "top 70%",
            end: "center 40%",
            scrub,
          },
        }
      );

      // Cards fan — ONE pin + ONE timeline so they never desync / jump
      // PC: no parent scale + bottom-origin rotate (those two shift the stack’s
      // visual center and look like the controller “teleports”). Cards stay
      // absolute-centered; only left/right cards slide + tilt.
      const spread = isNarrow ? 90 : 220;
      const tilt = isNarrow ? 10 : 16;

      gsap.set(".cp-cards", {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center center",
        force3D: true,
        scale: 1,
      });
      gsap.set([".cp-card-1", ".cp-card-2", ".cp-card-3"], {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transformOrigin: "center center",
        force3D: true,
      });

      const cardsTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".cp-section--works",
          start: "top top",
          end: worksEnd,
          pin: true,
          scrub: isNarrow ? scrub : 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Fixed pin is more stable on desktop when neighboring sections also pin
          pinType: isNarrow ? "transform" : "fixed",
        },
      });

      if (isNarrow) {
        // Phone — keep the light parent zoom (user said phone feels good)
        cardsTl.fromTo(".cp-cards", { scale: 0.92 }, { scale: 1.08 }, 0);
      }

      cardsTl
        .fromTo(
          ".cp-card-1",
          { x: 0, rotate: 0, scale: 1 },
          { x: -spread, rotate: -tilt, scale: isNarrow ? 0.88 : 0.9 },
          0
        )
        .fromTo(
          ".cp-card-2",
          { x: 0, rotate: 0, scale: 1 },
          { x: 0, rotate: 0, scale: isNarrow ? 0.96 : 1 },
          0
        )
        .fromTo(
          ".cp-card-3",
          { x: 0, rotate: 0, scale: 1 },
          { x: spread, rotate: tilt, scale: isNarrow ? 0.88 : 0.9 },
          0
        )
        .to(".cp-cross-3", { rotate: 360, y: isNarrow ? 40 : 80 }, 0);

      // Footer big text — pin section, slide text smoothly, then release to site footer
      gsap.fromTo(
        ".cp-big",
        { x: isNarrow ? "6vw" : "12vw" },
        {
          x: isNarrow ? "-102vw" : "-105vw",
          ease: "none",
          scrollTrigger: {
            trigger: ".cp-section--cta",
            start: "top top",
            end: ctaEnd,
            pin: true,
            scrub: isNarrow ? 0.5 : 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cp-footer__link",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
      tl.from(".cp-footer__link", { opacity: 0, y: 48, duration: 0.9, ease: "power3.out" })
        .from(".cp-footer__copy", { opacity: 0, y: 40, duration: 0.85, ease: "power3.out" }, "-=0.55")
        .from(".cp-footer__button", { opacity: 0, y: 36, duration: 0.8, ease: "power3.out" }, "-=0.5");

      try {
        const titleOne = new SplitText(".cp-hero__title--1", { type: "words" });
        gsap.from(titleOne.words, {
          opacity: 0,
          duration: 1.1,
          y: 48,
          ease: "power3.out",
          stagger: { each: 0.1 },
        });

        const titleTwo = new SplitText(".cp-hero__title--2", { type: "words" });
        gsap.from(titleTwo.words, {
          opacity: 0,
          duration: 1.1,
          y: 48,
          delay: 0.15,
          ease: "power3.out",
          stagger: { each: 0.1 },
        });
      } catch {
        gsap.from(".cp-hero__title--1, .cp-hero__title--2", {
          opacity: 0,
          duration: 1,
          y: 32,
          ease: "power3.out",
          stagger: 0.12,
        });
      }

      gsap.from(".cp-hero__copy span", {
        opacity: 0,
        duration: 0.85,
        y: 24,
        delay: 0.35,
        ease: "power2.out",
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <style>{`
        /* ── Scoped to .cp-* ──────────────────────────────────────────────── */
        .cp-section {
          height: 72svh;
          min-height: 520px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .cp-section--intro {
          justify-content: center;
          height: 78svh;
          min-height: 620px;
          padding: 2rem 1.25rem;
          gap: 0.5rem;
        }
        .cp-section--text {
          justify-content: center;
          height: 48svh;
          min-height: 320px;
          padding: 0 1.25rem;
        }
        .cp-section--works {
          justify-content: center;
          overflow: hidden;
          height: 78svh;
          min-height: 520px;
          /* Anchor for absolutely centered card stack — stops flex reflow jumps */
        }
        .cp-section--works .cp-cards {
          position: absolute;
          left: 50%;
          top: 50%;
          /* translate applied by GSAP (xPercent/yPercent) so fan math stays stable */
        }
        .cp-section--cta {
          min-height: 100svh;
          height: 100svh;
          padding: 0;
          mix-blend-mode: difference;
          justify-content: center;
          align-items: center;
          gap: 0;
          overflow: hidden;
        }
        .cp-section--cta .cp-big {
          margin: 0;
        }
        /* Real site footer only appears after Contact pin releases */
        .cp-after-contact {
          position: relative;
          z-index: 2;
          background: #111111;
        }

        /* Titles */
        .cp-hero__title {
          letter-spacing: -0.0125em;
          font-weight: 900;
          font-size: clamp(2rem, 8vw, 110px);
          white-space: nowrap;
          text-transform: uppercase;
          line-height: 1;
          position: relative;
          z-index: 3;
          mix-blend-mode: difference;
          margin: 0;
          margin-top: 1.5rem;
          color: #fff;
          will-change: transform;
          max-width: 94vw;
          text-align: center;
        }
        .cp-hero__title--2 {
          color: #111111;
          -webkit-text-stroke: 1px white;
          margin-top: 0;
          margin-bottom: 0.75rem;
          mix-blend-mode: color-burn;
        }

        /* Copy */
        .cp-hero__copy {
          margin: 0;
          font-size: clamp(0.85rem, 1.85vw, 1.25rem);
          font-weight: 300;
          opacity: 0.75;
          overflow: hidden;
          color: #fff;
          text-align: center;
          position: relative;
          z-index: 3;
          padding: 0 1rem;
        }
        .cp-hero__copy span { display: inline-block; }

        /* Image */
        .cp-hero__image {
          width: min(280px, 58vw);
          height: min(280px, 58vw);
          border-radius: 50%;
          object-fit: cover;
          object-position: center 15%;
          will-change: transform;
          backface-visibility: hidden;
          position: relative;
          z-index: 1;
        }

        /* Rings — kept clear of the title/copy safe zone in the center */
        .cp-ring {
          border-radius: 50%;
          background-color: transparent;
          mix-blend-mode: difference;
          position: absolute;
          will-change: transform;
          pointer-events: none;
          z-index: 0;
        }
        .cp-ring--left {
          border: 50px solid #C6B28A;
          width: 300px;
          height: 300px;
          left: -200px;
          top: -200px;
        }
        .cp-ring--right {
          border: 25px solid white;
          right: -50px;
          bottom: 300px;
          width: 150px;
          height: 150px;
        }

        /* Crosses */
        .cp-cross-1 {
          width: 180px; height: 180px;
          left: 10%; bottom: 15%;
          position: absolute;
          mix-blend-mode: difference;
          color: white;
          pointer-events: none;
          z-index: 0;
        }
        .cp-cross-2 {
          width: 90px; height: 90px;
          right: 200px; top: 200px;
          position: absolute;
          mix-blend-mode: difference;
          color: white;
          pointer-events: none;
          z-index: 0;
        }
        .cp-cross-3 {
          width: 140px; height: 140px;
          position: absolute;
          left: 18vw; top: 12vh;
          mix-blend-mode: difference;
          color: white;
          will-change: transform;
          pointer-events: none;
          z-index: 0;
        }

        /* Text box */
        .cp-box {
          width: min(780px, 90vw);
          display: flex;
          align-items: flex-start;
          min-height: 160px;
          mix-blend-mode: difference;
          font-size: clamp(1.05rem, 2.4vw, 1.75rem);
          font-weight: 300;
          text-align: left;
          line-height: 1.5;
          color: white;
          position: relative;
          will-change: transform, opacity;
        }
        .cp-line {
          position: absolute;
          bottom: 1.5rem;
          left: 0;
          width: 40%;
          height: 3px;
          background-color: #C6B28A;
          transform-origin: left center;
        }

        /* Cards */
        .cp-cards {
          width: min(300px, 68vw);
          height: min(300px, 68vw);
          position: relative;
          flex-shrink: 0;
          transform-origin: center center;
          will-change: transform;
          backface-visibility: hidden;
        }
        .cp-card {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          background-color: transparent;
          will-change: transform;
          backface-visibility: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          transform-origin: center center;
        }
        .cp-card-1 {
          z-index: 1;
          background-color: #111111;
          background-image: url("/contact-card-1.png");
        }
        .cp-card-2 {
          z-index: 3;
          background-color: #55624A;
          background-image: url("/contact-card-2.png");
        }
        .cp-card-3 {
          z-index: 2;
          background-color: #55624A;
          background-image: url("/contact-card-3.png");
        }

        /* Big text */
        .cp-big {
          font-size: clamp(3.25rem, 22vw, 35vw);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          color: white;
          text-transform: uppercase;
          pointer-events: none;
          will-change: transform;
          white-space: nowrap;
          align-self: flex-start;
          max-width: 100%;
        }

        /* Footer */
        .cp-footer__button {
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 999px;
          background-color: white;
          color: #111111;
          font-family: inherit;
          border: 0;
          padding: 1em 3em;
          text-align: center;
          display: inline-block;
          font-weight: 900;
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          line-height: 1;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: color .25s ease, background-color .25s ease;
        }
        .cp-footer__button:hover {
          background: linear-gradient(90deg, #C6B28A, #55624A, #55624A);
          color: #fff;
        }
        .cp-footer__copy {
          font-size: clamp(1rem, 2.2vw, 1.5rem);
          max-width: 720px;
          line-height: 1.5;
          margin: 0 auto 1.5rem;
          text-align: center;
          mix-blend-mode: difference;
          color: white;
          padding: 0 1.25rem;
        }
        .cp-footer__link { mix-blend-mode: difference; }

        /* Custom cursor */
        .cp-cursor {
          border-radius: 50%;
          width: 32px; height: 32px;
          background-color: white;
          mix-blend-mode: difference;
          position: fixed;
          top: 0; left: 0;
          will-change: transform;
          pointer-events: none;
          z-index: 99999;
        }

        /* ── Mobile pass ─────────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .cp-cross-1 { left: -20px; width: 100px; height: 100px; bottom: 6%; }
          .cp-cross-2 { right: 12px; top: 90px; width: 70px; height: 70px; }
          .cp-cross-3 { left: 6vw; top: 6vh; width: 70px; height: 70px; }
          .cp-box { min-height: 180px; }
          .cp-ring--left { width: 140px; height: 140px; border-width: 22px; left: -90px; top: -90px; }
          .cp-ring--right { width: 80px; height: 80px; border-width: 14px; right: -24px; bottom: 60%; }
          .cp-hero__title { margin-top: 1rem; }
        }

        @media (max-width: 380px) {
          .cp-hero__title { font-size: clamp(1.6rem, 9vw, 2.4rem); }
          .cp-hero__image { width: 50vw; height: 50vw; }
        }
      `}</style>

      <div ref={sectionRef} id="contact" className="relative w-full overflow-x-clip bg-[#111111]">

        {/* Custom cursor */}
        <div className="cp-cursor" aria-hidden />

        {/* ── INTRO ─────────────────────────────────────────────────────────── */}
        <section className="cp-section cp-section--intro">
          <img
            className="cp-hero__image"
            src="/contact-hero.png"
            alt="Bakry LLC collaboration"
          />
          <CrossSVG className="cp-cross-1" />
          <CrossSVG className="cp-cross-2" />
          <div className="cp-ring cp-ring--left" />
          <div className="cp-ring cp-ring--right" />
          <h3 className="cp-hero__title cp-hero__title--1">GET IN TOUCH</h3>
          <h3 className="cp-hero__title cp-hero__title--2">BAKRY LLC</h3>
          <p className="cp-hero__copy">
            <span>Tell us what you want to ship</span>
          </p>
        </section>

        {/* ── TEXT ──────────────────────────────────────────────────────────── */}
        <section className="cp-section cp-section--text">
          <div className="cp-box">
            Whether it&apos;s a customer-facing site, a mobile product, a SaaS platform,
            or the automations that keep operations moving — we take it from concept to launch,
            then help it grow without the chaos.
            <div className="cp-line" />
          </div>
        </section>

        {/* ── WORKS / Cards ─────────────────────────────────────────────────── */}
        <section className="cp-section cp-section--works">
          <div className="cp-cards">
            <a href="#contact" className="cp-card cp-card-1" data-cursor="hover" aria-label="Project Planning" />
            <a href="#contact" className="cp-card cp-card-2" data-cursor="hover" aria-label="Product Design" />
            <a href="#contact" className="cp-card cp-card-3" data-cursor="hover" aria-label="Launch and Scale" />
          </div>
          <CrossSVG className="cp-cross-3" />
        </section>

        {/* ── CONTACT WORD (pinned until it finishes) ───────────────────────── */}
        <section className="cp-section cp-section--cta" aria-label="Contact">
          <div className="cp-big">Contact</div>
        </section>

        {/* CTA + site footer — only after Contact scroll ends */}
        <div className="cp-after-contact">
          <section className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <div className="cp-footer__link" style={{ mixBlendMode: "difference" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C6B28A"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <p className="cp-footer__copy mx-auto max-w-2xl text-white/85">
              Have a product in mind, or a process you want to stop doing by hand?
              Send a note — we&apos;ll help you figure out the right next step.
            </p>

            <a
              href="mailto:hello@bakryllc.com"
              className="cp-footer__button"
              data-cursor="hover"
            >
              Send us a message
            </a>
          </section>

          <SiteFooter />
        </div>

      </div>
    </>
  );
}

export default ContactSection;