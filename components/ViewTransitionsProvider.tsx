"use client";

/** Passthrough — view transitions were stalling over LAN and freezing the page. */
export function ViewTransitionsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
