"use client";

/**
 * SECTION 5 — Text reveal
 * Styles: inline <style> in this file (original big fill-reveal look)
 * Copy: full sentences / true statements — more lines than before
 * See SECTIONS.md
 */

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  "WE BUILD SOFTWARE",
  "PEOPLE ACTUALLY USE",
  "WEB THAT CONVERTS",
  "MOBILE THAT STICKS",
  "SAAS BUILT TO GROW",
  "AUTOMATION THAT FREES",
  "DESIGN BEFORE CODE",
  "SHIP CLEAN ON TIME",
  "FROM BRIEF TO RELEASE",
  "FROM RELEASE TO SCALE",
  "NO FLUFF — REAL WORK",
  "BAKRY LLC",
];

export function TextRevealSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const lineEls = root.querySelectorAll<HTMLElement>(".trs-line");
      const isNarrow = window.matchMedia("(max-width: 900px)").matches;

      lineEls.forEach((line) => {
        const fill = line.querySelector<HTMLElement>(".trs-fill");
        if (!fill) return;

        gsap.set(fill, { clipPath: "inset(0 100% 0 0)" });

        ScrollTrigger.create({
          trigger: line,
          start: isNarrow ? "top 92%" : "top 90%",
          // Longer travel on phone/tablet so each line fully fills before leaving
          end: isNarrow ? "top 18%" : "top 35%",
          scrub: isNarrow ? 0.4 : 1.2,
          onUpdate: (self) => {
            const remain = Math.max(0, Math.min(100, (1 - self.progress) * 100));
            gsap.set(fill, { clipPath: `inset(0 ${remain}% 0 0)` });
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .trs-root {
          width: 100%;
          background: #E6E2D6;
          padding: 14vh 6% 18vh;
          box-sizing: border-box;
          position: relative;
          overflow: visible;
        }

        .trs-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 140px;
          background: linear-gradient(to bottom, #E6E2D6, transparent);
          pointer-events: none; z-index: 2;
        }
        .trs-root::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 140px;
          background: linear-gradient(to top, #E6E2D6, transparent);
          pointer-events: none; z-index: 2;
        }

        .trs-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .trs-line {
          font-size: clamp(1.6rem, 7vw, 6.5rem);
          font-family: var(--font-lexend-mega, 'Lexend Mega', 'Syncopate', sans-serif);
          font-weight: 700;
          letter-spacing: -0.015em;
          line-height: 1.05;
          margin: 0;
          width: 100%;
          padding: 0.28em 0;
          border-bottom: 1px solid rgba(198, 178, 138, 0.12);
          position: relative;
          display: block;
          cursor: default;
          overflow: visible;
        }

        .trs-line:first-child {
          border-top: 1px solid rgba(198, 178, 138, 0.12);
        }

        .trs-ghost {
          color: rgba(17, 17, 17, 0.14);
          position: relative;
          z-index: 1;
          pointer-events: none;
          display: block;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .trs-fill {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          pointer-events: none;
          display: block;
          overflow: hidden;
          clip-path: inset(0 100% 0 0);
          padding: 0.28em 0;
          box-sizing: border-box;
        }

        .trs-fill-text {
          font-size: clamp(1.6rem, 7vw, 6.5rem);
          font-family: var(--font-lexend-mega, 'Lexend Mega', 'Syncopate', sans-serif);
          font-weight: 700;
          letter-spacing: -0.015em;
          line-height: 1.05;
          color: #111111;
          display: block;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .trs-line:last-child .trs-fill-text {
          background: linear-gradient(to right, #C6B28A, #55624A, #2A2A2A);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 900px) {
          .trs-root {
            padding: 10vh 5% 12vh;
          }
          .trs-root::before,
          .trs-root::after {
            height: 56px;
          }
          .trs-line {
            font-size: clamp(1.85rem, 8.2vw, 3.4rem);
            padding: 0.34em 0;
            letter-spacing: -0.02em;
          }
          .trs-fill {
            padding: 0.34em 0;
          }
          .trs-fill-text {
            font-size: clamp(1.85rem, 8.2vw, 3.4rem);
            letter-spacing: -0.02em;
          }
        }

        @media (max-width: 480px) {
          .trs-root { padding: 8vh 4.5% 10vh; }
          .trs-line,
          .trs-fill-text {
            font-size: clamp(1.7rem, 9.2vw, 2.55rem);
            letter-spacing: -0.03em;
            line-height: 1.08;
          }
        }
      `}</style>

      <section ref={rootRef} className="trs-root" id="text-reveal">
        <div className="trs-container">
          {lines.map((text) => (
            <h2 key={text} className="trs-line">
              <span className="trs-ghost">{text}</span>
              <span className="trs-fill" aria-hidden>
                <span className="trs-fill-text">{text}</span>
              </span>
            </h2>
          ))}
        </div>
      </section>
    </>
  );
}

export default TextRevealSection;
