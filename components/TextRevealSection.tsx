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
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      lineEls.forEach((line) => {
        const fill = line.querySelector<HTMLElement>(".trs-fill");
        if (!fill) return;

        gsap.set(fill, { width: "0%" });

        ScrollTrigger.create({
          trigger: line,
          start: "top 90%",
          end: "top 35%",
          scrub: isMobile ? 0.45 : 1.2,
          onUpdate: (self) => {
            gsap.set(fill, { width: `${self.progress * 100}%` });
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
          padding: 14vh 8% 18vh;
          box-sizing: border-box;
          position: relative;
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
        }

        .trs-line {
          font-size: clamp(1.6rem, 7vw, 6.5rem);
          font-family: var(--font-lexend-mega, 'Lexend Mega', 'Syncopate', sans-serif);
          font-weight: 700;
          letter-spacing: -0.015em;
          line-height: 1;
          margin: 0;
          width: 100%;
          padding: 0.22em 0;
          border-bottom: 1px solid rgba(198, 178, 138, 0.12);
          position: relative;
          display: flex;
          align-items: center;
          cursor: default;
          overflow: hidden;
        }

        .trs-line:first-child {
          border-top: 1px solid rgba(198, 178, 138, 0.12);
        }

        .trs-ghost {
          color: rgba(17, 17, 17, 0.14);
          position: relative;
          z-index: 1;
          pointer-events: none;
          white-space: nowrap;
        }

        .trs-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 0%;
          overflow: hidden;
          z-index: 2;
          pointer-events: none;
          display: flex;
          align-items: center;
          padding: 0.28em 0;
          box-sizing: border-box;
          white-space: nowrap;
        }

        .trs-fill-text {
          font-size: clamp(1.6rem, 7vw, 6.5rem);
          font-family: var(--font-lexend-mega, 'Lexend Mega', 'Syncopate', sans-serif);
          font-weight: 700;
          letter-spacing: -0.015em;
          line-height: 1;
          color: #111111;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .trs-line:last-child .trs-fill-text {
          background: linear-gradient(to right, #C6B28A, #55624A, #2A2A2A);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 768px) {
          .trs-root {
            padding: 8vh 4% 10vh;
          }
          .trs-root::before,
          .trs-root::after {
            height: 48px;
          }
          .trs-line {
            font-size: clamp(1.35rem, 9vw, 2.45rem);
            padding: 0.32em 0;
          }
          .trs-fill-text {
            font-size: clamp(1.35rem, 9vw, 2.45rem);
          }
          .trs-fill {
            padding: 0.32em 0;
          }
        }

        @media (max-width: 480px) {
          .trs-root { padding: 6vh 3.5% 8vh; }
          .trs-line,
          .trs-fill-text {
            font-size: clamp(1.2rem, 8.4vw, 2.1rem);
            letter-spacing: -0.025em;
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
