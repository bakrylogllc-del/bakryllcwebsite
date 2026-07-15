"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoadingScreen } from "@/components/LoadingScreen";

/** Timestamp of last completed full loader. Skip for 4 minutes after. */
const STORAGE_KEY = "bakry-loader-at-v2";
const SKIP_WINDOW_MS = 4 * 60 * 1000;

type Phase = "checking" | "loading" | "ready";
export type IntroMode = "cinematic" | "normal";

type LoadingGateProps = {
  children: React.ReactNode;
  /** Called once when the page may show the hero. */
  onReady?: (mode: IntroMode) => void;
};

function shouldSkipLoader() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < SKIP_WINDOW_MS;
  } catch {
    return false;
  }
}

function markLoaderSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function LoadingGate({ children, onReady }: LoadingGateProps) {
  const [phase, setPhase] = useState<Phase>("checking");
  const modeRef = useRef<IntroMode>("normal");
  const readySent = useRef(false);

  useLayoutEffect(() => {
    if (shouldSkipLoader()) {
      modeRef.current = "normal";
      setPhase("ready");
    } else {
      modeRef.current = "cinematic";
      setPhase("loading");
    }
  }, []);

  // Emit after children stay mounted — never unmount the site under the overlay
  useEffect(() => {
    if (phase !== "ready" || readySent.current) return;
    readySent.current = true;
    onReady?.(modeRef.current);
  }, [phase, onReady]);

  useEffect(() => {
    const active = phase === "loading";
    document.documentElement.classList.toggle("bk-loader-active", active);
    return () => document.documentElement.classList.remove("bk-loader-active");
  }, [phase]);

  const handleComplete = useCallback(() => {
    markLoaderSeen();
    modeRef.current = "cinematic";
    window.scrollTo(0, 0);
    setPhase("ready");
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.setTimeout(() => ScrollTrigger.refresh(), 300);
    });
  }, []);

  const loading = phase === "loading";

  return (
    <>
      {loading && <LoadingScreen onComplete={handleComplete} />}
      {/* Keep children mounted always so hero controls don't break on revisit */}
      <div
        className={loading ? "pointer-events-none select-none" : undefined}
        aria-hidden={loading || undefined}
        style={phase === "checking" ? { opacity: 0 } : undefined}
      >
        {children}
      </div>
    </>
  );
}
