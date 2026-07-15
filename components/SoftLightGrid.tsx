"use client";

/**
 * Soft Light 8×8 grid — pixel-aligned cells, synced to viewport.
 * Desktop: band uses background-attachment: fixed (page.tsx).
 * Phone: scroll + repeat on the band element.
 */

import { useEffect } from "react";

function syncGridCells(band: HTMLElement) {
  const w = document.documentElement.clientWidth;
  const h = window.innerHeight;
  // Floor so repeat tiles don't drift on fractional pixels (mobile glitch)
  band.style.setProperty("--soft-cell-w", `${Math.floor(w / 8)}px`);
  band.style.setProperty("--soft-cell-h", `${Math.floor(h / 8)}px`);
}

export function SoftLightGrid() {
  useEffect(() => {
    const band = document.getElementById("soft-light-band");
    if (!band) return;

    syncGridCells(band);

    const onResize = () => syncGridCells(band);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    ro?.observe(band);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      ro?.disconnect();
    };
  }, []);

  return null;
}
