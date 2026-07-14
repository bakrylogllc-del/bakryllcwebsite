"use client";

/**
 * SECTION 5 — Text reveal (INTERFACES / PRODUCTS / …)
 * Styles: inline <style> in this file
 * See SECTIONS.md
 */

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { main: "INTERFACES",          hover: "PEOPLE TRUST"         },
  { main: "PRODUCTS",            hover: "TEAMS DEPEND ON"      },
  { main: "WORKFLOWS",           hover: "THAT RUN THEMSELVES"  },
  { main: "FROM FIRST SKETCH",   hover: "TO FIRST RELEASE"     },
  { main: "FROM FIRST RELEASE",  hover: "TO REAL SCALE"        },
  { main: "BUILT FAST",          hover: "BUILT TO LAST"        },
  { main: "BAKRY LLC",           hover: "LET'S BUILD"          },
];

export function TextRevealSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const lineEls = root.querySelectorAll<HTMLElement>(".trs-line");

      lineEls.forEach((line) => {
        const fill = line.querySelector<HTMLElement>(".trs-fill");
        if (!fill) return;

   
        gsap.set(fill, { width: "0%" });

        ScrollTrigger.create({
          trigger: line,
          start: "top 90%",
          end: "top 35%",
          scrub: window.matchMedia("(max-width: 768px)").matches ? 0.45 : 1.2,
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
          background: #0b1230;
          padding: 14vh 8% 18vh;
          box-sizing: border-box;
          position: relative;
        }

        .trs-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 140px;
          background: linear-gradient(to bottom, #0b1230, transparent);
          pointer-events: none; z-index: 2;
        }
        .trs-root::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 140px;
          background: linear-gradient(to top, #0b1230, transparent);
          pointer-events: none; z-index: 2;
        }

        .trs-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        /* ── Each line ── */
        .trs-line {
          /* ↓↓ CHANGE FONT SIZE HERE ↓↓ */
          font-size: 7vw;
          font-family: var(--font-lexend-mega, 'Lexend Mega', 'Syncopate', sans-serif);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1;
          margin: 0;
          width: 100%;
          padding: 0.18em 0;
          border-bottom: 1px solid rgba(36, 219, 231, 0.12);
          position: relative;
          display: flex;
          align-items: center;
          cursor: default;
          overflow: hidden;
        }

        .trs-line:first-child {
          border-top: 1px solid rgba(36, 219, 231, 0.12);
        }

        /* ghost text — always visible underneath */
        .trs-ghost {
          color: rgba(244, 247, 251, 0.12);
          position: relative;
          z-index: 1;
          pointer-events: none;
          white-space: nowrap;
        }

        /* fill layer — clips from left to right via width */
        .trs-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 0%;                /* controlled by GSAP */
          overflow: hidden;
          z-index: 2;
          pointer-events: none;
          display: flex;
          align-items: center;
          padding: 0.18em 0;
          box-sizing: border-box;
          white-space: nowrap;
        }

        .trs-fill-text {
          /* ↓↓ SAME FONT SIZE AS .trs-line ↓↓ */
          font-size: 7vw;
          font-family: var(--font-lexend-mega, 'Lexend Mega', 'Syncopate', sans-serif);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1;
          color: #f4f7fb;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Hover span — full line wipe from center ── */
        

        /* last line special color */
        .trs-line:last-child .trs-fill-text {
          background: linear-gradient(to right, #24dbe7, #2f7cf6, #7a3af9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        

        @media (max-width: 768px) {
          .trs-root {
            padding: 5vh 4% 5vh;
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
          .trs-root { padding: 4vh 3.5% 4vh; }
          .trs-line,
          .trs-fill-text {
            font-size: clamp(1.2rem, 8.4vw, 2.1rem);
            letter-spacing: -0.025em;
          }
        }
      `}</style>

      <section ref={rootRef} className="trs-root" id="text-reveal">
        <div className="trs-container">
          {lines.map((line, i) => (
            <h2 key={i} className="trs-line">
              {/* ghost — always visible faint */}
              <span className="trs-ghost">{line.main}</span>

              {/* fill — width animated by GSAP ScrollTrigger */}
              <span className="trs-fill">
                <span className="trs-fill-text">{line.main}</span>
              </span>

              {/* hover takeover */}
            </h2>
          ))}
        </div>
      </section>
    </>
  );
}

export default TextRevealSection;