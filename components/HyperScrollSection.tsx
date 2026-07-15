"use client";

/**
 * SECTION 4 — HyperScroll 3D tunnel
 * Styles: inline <style> in this file
 * See SECTIONS.md
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Brand content ─────────────────────────────────────────────────────────────
const TEXTS = [
  "BAKRY", "BUILD", "SHIP", "GROW", "PRODUCT",
  "PLATFORM", "SYSTEM", "RELEASE", "ITERATE", "LAUNCH",
];

const CARDS = [
  { id: "WEB",         title: "Web",         tags: "Sites • Apps • Platforms",       stat: "Fast, clear, convertible" },
  { id: "MOBILE",      title: "Mobile",      tags: "iOS • Android • Cross-platform", stat: "Feels native, ships lean" },
  { id: "SAAS",        title: "SaaS",        tags: "Products • Billing • Tenancy",   stat: "Architecture that grows" },
  { id: "AUTOMATION",  title: "Automation",  tags: "Workflows • Integrations • Ops",stat: "Busywork, removed"       },
];

const CONFIG = {
  itemCount: 20,
  starCount: 120,
  zGap: 800,
  camSpeed: 2.5,
  /** Keep first title ahead of the camera so entry scroll doesn't skip it. */
  leadIn: 700,
};

// Total tunnel length — one full pass, no loop
const TUNNEL_LENGTH = CONFIG.itemCount * CONFIG.zGap;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Item {
  el: HTMLElement;
  type: "text" | "card" | "star";
  x: number;
  y: number;
  rot: number;
  baseZ: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function HyperScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const worldRef   = useRef<HTMLDivElement>(null);
  const viewRef    = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  const activeRef        = useRef(false);
  const velRef           = useRef(0);
  const targetVelRef     = useRef(0);
  const mouseXRef        = useRef(0);
  const mouseYRef        = useRef(0);
  const rafRef           = useRef<number>(0);
  const itemsRef         = useRef<Item[]>([]);
  const sectionScrollRef = useRef(0);
  const lastTimeRef      = useRef(0);

  // ── Build 3D world ────────────────────────────────────────────────────────
  function buildWorld(world: HTMLDivElement) {
    world.innerHTML = "";
    itemsRef.current = [];
    const items = itemsRef.current;

    for (let i = 0; i < CONFIG.itemCount; i++) {
      const el = document.createElement("div");
      el.className = "hss-item";
      const isHeading = i % 4 === 0;

      if (isHeading) {
        const txt = document.createElement("div");
        txt.className = "hss-big-text";
        txt.innerText = TEXTS[i % TEXTS.length];
        el.appendChild(txt);
        items.push({ el, type: "text", x: 0, y: 0, rot: 0, baseZ: -(i * CONFIG.zGap + CONFIG.leadIn) });
      } else {
        const card = CARDS[(i - 1) % CARDS.length];
        const cardEl = document.createElement("div");
        cardEl.className = "hss-card";
        cardEl.innerHTML = `
          <div class="hss-card-header">
            <span class="hss-card-id">${card.id}</span>
            <div class="hss-card-dot"></div>
          </div>
          <h2 class="hss-card-title">${card.title}</h2>
          <p class="hss-card-tags">${card.tags}</p>
          <div class="hss-card-footer">
            <span>${card.stat}</span>
            <span>BAKRY LLC</span>
          </div>
          <div class="hss-card-num">0${i}</div>
        `;
        el.appendChild(cardEl);

        const angle = (i / CONFIG.itemCount) * Math.PI * 6;
        const x     = Math.cos(angle) * (typeof window !== "undefined" ? window.innerWidth  * 0.28 : 300);
        const y     = Math.sin(angle) * (typeof window !== "undefined" ? window.innerHeight * 0.28 : 200);
        const rot   = (Math.random() - 0.5) * 28;
        items.push({ el, type: "card", x, y, rot, baseZ: -(i * CONFIG.zGap + CONFIG.leadIn) });
      }
      world.appendChild(el);
    }

    // Stars — spread across full tunnel depth, rot: 0 satisfies the interface
    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement("div");
      el.className = "hss-star";
      world.appendChild(el);
      items.push({
        el,
        type:  "star",
        x:     (Math.random() - 0.5) * 3000,
        y:     (Math.random() - 0.5) * 3000,
        rot:   0,
        baseZ: -Math.random() * TUNNEL_LENGTH,
      });
    }
  }

  // ── RAF loop ──────────────────────────────────────────────────────────────
  function startLoop() {
    if (activeRef.current) return;
    activeRef.current = true;

    function loop(time: number) {
      if (!activeRef.current) return;

      lastTimeRef.current = time;
      velRef.current += (targetVelRef.current - velRef.current) * 0.1;

      const world    = worldRef.current;
      const viewport = viewRef.current;
      if (!world || !viewport) { rafRef.current = requestAnimationFrame(loop); return; }

      world.style.transform = `rotateX(${mouseYRef.current * 4 - velRef.current * 0.4}deg) rotateY(${mouseXRef.current * 4}deg)`;
      viewport.style.perspective = `${1000 - Math.min(Math.abs(velRef.current) * 10, 500)}px`;

      const cameraZ = sectionScrollRef.current * CONFIG.camSpeed;

      itemsRef.current.forEach((item) => {
        // Straight linear — NO modulo wrapping
        const vizZ = item.baseZ + cameraZ;

        let alpha = 1;
        if (vizZ < -3000) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
        if (vizZ > 100 && item.type !== "star") alpha = 1 - (vizZ - 100) / 400;
        if (vizZ > 500) alpha = 0;
        if (alpha < 0) alpha = 0;

        item.el.style.opacity = String(alpha);

        if (alpha > 0) {
          let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;

          if (item.type === "star") {
            const stretch = Math.max(1, Math.min(1 + Math.abs(velRef.current) * 0.1, 10));
            trans += ` scale3d(1, 1, ${stretch})`;
          } else if (item.type === "text") {
            trans += ` rotateZ(${item.rot}deg)`;
            if (Math.abs(velRef.current) > 1) {
              const off = velRef.current * 1.5;
              (item.el.firstChild as HTMLElement).style.textShadow =
                `${off}px 0 #C6B28A, ${-off}px 0 #55624A`;
            } else {
              (item.el.firstChild as HTMLElement).style.textShadow = "none";
            }
          } else {
            const float = Math.sin(time * 0.001 + item.x * 0.01) * 8;
            trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
          }

          item.el.style.transform = trans;
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  function stopLoop() {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }

  // ── ScrollTrigger setup ───────────────────────────────────────────────────
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const world   = worldRef.current;
    if (!section || !world) return;

    buildWorld(world);

    const onMouse = (e: MouseEvent) => {
      mouseXRef.current = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseYRef.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Slightly longer pin so lead-in + tunnel content both fit
    const scrollBudget = (TUNNEL_LENGTH + CONFIG.leadIn) / CONFIG.camSpeed;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    const clearExit = () => {
      if (exitTimer) clearTimeout(exitTimer);
      exitTimer = undefined;
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollBudget}`,
      pin: true,
      onEnter: () => {
        clearExit();
        setExiting(false);
        setEntered(true);
        startLoop();
      },
      onLeave: () => {
        clearExit();
        setExiting(true);
        exitTimer = setTimeout(() => {
          stopLoop();
          setEntered(false);
          setExiting(false);
        }, 220);
      },
      onEnterBack: () => {
        clearExit();
        setExiting(false);
        setEntered(true);
        startLoop();
      },
      onLeaveBack: () => {
        clearExit();
        setExiting(true);
        exitTimer = setTimeout(() => {
          stopLoop();
          setEntered(false);
          setExiting(false);
        }, 220);
      },
      onUpdate: (self) => {
        sectionScrollRef.current = self.progress * scrollBudget;
        targetVelRef.current     = self.getVelocity() / 100;
      },
    });

    return () => {
      clearExit();
      st.kill();
      stopLoop();
      window.removeEventListener("mousemove", onMouse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&family=Syncopate:wght@400;700&display=swap');

        .hss-root {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #E6E2D6;
        }

        .hss-entry-overlay {
          position: absolute; inset: 0; z-index: 30;
          pointer-events: none; background: #E6E2D6;
          transition: opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1);
          opacity: 1;
        }
        .hss-root.hss-entered .hss-entry-overlay { opacity: 0; }

        .hss-exit-overlay {
          position: absolute; inset: 0; z-index: 30;
          pointer-events: none; background: #E6E2D6;
          transition: opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          opacity: 0;
        }
        .hss-root.hss-exiting .hss-exit-overlay { opacity: 1; }

        .hss-scanlines {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0), rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15)
          );
          background-size: 100% 4px;
          pointer-events: none; z-index: 10; opacity: 0.6;
        }

        .hss-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(circle, transparent 35%, #E6E2D6 130%);
          z-index: 11; pointer-events: none;
        }

        .hss-hud {
          position: absolute; inset: 1.5rem; z-index: 20;
          pointer-events: none; display: flex;
          flex-direction: column; justify-content: flex-start;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: rgba(42, 42, 42, 0.55);
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .hss-hud-row { display: flex; justify-content: space-between; align-items: center; }
        .hss-hud strong { color: #C6B28A; }
        .hss-hud-line { flex: 1; height: 1px; background: rgba(85, 98, 74,0.25); margin: 0 0.75rem; }
        .hss-hud-line::after {
          content: ''; display: block; margin-left: auto;
          width: 4px; height: 4px; background: #C6B28A; margin-top: -2px;
        }

        .hss-viewport {
          position: absolute; inset: 0;
          perspective: 1000px; overflow: hidden; z-index: 1;
        }

        .hss-world {
          position: absolute; top: 50%; left: 50%;
          transform-style: preserve-3d; will-change: transform;
        }

        .hss-item {
          position: absolute; left: 0; top: 0;
          backface-visibility: hidden; transform-origin: center center;
          display: flex; align-items: center; justify-content: center;
        }

        .hss-card {
          width: 300px; height: 440px;
          background: rgba(17, 17, 17,0.55);
          border: 1px solid rgba(85, 98, 74,0.25);
          position: relative; padding: 1.75rem;
          display: flex; flex-direction: column; justify-content: space-between;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.4), inset 0 0 60px rgba(198, 178, 138,0.04);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          transform: translate(-50%,-50%); border-radius: 4px;
        }
        .hss-card::before, .hss-card::after {
          content: ''; position: absolute; width: 10px; height: 10px;
          border: 1px solid transparent; transition: 0.35s ease;
        }
        .hss-card::before { top: -1px; left: -1px; border-top-color: #C6B28A; border-left-color: #C6B28A; }
        .hss-card::after  { bottom: -1px; right: -1px; border-bottom-color: #55624A; border-right-color: #55624A; }
        @media (hover: hover) {
          .hss-card:hover { border-color: #C6B28A; box-shadow: 0 0 40px rgba(198, 178, 138,0.3), 0 20px 50px rgba(0,0,0,0.5); }
          .hss-card:hover::before, .hss-card:hover::after { width: 100%; height: 100%; border-color: #C6B28A; }
        }
        .hss-card-header {
          border-bottom: 1px solid rgba(85, 98, 74,0.2);
          padding-bottom: 0.75rem; margin-bottom: 0.75rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .hss-card-id    { font-family: 'JetBrains Mono', monospace; color: #55624A; font-size: 0.7rem; letter-spacing: 0.12em; }
        .hss-card-dot   { width: 8px; height: 8px; background: #C6B28A; border-radius: 50%; box-shadow: 0 0 8px #C6B28A; }
        .hss-card-title { font-size: 2rem; line-height: 1; margin: 0; text-transform: uppercase; font-weight: 700; color: #fff; font-family: 'Syncopate', sans-serif; mix-blend-mode: hard-light; }
        .hss-card-tags  { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: rgba(230, 226, 214, 0.65); margin: 0.5rem 0 0; letter-spacing: 0.05em; }
        .hss-card-footer { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: rgba(230, 226, 214,0.4); display: flex; justify-content: space-between; }
        .hss-card-num   { position: absolute; bottom: 1.75rem; right: 1.75rem; font-size: 3.5rem; opacity: 0.07; font-weight: 900; font-family: 'Syncopate', sans-serif; color: #55624A; line-height: 1; }

        .hss-big-text {
          font-size: 14vw; font-weight: 800; color: transparent;
          -webkit-text-stroke: 1.5px rgba(17, 17, 17, 0.18);
          text-transform: uppercase; white-space: nowrap;
          transform: translate(-50%,-50%); pointer-events: none;
          letter-spacing: -0.04em; mix-blend-mode: overlay;
          font-family: 'Syncopate', sans-serif;
        }

        .hss-star {
          position: absolute; width: 2px; height: 2px;
          background: rgba(198, 178, 138,0.8);
          transform: translate(-50%,-50%); border-radius: 1px;
        }

        .hss-blend-top {
          position: absolute; top: 0; left: 0; right: 0; height: 120px;
          background: linear-gradient(to bottom, #E6E2D6 0%, transparent 100%);
          z-index: 15; pointer-events: none;
        }
        .hss-blend-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
          background: linear-gradient(to top, #E6E2D6 0%, transparent 100%);
          z-index: 15; pointer-events: none;
        }
      `}</style>

      <div
        ref={sectionRef}
        className={`hss-root${entered ? " hss-entered" : ""}${exiting ? " hss-exiting" : ""}`}
        id="hyper-scroll"
      >
        <div ref={viewRef} className="hss-viewport">
          <div ref={worldRef} className="hss-world" />
        </div>

        <div className="hss-scanlines" />
        <div className="hss-vignette" />
        <div className="hss-blend-top" />
        <div className="hss-blend-bottom" />

        <div className="hss-hud">
          <div className="hss-hud-row">
            <span>BAKRY <strong>LLC</strong></span>
            <div className="hss-hud-line" />
            <span>SYS.<strong>READY</strong></span>
          </div>
        </div>

        <div className="hss-entry-overlay" />
        <div className="hss-exit-overlay" />
      </div>
    </>
  );
}

export default HyperScrollSection;