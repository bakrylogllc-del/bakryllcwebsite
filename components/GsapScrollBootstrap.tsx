"use client";

import { useEffect, useLayoutEffect } from "react";
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
  // Stop the browser from restoring mid-page scroll on refresh (lands on HyperScroll pin).
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  registered = true;
}

function resetScrollUnlessHash() {
  if (window.location.hash) return;
  ScrollTrigger.clearScrollMemory();
  window.scrollTo(0, 0);
}

/** Mount once near the root so ScrollTrigger remeasures after fonts/layout settle. */
export function GsapScrollBootstrap() {
  // Before paint — avoid flash at a restored scroll position
  useLayoutEffect(() => {
    ensureGsap();
    resetScrollUnlessHash();
  }, []);

  useEffect(() => {
    ensureGsap();

    let t1 = 0;
    let t2 = 0;
    const refresh = () => {
      ScrollTrigger.refresh();
    };

    const onLoad = () => {
      resetScrollUnlessHash();
      refresh();
      t1 = window.setTimeout(() => {
        resetScrollUnlessHash();
        refresh();
      }, 250);
      t2 = window.setTimeout(refresh, 1000);
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        refresh();
        return;
      }
      resetScrollUnlessHash();
      refresh();
    };
    window.addEventListener("pageshow", onPageShow);

    // Late layout shifts (images / fonts) — debounced refresh only
    const ro =
      typeof ResizeObserver !== "undefined"
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
