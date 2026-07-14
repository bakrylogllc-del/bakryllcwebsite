"use client";

/**
 * SECTION 2 — Wire cards
 * Styles: inline <style> in this file
 * See SECTIONS.md
 *
 * MOBILE FIX PASS:
 * - .ws-inner + .ws-svg scale together using aspect-ratio (740:2100).
 * - Cards use flex/% of that same box so they shrink with the wire on phone
 *   (fixed 450px cards used to overflow and overjoin into Services).
 * - overflow: clip on .ws-root / .ws-inner keeps strokes from bleeding.
 * - START_OFFSET / WIRE_TRAVEL: nudge WIRE_TRAVEL by ±100–200 if the line end
 *   doesn't quite reach the last card.
 */

import React, { useLayoutEffect, useRef } from "react";

const cards = [
  {
    id: "web",
    label: "WEB",
    heading: "Clear product sites and web apps people actually use.",
    code: null,
  },
  {
    id: "mobile",
    label: "MOBILE",
    heading: null,
    code: ["app: {", "  iOS + Android,", "  Fast release cycles,", "  UX that sticks,", "}"],
  },
  {
    id: "saas",
    label: "SAAS",
    heading: null,
    code: ["product: {", "  Multi-tenant core,", "  Auth + billing,", "  Room to grow,", "}"],
  },
  {
    id: "automation",
    label: "AUTOMATION",
    heading: null,
    code: ["ops: {", "  Connected tools,", "  Repeatable workflows,", "  Fewer handoffs,", "}"],
  },
];

// Start at the very beginning of the dash pattern (top of first card),
// travel far enough to fully reveal the line through the last card.
const START_OFFSET = 0;
const WIRE_TRAVEL = -2110;

export function WireSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let rafId: number;
    let current = START_OFFSET;
    let target  = START_OFFSET;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onScroll = () => {
      const rect     = root.getBoundingClientRect();
      const total    = root.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      target = START_OFFSET + WIRE_TRAVEL * progress;
    };

    const tick = () => {
      current = lerp(current, target, 0.08);
      root.style.setProperty("--sdo", current.toFixed(2));
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@500;600&display=swap');

        .ws-root {
          --sdo: 0;
          background: #0b1230;
          position: relative;
          width: 100%;
          /* Clip X and Y so scaled wire/cards never bleed into Services */
          overflow: clip;
          isolation: isolate;
          z-index: 1;
          /* Clear gap before Services so the sections don't visually overjoin */
          padding-bottom: clamp(2.5rem, 8vh, 5.5rem);
        }

        /* Container + SVG share one aspect ratio (740:2100). Cards use % of this
           box so they shrink with the wire on phone instead of overflowing. */
        .ws-inner {
          position: relative;
          width: min(740px, 100%);
          aspect-ratio: 740 / 2100;
          margin: 0 auto;
          overflow: clip;
        }

        .ws-card-wrap {
          position: relative;
          width: 100%;
          /* Equal slices of the wire canvas — shrink with phone width */
          flex: 1 1 0;
          min-height: 0;
          border-radius: 20px;
          margin: 0;
        }

        /* glass bg — fully transparent */
        .ws-card-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: transparent;
          z-index: 0;
        }

        /* gradient border */
        .ws-card-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1.5px;
          background: linear-gradient(135deg, #24dbe7, #2f7cf6, #7a3af9);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: 1;
          pointer-events: none;
        }

        .ws-card {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          /* subtle glass layer to blur wires behind the card */
          background: rgba(11, 18, 48, 0.08);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(14px, 2.2vw, 28px) clamp(12px, 2vw, 24px) clamp(10px, 1.6vw, 20px);
        }

        /* subtle glow on hover only */
        .ws-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(36,219,231,0.18) 0%, transparent 70%);
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .ws-card-wrap:hover .ws-card::before { opacity: 1; }

        .ws-card-content {
          position: relative;
          z-index: 1;
          width: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ws-card-heading {
          font-family: "Source Code Pro", monospace;
          font-size: clamp(20px, 5vw, 28px);
          font-weight: 600;
          line-height: 1.3;
          text-align: center;
          background: linear-gradient(-45deg, #24dbe7 0%, #2f7cf6 40%, #7a3af9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: brightness(1.3);
          mix-blend-mode: plus-lighter;
          text-shadow: none;
        }

        .ws-card-code {
          font-family: "Source Code Pro", monospace;
          font-size: clamp(11px, 3vw, 13px);
          line-height: 22px;
          font-weight: 500;
          white-space: pre;
          text-align: left;
          width: 100%;
          background: linear-gradient(45deg, #24dbe7 0%, #2f7cf6 50%, #7a3af9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: brightness(1.4);
          mix-blend-mode: plus-lighter;
        }

        .ws-card-label {
          position: relative;
          z-index: 1;
          font-family: "Source Code Pro", monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(244,247,251,0.5);
          margin-top: 12px;
        }

        /* ── SVG wires ──────────────────────────────────── */
        /* Fills the same aspect-ratio box as .ws-inner exactly, so it's never
           bigger than the screen and never gets clipped on the sides. */
        .ws-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          /* Keep strokes inside the wire box — visible overflow was joining Services */
          overflow: hidden;
          pointer-events: none;
        }

        .ws-wire {
          fill: none;
          stroke-linecap: round;
          stroke-dashoffset: var(--sdo);
        }
        .ws-wire-1 {
          stroke-width: 20;
          stroke-dasharray: 20 50 120 50 20 50 300 50 20 50 150 50 20 20000;
        }
        .ws-wire-2 {
          stroke-width: 34;
          stroke-dasharray: 34 60 120 60 34 60 300 60 34 60 150 60 34 20000;
        }
        .ws-wire-3 {
          stroke-width: 25;
          stroke-dasharray: 25 40 120 40 25 40 250 40 25 40 150 40 25 20000;
        }
        .ws-wire-4 {
          stroke-width: 40;
          stroke-dasharray: 40 70 100 70 40 70 200 70 40 20000;
        }

        /* Cards sit in the same aspect box as the wire and scale with it. */
        .ws-cards {
          position: absolute;
          top: 4.76%; /* ~100 / 2100 */
          bottom: 2.4%;
          left: 50%;
          transform: translateX(-50%);
          width: min(300px, 86vw);
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: clamp(10px, 1.8%, 24px);
          pointer-events: none;
        }
        .ws-cards .ws-card-wrap { pointer-events: auto; }

        @media (max-width: 480px) {
          .ws-cards { top: 3.4%; width: min(280px, 84vw); gap: 8px; }
          .ws-card-heading { font-size: clamp(15px, 4.4vw, 22px); }
          .ws-card-code { font-size: clamp(10px, 2.8vw, 12px); line-height: 1.55; }
        }
      `}</style>

      <div ref={rootRef} className="ws-root" id="wire-section">
        <div className="ws-inner">

          {/* ── Cards ── */}
          <div className="ws-cards">
            {cards.map((c) => (
              <div key={c.id} className="ws-card-wrap">
                <div className="ws-card">
                  <div className="ws-card-content">
                    {c.heading ? (
                      <p className="ws-card-heading">{c.heading}</p>
                    ) : (
                      <pre className="ws-card-code">{c.code!.join("\n")}</pre>
                    )}
                  </div>
                  <span className="ws-card-label">{c.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── SVG wire paths ── */}
          {/* viewBox shifted up by 75 units to bake in the old CSS "top: 75px"
              offset, so it scales with the box instead of drifting on mobile. */}
          <svg
            className="ws-svg"
            viewBox="0 -75 740 2100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="ws-grad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%"   stopColor="#24dbe7" />
                <stop offset="50%"  stopColor="#2f7cf6" />
                <stop offset="100%" stopColor="#7a3af9" />
              </linearGradient>
            </defs>

            <path className="ws-wire ws-wire-1" stroke="url(#ws-grad)"
              d="m 106,45h 375c 114,0 226,128 226,235v 236c 0,136 -122,222 -224,221l -182,-2c -89,1 -141,42 -142,158l -2,204c -1,117 37,173 134,173h 186c 110,-3 230,111 230,220v 242c 0,113 -125,225 -248,225H 105" />
            <path className="ws-wire ws-wire-2" stroke="url(#ws-grad)"
              d="m 33,85h 444c 96,0 190,107 190,201v 224c 0,116 -98,188 -190,187l -192,-2c -92,0 -166,75 -166,168v 278c 0,94 74,169 166,169h 194c 92,0 188,94 188,188v 228c 0,94 -104,191 -214,191H 105" />
            <path className="ws-wire ws-wire-3" stroke="url(#ws-grad)"
              d="m 155,127h 308c 94,0 162,86 162,177v 178c 0,109 -50,174 -166,173L 277,653C 158,653 77,762 77,849v 302c 0,118 107,196 180,197l 204,4c 92,0 164,67 164,160v 200c 0,91 -89,163 -188,163H 105" />
            <path className="ws-wire ws-wire-4" stroke="url(#ws-grad)"
              d="m 283,173c 2,0 165,0 165,0C 544,175 577,238 577,330v 156c 0,94 -48,126 -140,125L 269,609C 167,602 29,702 29,851v 312c 0,111 101,235 242,235h 162c 109,1 144,49 144,136v 162c 0,73 -53,130 -118,130l -353,1" />
          </svg>

        </div>
      </div>
    </>
  );
}

export default WireSection;