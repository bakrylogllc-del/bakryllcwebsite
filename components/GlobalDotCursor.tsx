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

    const showAt = (x: number, y: number) => {
      if (document.documentElement.classList.contains("services-overlay-open")) {
        return;
      }
      mouse.x = x;
      mouse.y = y;
      if (!shown) {
        shown = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        dot.style.opacity = "1";
        document.documentElement.classList.add("custom-cursor-on");
      }
    };

    const onMove = (e: MouseEvent) => {
      showAt(e.clientX, e.clientY);
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

    /** Same-origin iframes (contact morph) — map local coords to parent viewport */
    const iframeCleanups = new Map<HTMLIFrameElement, () => void>();
    const watchedFrames = new WeakSet<HTMLIFrameElement>();

    const hideNativeCursor = (doc: Document) => {
      const styleId = "bakry-hide-native-cursor";
      if (doc.getElementById(styleId)) return;
      const style = doc.createElement("style");
      style.id = styleId;
      style.textContent = `
        html, body, body * { cursor: none !important; }
      `;
      doc.head.appendChild(style);
    };

    const bindIframe = (iframe: HTMLIFrameElement) => {
      // Re-bind on every load (srcDoc documents are replaced)
      iframeCleanups.get(iframe)?.();
      iframeCleanups.delete(iframe);
      try {
        const doc = iframe.contentDocument;
        if (!doc?.defaultView) return;

        hideNativeCursor(doc);

        const onIframeMove = (e: MouseEvent) => {
          const rect = iframe.getBoundingClientRect();
          showAt(e.clientX + rect.left, e.clientY + rect.top);
        };

        doc.addEventListener("mousemove", onIframeMove, { passive: true });
        iframeCleanups.set(iframe, () => {
          doc.removeEventListener("mousemove", onIframeMove);
        });
      } catch {
        // cross-origin — skip
      }
    };

    const scanIframes = () => {
      document.querySelectorAll<HTMLIFrameElement>("iframe").forEach((frame) => {
        if (!watchedFrames.has(frame)) {
          watchedFrames.add(frame);
          frame.addEventListener("load", () => bindIframe(frame));
        }
        if (frame.contentDocument?.readyState === "complete") {
          bindIframe(frame);
        }
      });
    };

    scanIframes();
    const mo = new MutationObserver(() => scanIframes());
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("bakry:iframe-cursor", scanIframes as EventListener);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("bakry:iframe-cursor", scanIframes as EventListener);
      mo.disconnect();
      iframeCleanups.forEach((fn) => fn());
      iframeCleanups.clear();
      window.cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, []);

  return <div ref={dotRef} className="global-dot-cursor" aria-hidden />;
}

export default GlobalDotCursor;
