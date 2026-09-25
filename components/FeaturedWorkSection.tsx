"use client";

/**
 * SECTION 6 — Featured Work
 * Webflow-style stacking sticky cards (ideas/Stacking cards animation.html)
 * Full-bleed screenshot + glass detail strip. Click opens live site.
 */

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   EDIT THIS ARRAY — one entry per project.
   img : "/featured/your-file.webp"
   url : live site (required for click-through)
   ============================================================ */
const projects = [
  {
    name: "Seven Degree",
    label: "Restaurant Operating System",
    body: "All-in-one operations platform with a low-latency POS, live KDS order routing, and multi-branch sales reporting.",
    img: "/featured/seven-degree.webp",
    url: "https://sevendegree.com",
    objectPosition: "center top",
  },
  {
    name: "Gherpado",
    label: "Luxury Fashion & Admin",
    body: "End-to-end luxury storefront with role-based auth, dynamic inventory models, and a real-time catalog admin.",
    img: "/featured/gherpado.webp",
    url: "https://gherpado.com",
    objectPosition: "center center",
  },
  {
    name: "Alpha Armor",
    label: "Activewear Storefront",
    body: "High-impact gymwear platform focused on conversion, visual product layouts, and fast asset delivery.",
    img: "/featured/alpha-armor.webp",
    url: "https://alphaarmorr.com",
    objectPosition: "center center",
  },
  {
    name: "3DK LLC",
    label: "Logistics & Transportation",
    body: "Corporate lead-generation site for a freight logistics firm — service listings and automated quote inquiry.",
    img: "/featured/3dk.webp",
    url: "https://3dkllc.com",
    objectPosition: "center center",
  },
];

const MIN_SCALE = 0.8;

export function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(
      wrapper.querySelectorAll<HTMLElement>(".fw-namma-card"),
    );
    if (cards.length < 2) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        transformOrigin: "50% 0%",
        force3D: true,
        scale: 1,
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const n = cards.length;

          cards.forEach((card, i) => {
            if (i === n - 1) {
              gsap.set(card, { scale: 1 });
              return;
            }

            const start = i / n;
            const end = (i + 1) / n;
            let scale = 1;
            if (p >= end) scale = MIN_SCALE;
            else if (p > start) {
              const t = (p - start) / (end - start);
              scale = 1 - t * (1 - MIN_SCALE);
            }
            gsap.set(card, { scale });
          });
        },
      });
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured-work"
      className="fw-namma relative w-full bg-transparent"
      aria-label="Featured work"
    >
      <style>{`
        .fw-namma {
          position: relative;
          padding: 6rem 5vw 4rem;
          color: #111111;
          font-family: var(--font-lexend-mega, "Lexend Mega"), system-ui, sans-serif;
        }

        .fw-namma__heading {
          max-width: 64rem;
          margin: 0 auto 4rem;
          font-size: clamp(2.2rem, 6vw, 4.5rem);
          line-height: 0.95;
          font-weight: 700;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #111111;
        }

        .fw-namma__wrapper {
          max-width: 64rem;
          margin: 0 auto 14rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }

        .fw-namma-card {
          width: 100%;
          min-height: min(35rem, 78vh);
          border-radius: 1rem;
          display: block;
          position: sticky;
          top: max(5.5rem, 10%);
          overflow: hidden;
          background: #111111;
          color: #E6E2D6;
          border: 2px solid rgba(17, 17, 17, 0.1);
          box-shadow: 0 18px 50px rgba(17, 17, 17, 0.14);
          will-change: transform;
          text-decoration: none;
          box-sizing: border-box;
        }

        .fw-namma-card__media {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .fw-namma-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1);
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .fw-namma-card:hover .fw-namma-card__media img,
        .fw-namma-card:focus-visible .fw-namma-card__media img {
          transform: scale(1.04);
        }

        .fw-namma-card__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(17, 17, 17, 0.88) 0%,
            rgba(17, 17, 17, 0.55) 38%,
            rgba(17, 17, 17, 0.12) 62%,
            rgba(17, 17, 17, 0) 100%
          );
          pointer-events: none;
        }

        .fw-namma-card__panel {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 1.75rem 1.75rem 1.5rem;
          background: rgba(17, 17, 17, 0.42);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid rgba(230, 226, 214, 0.14);
          box-sizing: border-box;
          transition: background 0.35s ease;
        }

        .fw-namma-card:hover .fw-namma-card__panel,
        .fw-namma-card:focus-visible .fw-namma-card__panel {
          background: rgba(17, 17, 17, 0.58);
        }

        .fw-namma-card__meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .fw-namma-card__number-circle {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 999px;
          background: #E6E2D6;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .fw-namma-card__number {
          font-size: 0.75rem;
          font-weight: 800;
          line-height: 1;
        }

        .fw-namma-card__label {
          margin: 0;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
          opacity: 0.7;
          font-family: var(--font-geist-sans, system-ui, sans-serif);
        }

        .fw-namma-card__title {
          margin: 0;
          font-size: clamp(1.45rem, 3vw, 2.15rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          font-weight: 700;
          color: #E6E2D6;
        }

        .fw-namma-card__body {
          margin: 0;
          max-width: 54ch;
          font-size: clamp(0.9rem, 1.15vw, 1.02rem);
          line-height: 1.5;
          opacity: 0.88;
          font-family: var(--font-geist-sans, system-ui, sans-serif);
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
          color: #E6E2D6;
        }

        .fw-namma-card__cta {
          margin-top: 0.25rem;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
          opacity: 0.8;
          color: #C6B28A;
        }

        @media (max-width: 991px) {
          .fw-namma {
            padding: 4.5rem 5vw 3rem;
          }
          .fw-namma-card {
            min-height: min(28rem, 72vh);
          }
          .fw-namma-card__panel {
            padding: 1.35rem 1.25rem 1.25rem;
            gap: 0.5rem;
          }
        }

        @media (max-width: 479px) {
          .fw-namma-card {
            min-height: min(24rem, 70vh);
            top: max(4.5rem, 8%);
          }
          .fw-namma-card__number-circle {
            width: 1.5rem;
            height: 1.5rem;
          }
          .fw-namma-card__number {
            font-size: 0.7rem;
          }
          .fw-namma-card__body {
            font-size: 0.88rem;
          }
          .fw-namma__wrapper {
            margin-bottom: 8rem;
            gap: 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fw-namma-card {
            transform: none !important;
          }
          .fw-namma-card__media img {
            transition: none;
          }
        }
      `}</style>

      <h2 className="fw-namma__heading">Featured Work</h2>

      <div ref={wrapperRef} className="fw-namma__wrapper">
        {projects.map((p, i) => (
          <a
            key={p.name}
            className="fw-namma-card"
            style={{ zIndex: i + 1 }}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.name} — open live site`}
          >
            <div className="fw-namma-card__media">
              <img
                src={p.img}
                alt=""
                loading="lazy"
                style={{ objectPosition: p.objectPosition }}
              />
              <div className="fw-namma-card__scrim" aria-hidden />
            </div>

            <div className="fw-namma-card__panel">
              <div className="fw-namma-card__meta">
                <div className="fw-namma-card__number-circle">
                  <span className="fw-namma-card__number">{i + 1}</span>
                </div>
                <p className="fw-namma-card__label">{p.label}</p>
              </div>
              <h3 className="fw-namma-card__title">{p.name}</h3>
              <p className="fw-namma-card__body">{p.body}</p>
              <span className="fw-namma-card__cta">Visit site →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default FeaturedWorkSection;
