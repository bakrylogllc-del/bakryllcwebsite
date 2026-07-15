"use client";

/**
 * SECTION 6 — Featured Work
 * Brutalist Cases gallery (Bakry colors) with title at the top of the same page.
 * Desktop: ScrollTrigger pin advances projects (no snap).
 * Phone: no GSAP — tap list / swipe cards; normal page scroll.
 * See SECTIONS.md
 */

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   EDIT THIS ARRAY — one entry per project.
   name : shows in the right-hand list
   img  : preview image (replace with your own screenshot URL)
   url  : the live website this project should open when clicked
   ============================================================ */
const projects = [
  {
    name: "Valente",
    img: "https://placehold.co/800x800/111111/E6E2D6?text=VALENTE",
    url: "https://example.com/valente",
  },
  {
    name: "Bakry LLC",
    img: "https://placehold.co/800x800/111111/E6E2D6?text=BAKRY+LLC",
    url: "https://example.com/bakry",
  },
  {
    name: "Kayan",
    img: "https://placehold.co/800x800/111111/E6E2D6?text=KAYAN",
    url: "https://example.com/kayan",
  },
  {
    name: "Gateway Intl",
    img: "https://placehold.co/800x800/111111/E6E2D6?text=GATEWAY",
    url: "https://example.com/gateway",
  },
];

export function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const root = casesRef.current;
    if (!section || !root) return;

    const stackWrap = root.querySelector<HTMLElement>("#stackWrap");
    const listWrap = root.querySelector<HTMLElement>("#listWrap");
    if (!stackWrap || !listWrap) return;

    stackWrap.innerHTML = "";
    listWrap.innerHTML = "";

    let activeIndex = 0;
    const mq = window.matchMedia("(max-width: 760px)");

    projects.forEach((p, i) => {
      const a = document.createElement("a");
      a.className = "card";
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.dataset.index = String(i);
      a.innerHTML = `
        <span class="tag">${String(i + 1).padStart(2, "0")}</span>
        <img src="${p.img}" alt="${p.name}">
        <span class="visit">Visit site →</span>
      `;
      stackWrap.appendChild(a);
    });

    projects.forEach((p, i) => {
      const item = document.createElement("div");
      item.className = "list-item";
      item.dataset.index = String(i);
      item.innerHTML = `
        <span class="idx">${String(i + 1).padStart(2, "0")}</span>
        <span class="name">${p.name}</span>
        <span class="arrow">→</span>
      `;
      listWrap.appendChild(item);
    });

    const cards = [...stackWrap.querySelectorAll<HTMLElement>(".card")];
    const items = [...listWrap.querySelectorAll<HTMLElement>(".list-item")];

    function render() {
      cards.forEach((card, i) => {
        card.classList.remove("active", "behind-1", "behind-2", "hidden-far");
        const offset = i - activeIndex;
        if (offset === 0) card.classList.add("active");
        else if (offset === -1) card.classList.add("behind-1");
        else if (offset === 1) card.classList.add("behind-2");
        else card.classList.add("hidden-far");
      });
      items.forEach((item, i) => {
        item.classList.toggle("active", i === activeIndex);
      });
    }

    function setActive(i: number) {
      activeIndex = Math.max(0, Math.min(projects.length - 1, i));
      render();
    }

    const onEnter = (e: Event) => {
      if (mq.matches) return;
      const el = e.currentTarget as HTMLElement;
      setActive(parseInt(el.dataset.index || "0", 10));
    };
    const onListClick = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const i = parseInt(el.dataset.index || "0", 10);
      if (mq.matches) {
        // Phone: tap selects project (visit via the card link)
        setActive(i);
        return;
      }
      window.open(projects[i].url, "_blank", "noopener");
    };

    items.forEach((item) => {
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("click", onListClick);
    });

    // Phone: swipe cards to change project — no scroll lock
    let touchX = 0;
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!mq.matches) return;
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      setActive(activeIndex + (dx < 0 ? 1 : -1));
    };
    stackWrap.addEventListener("touchstart", onTouchStart, { passive: true });
    stackWrap.addEventListener("touchend", onTouchEnd, { passive: true });

    render();

    const steps = Math.max(1, projects.length - 1);
    let st: ScrollTrigger | null = null;
    let refreshTimer = 0;

    const killPin = () => {
      if (st) {
        st.kill();
        st = null;
      }
    };

    const setupPin = () => {
      killPin();
      // Phone: no GSAP scroll — list tap / swipe only
      if (mq.matches) {
        ScrollTrigger.refresh();
        return;
      }

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 0.55 * steps)}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        anticipatePin: 0,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(
            steps,
            Math.max(0, Math.round(self.progress * steps)),
          );
          if (idx !== activeIndex) setActive(idx);
        },
      });
    };

    setupPin();

    const onMqChange = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        setupPin();
        ScrollTrigger.refresh();
      }, 50);
    };
    mq.addEventListener("change", onMqChange);

    const tRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(tRefresh);
      mq.removeEventListener("change", onMqChange);
      stackWrap.removeEventListener("touchstart", onTouchStart);
      stackWrap.removeEventListener("touchend", onTouchEnd);
      items.forEach((item) => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("click", onListClick);
      });
      killPin();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="featured-work-section relative w-full overflow-x-hidden bg-transparent"
      id="featured-work"
    >
      <style>{`
        /* Cases brutalist — Bakry colors only */
        .fw-cases {
          --bg: #E6E2D6;
          --ink: #111111;
          --accent: #C6B28A;
          --muted: #2A2A2A;
          --card-border: 3px;
          --font-display: 'Archivo Black', Arial, sans-serif;
          --font-mono: 'Space Mono', 'Courier New', monospace;

          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 560px;
          color: var(--ink);
          font-family: var(--font-mono);
          overflow: hidden;
          background-color: transparent;
          display: flex;
          flex-direction: column;
        }
        .fw-cases::before {
          display: none;
        }

        .fw-cases .fw-cases-title {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          padding: 28px 32px 0;
          box-sizing: border-box;
        }
        .fw-cases .fw-cases-title h2 {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(28px, 5.5vw, 56px);
          line-height: 0.95;
          letter-spacing: -1px;
          text-transform: uppercase;
          color: var(--ink);
        }

        .fw-cases main.fw-cases-main {
          position: relative;
          z-index: 1;
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 1fr 340px;
          align-items: center;
          padding: 24px 32px 40px;
          gap: 24px;
          box-sizing: border-box;
        }

        .fw-cases .stack-wrap {
          position: relative;
          height: min(480px, 62vh);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fw-cases .card {
          position: absolute;
          width: min(420px, 90%);
          height: min(420px, 60vh);
          border: var(--card-border) solid var(--ink);
          background: var(--ink);
          box-shadow: 10px 10px 0 var(--ink);
          overflow: hidden;
          text-decoration: none;
          display: block;
          opacity: 0;
          transform: translateY(60px) scale(0.92) rotate(0deg);
          transition:
            transform .38s cubic-bezier(.16,1,.3,1),
            opacity .3s ease,
            box-shadow .25s ease;
          pointer-events: none;
          z-index: 1;
        }

        .fw-cases .card img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(35%) contrast(1.05);
          transition: filter .25s ease, transform .5s ease;
        }

        .fw-cases .card .tag {
          position: absolute;
          top: 14px; left: 14px;
          background: var(--bg);
          border: 2px solid var(--ink);
          padding: 4px 10px;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 700;
        }

        .fw-cases .card .visit {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: var(--accent);
          color: #111111;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-align: center;
          padding: 12px 0;
          transform: translateY(100%);
          transition: transform .25s cubic-bezier(.16,1,.3,1);
        }

        .fw-cases .card.active {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(0deg);
          pointer-events: auto;
          z-index: 5;
        }
        .fw-cases .card.active:hover img { filter: grayscale(0%) contrast(1); transform: scale(1.04); }
        .fw-cases .card.active:hover .visit { transform: translateY(0); }

        .fw-cases .card.behind-1 {
          opacity: 0.9;
          transform: translateY(-46px) scale(0.94) rotate(-2deg);
          z-index: 4;
        }
        .fw-cases .card.behind-2 {
          opacity: 0.55;
          transform: translateY(44px) scale(0.9) rotate(2deg);
          z-index: 3;
        }
        .fw-cases .card.hidden-far {
          opacity: 0;
          transform: translateY(90px) scale(0.85) rotate(0deg);
          z-index: 1;
        }

        .fw-cases .list {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          border-left: var(--card-border) solid var(--ink);
          padding-left: 28px;
          height: min(480px, 62vh);
        }

        .fw-cases .list-item {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 12px 4px;
          cursor: pointer;
          border-bottom: 1px solid rgba(17, 17, 17, 0.12);
        }
        .fw-cases .list-item .idx {
          font-size: 11px;
          color: var(--muted);
          font-weight: 700;
          width: 22px;
        }
        .fw-cases .list-item .name {
          font-family: var(--font-display);
          font-size: clamp(18px, 2.4vw, 26px);
          text-transform: uppercase;
          letter-spacing: -0.5px;
          color: var(--muted);
          transition: color .15s ease, transform .15s ease;
        }
        .fw-cases .list-item.active .name {
          color: var(--ink);
          transform: translateX(6px);
        }
        .fw-cases .list-item.active .idx { color: var(--accent); }
        .fw-cases .list-item.active { border-color: var(--ink); }

        .fw-cases .list-item .arrow {
          margin-left: auto;
          font-size: 16px;
          color: var(--accent);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity .15s ease, transform .15s ease;
        }
        .fw-cases .list-item.active .arrow { opacity: 1; transform: translateX(0); }

        @media (max-width: 760px) {
          .fw-cases {
            height: auto;
            min-height: 0;
            max-height: none;
            overflow: visible;
            justify-content: flex-start;
            padding-top: max(20px, env(safe-area-inset-top));
            padding-bottom: max(32px, env(safe-area-inset-bottom));
            box-sizing: border-box;
          }

          .fw-cases .fw-cases-title {
            padding: 0 20px;
            text-align: center;
            margin-bottom: 8px;
            position: relative;
            z-index: 3;
          }
          .fw-cases .fw-cases-title h2 {
            font-size: clamp(26px, 8vw, 36px);
            letter-spacing: -0.5px;
            text-align: center;
          }

          .fw-cases main.fw-cases-main {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            align-items: center;
            justify-items: center;
            align-content: start;
            padding: 0 20px 8px;
            gap: 0;
            flex: none;
          }

          .fw-cases .stack-wrap {
            position: relative;
            z-index: 2;
            height: min(68vw, 250px);
            min-height: 190px;
            width: 100%;
            /* Room for stacked cards + gap before list */
            margin-top: 40px;
            margin-bottom: 40px;
            padding-top: 20px;
            overflow: visible;
          }

          .fw-cases .card {
            width: min(68vw, 250px, 100%);
            height: min(68vw, 250px);
            box-shadow: 6px 6px 0 var(--ink);
          }

          /* On phone: don't let back cards peek up into the title */
          .fw-cases .card.behind-1 {
            transform: translateY(18px) scale(0.94) rotate(-1deg);
            opacity: 0.75;
          }
          .fw-cases .card.behind-2 {
            transform: translateY(36px) scale(0.9) rotate(1deg);
            opacity: 0.45;
          }

          .fw-cases .card .tag {
            top: 10px;
            left: 10px;
            padding: 3px 8px;
            font-size: 9px;
          }

          /* Touch: always show visit on active card (no hover) */
          .fw-cases .card.active .visit {
            transform: translateY(0);
          }
          .fw-cases .card .visit {
            font-size: 10px;
            letter-spacing: 1.5px;
            padding: 10px 0;
          }

          .fw-cases .list {
            border-left: none;
            border-top: var(--card-border) solid var(--ink);
            width: 100%;
            margin-top: 0;
            margin-bottom: 8px;
            padding-left: 0;
            padding-top: 32px;
            height: auto;
            max-height: none;
            gap: 0;
            justify-content: flex-start;
            overflow: visible;
          }

          .fw-cases .list-item {
            gap: 8px;
            padding: 11px 2px;
            border-bottom: none;
          }
          .fw-cases .list-item.active {
            border-bottom: none;
          }
          .fw-cases .list-item .idx {
            font-size: 10px;
            width: 18px;
            flex-shrink: 0;
          }
          .fw-cases .list-item .name {
            font-size: clamp(14px, 4.2vw, 18px);
            letter-spacing: -0.3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .fw-cases .list-item.active .name {
            transform: translateX(3px);
          }
          .fw-cases .list-item .arrow {
            font-size: 14px;
            flex-shrink: 0;
          }
        }

        /* Very short phones / landscape phones */
        @media (max-width: 760px) and (max-height: 700px) {
          .fw-cases {
            padding-top: max(14px, env(safe-area-inset-top));
            padding-bottom: max(24px, env(safe-area-inset-bottom));
          }
          .fw-cases .fw-cases-title {
            margin-bottom: 6px;
          }
          .fw-cases .fw-cases-title h2 {
            font-size: clamp(22px, 7vw, 30px);
          }
          .fw-cases .stack-wrap {
            margin-top: 28px;
            margin-bottom: 32px;
            padding-top: 16px;
            height: min(52vw, 200px);
            min-height: 150px;
          }
          .fw-cases .card {
            width: min(52vw, 200px);
            height: min(52vw, 200px);
            box-shadow: 4px 4px 0 var(--ink);
          }
          .fw-cases .list {
            padding-top: 22px;
          }
          .fw-cases .list-item {
            padding: 7px 2px;
          }
          .fw-cases .list-item .name {
            font-size: clamp(12px, 3.6vw, 15px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fw-cases .card,
          .fw-cases .card .visit,
          .fw-cases .list-item .name { transition-duration: .01s !important; }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap"
      />

      <div ref={casesRef} className="fw-cases" aria-label="Selected cases">
        <header className="fw-cases-title">
          <h2>Featured Work</h2>
        </header>
        <main className="fw-cases-main">
          <div className="stack-wrap" id="stackWrap" />
          <div className="list" id="listWrap" />
        </main>
      </div>
    </section>
  );
}

export default FeaturedWorkSection;
