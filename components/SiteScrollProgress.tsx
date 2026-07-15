"use client";

/**
 * Full-width site timeline — thin line, markers at exact scroll positions.
 * Markers expand when the progress head reaches them.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type StopId = "top" | "featured-work" | "contact";

type Stop = {
  id: StopId;
  label: string;
  /** Fixed at 0 for page top; others computed from layout */
  fixedPct?: number;
};

const STOPS: Stop[] = [
  { id: "top", label: "Top", fixedPct: 0 },
  { id: "featured-work", label: "Ft Work" },
  { id: "contact", label: "Contact" },
];

function sectionScrollY(el: HTMLElement | null) {
  if (!el) return 0;
  return window.scrollY + el.getBoundingClientRect().top;
}

export function SiteScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const [positions, setPositions] = useState<Record<StopId, number>>({
    top: 0,
    "featured-work": 72,
    contact: 92,
  });

  const scrollToStop = useCallback((id: StopId) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const startEl = document.getElementById("wire-section");
      if (!startEl) return;

      const featuredEl = document.getElementById("featured-work");
      const contactEl = document.getElementById("contact");

      const startY = sectionScrollY(startEl);
      const maxY = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrolled = window.scrollY;
      const range = Math.max(1, maxY - startY);

      const toPct = (y: number) =>
        Math.max(0, Math.min(100, ((y - startY) / range) * 100));

      const progress = Math.max(0, Math.min(1, (scrolled - startY) / range));
      const progressPct = progress * 100;

      const footer =
        document.getElementById("site-footer") ||
        document.querySelector("footer");
      const footerVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight * 0.92
        : false;

      const atEnd = progress >= 0.985 || scrolled >= maxY - 8;
      const show =
        scrolled >= startY - window.innerHeight * 0.15 && !atEnd && !footerVisible;

      setVisible(show);
      setPct(Math.round(progressPct));

      setPositions({
        top: 0,
        "featured-work": toPct(sectionScrollY(featuredEl)),
        contact: toPct(sectionScrollY(contactEl)),
      });

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress})`;
      }
      if (headRef.current) {
        headRef.current.style.left = `${progressPct}%`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t1 = window.setTimeout(update, 400);
    const t2 = window.setTimeout(update, 1500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        .site-timeline {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99990;
          padding:
            2.25rem max(1.25rem, env(safe-area-inset-left))
            max(1.1rem, env(safe-area-inset-bottom))
            max(1.25rem, env(safe-area-inset-right));
          pointer-events: none;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .site-timeline.is-on {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .site-timeline__track {
          position: relative;
          height: 1px;
          background: rgba(17, 17, 17, 0.22);
          overflow: visible;
        }

        .site-timeline__fill {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          transform: scaleX(0);
          background: linear-gradient(90deg, #C6B28A 0%, #55624A 70%, #2A2A2A 100%);
          will-change: transform;
        }

        /* Progress head — small square riding the line */
        .site-timeline__head {
          position: absolute;
          top: 50%;
          left: 0%;
          width: 5px;
          height: 5px;
          margin: -2.5px 0 0 -2.5px;
          background: #C6B28A;
          border: 1px solid #111111;
          border-radius: 1px;
          box-shadow: 0 0 10px rgba(198, 178, 138, 0.5);
          pointer-events: none;
          z-index: 3;
          will-change: left;
        }

        .site-timeline__stop {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          /* Big hit box — easier to tap / click */
          min-width: 56px;
          min-height: 48px;
          padding: 18px 16px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
          -webkit-tap-highlight-color: transparent;
        }

        .site-timeline__stop-label {
          position: absolute;
          bottom: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%) translateY(4px) scale(0.94);
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: none;
          color: rgba(42, 42, 42, 0.5);
          white-space: nowrap;
          opacity: 0.75;
          transition:
            opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.3s ease;
          pointer-events: none;
        }

        .site-timeline__stop-dot {
          width: 7px;
          height: 7px;
          border-radius: 1px;
          border: 1px solid rgba(17, 17, 17, 0.35);
          background: #E6E2D6;
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            height 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .site-timeline__stop:hover .site-timeline__stop-dot {
          border-color: #55624A;
        }
        .site-timeline__stop:hover .site-timeline__stop-label {
          opacity: 1;
          color: #111111;
        }

        /* Progress reached this stop — expand + pop label */
        .site-timeline__stop.is-reached .site-timeline__stop-dot {
          width: 14px;
          height: 14px;
          background: #C6B28A;
          border-color: #111111;
          box-shadow:
            0 0 0 3px rgba(198, 178, 138, 0.35),
            0 0 14px rgba(198, 178, 138, 0.45);
          transform: scale(1);
        }
        .site-timeline__stop.is-reached .site-timeline__stop-label {
          opacity: 1;
          color: #111111;
          transform: translateX(-50%) translateY(0) scale(1);
        }

        html.services-overlay-open .site-timeline {
          opacity: 0;
          pointer-events: none;
        }

        @media (max-width: 520px) {
          .site-timeline {
            padding-bottom: max(0.85rem, env(safe-area-inset-bottom));
          }
          .site-timeline__stop {
            min-width: 64px;
            min-height: 52px;
            padding: 20px 18px 14px;
          }
          .site-timeline__stop-label {
            font-size: 11px;
            bottom: calc(100% + 2px);
          }
        }
      `}</style>

      <nav
        className={`site-timeline${visible ? " is-on" : ""}`}
        aria-label="Page timeline"
      >
        <div
          className="site-timeline__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Scroll progress"
        >
          <div ref={fillRef} className="site-timeline__fill" />
          <div ref={headRef} className="site-timeline__head" aria-hidden />

          {STOPS.map((stop) => {
            const pos =
              stop.fixedPct ?? positions[stop.id as StopId] ?? 0;
            const reached = pct >= pos - 0.5;

            return (
              <button
                key={stop.id}
                type="button"
                className={`site-timeline__stop${reached ? " is-reached" : ""}`}
                style={{ left: `${pos}%` }}
                onClick={() => scrollToStop(stop.id)}
                aria-label={`Go to ${stop.label}`}
              >
                <span className="site-timeline__stop-label">{stop.label}</span>
                <span className="site-timeline__stop-dot" />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
