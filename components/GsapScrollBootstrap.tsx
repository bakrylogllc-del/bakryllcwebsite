"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsap() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
  // Smooth CSS scroll fights scrub/pin measurements, especially over slow networks.
  document.documentElement.style.scrollBehavior = "auto";
  registered = true;
}

/** Mount once near the root so ScrollTrigger remeasures after fonts/layout settle. */
export function GsapScrollBootstrap() {
  useEffect(() => {
    ensureGsap();

    let t1 = 0;
    let t2 = 0;
    const refresh = () => ScrollTrigger.refresh();

    const onLoad = () => {
      refresh();
      t1 = window.setTimeout(refresh, 250);
      t2 = window.setTimeout(refresh, 1000);
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) refresh();
    };
    window.addEventListener("pageshow", onPageShow);

    // Late layout shifts (images / fonts) — one cheap debounce after first paint
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          window.clearTimeout(t1);
          t1 = window.setTimeout(refresh, 200);
        })
      : null;
    if (ro) ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pageshow", onPageShow);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro?.disconnect();
    };
  }, []);

  return null;
}
