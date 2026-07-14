"use client";

import { useEffect, useRef } from "react";

export function GlobalDotCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Service pages load in an iframe — never mount a second cursor there.
    try {
      if (window.self !== window.top) {
        dot.style.display = "none";
        return;
      }
    } catch {
      dot.style.display = "none";
      return;
    }

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!media.matches) {
      dot.style.display = "none";
      return;
    }

    let rafId = 0;
    let shown = false;
    let running = true;
    const pos = { x: -100, y: -100 };
    const mouse = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      if (document.documentElement.classList.contains("services-overlay-open")) {
        return;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!shown) {
        shown = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        dot.style.opacity = "1";
        document.documentElement.classList.add("custom-cursor-on");
      }
    };

    const onLeaveWindow = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      dot.style.opacity = "0";
      shown = false;
      document.documentElement.classList.remove("custom-cursor-on");
    };

    const tick = () => {
      if (!running) return;
      const overlay = document.documentElement.classList.contains("services-overlay-open");
      if (overlay) {
        dot.style.opacity = "0";
        shown = false;
        document.documentElement.classList.remove("custom-cursor-on");
      } else {
        pos.x += (mouse.x - pos.x) * 0.24;
        pos.y += (mouse.y - pos.y) * 0.24;
        if (shown) {
          dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      window.cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, []);

  return <div ref={dotRef} className="global-dot-cursor" aria-hidden />;
}

export default GlobalDotCursor;
