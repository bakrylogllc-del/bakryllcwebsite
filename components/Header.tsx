"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Featured Work", href: "#featured-work" },
  { label: "Contact", href: "#contact" },
];

const navFont =
  "font-[family-name:var(--font-lexend-mega)] tracking-[0.14em] uppercase";

function scrollToHash(href: string) {
  const id = href.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lastY = useRef(0);
  const pendingHash = useRef<string | null>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setScrolled(y > 12);

      if (drawerOpen) {
        setHidden(false);
        lastY.current = y;
        return;
      }

      if (y < 48) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;

    const y = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, y);
      window.removeEventListener("keydown", onKey);

      const hash = pendingHash.current;
      if (hash) {
        pendingHash.current = null;
        // After unlock — smooth scroll to the section
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollToHash(hash));
        });
      }
    };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  const onNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    if (drawerOpen) {
      pendingHash.current = href;
      setDrawerOpen(false);
      return;
    }
    scrollToHash(href);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          y: hidden ? "-110%" : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-[60] w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "border-[#111111]/10 bg-[#E6E2D6]/72 backdrop-blur-md"
            : "border-transparent bg-[#E6E2D6]/0 backdrop-blur-0"
        }`}
      >
        {/* Equal side gaps — same base inset as Menu ↔ edge */}
        <div className="relative flex h-14 w-full items-center justify-between pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:h-16 sm:pl-5 sm:pr-5 md:h-[4.25rem] md:pl-6 md:pr-6">
          <a
            href="/"
            className="relative z-10 -ml-1 block h-9 w-[min(176px,48vw)] shrink-0 sm:-ml-1.5 sm:h-11 sm:w-[200px] md:h-12 md:w-[220px]"
            aria-label="Bakry LLC home"
          >
            <TextHoverEffect text="BAKRY LLC" align="left" />
          </a>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => onNavClick(e, item.href)}
                className={`${navFont} text-[11px] font-bold text-[#55624A] transition-colors duration-200 hover:text-[#C6B28A]`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className={`md:hidden ${navFont} text-[11px] font-bold text-[#55624A] transition-colors duration-200 hover:text-[#C6B28A] active:text-[#111111]`}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen(true)}
          >
            Menu
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.button
              key="drawer-backdrop"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[70] bg-[#111111]/35 backdrop-blur-[2px] md:hidden"
              onClick={closeDrawer}
            />

            <motion.aside
              key="drawer-panel"
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[80] flex h-[100dvh] w-[min(320px,86vw)] flex-col border-l border-[#111111]/10 bg-[#E6E2D6] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[-12px_0_40px_rgba(17,17,17,0.12)] md:hidden"
            >
              <div className="flex items-center justify-between">
                <p
                  className={`${navFont} text-[11px] font-bold text-[#55624A]`}
                >
                  Bakry LLC
                </p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className={`${navFont} text-[11px] font-bold text-[#55624A] transition-colors duration-200 hover:text-[#C6B28A]`}
                >
                  Close
                </button>
              </div>

              <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Mobile">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.05,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`${navFont} border-b border-[#111111]/10 py-4 text-[15px] font-bold text-[#111111] transition-colors hover:text-[#55624A]`}
                    onClick={(e) => onNavClick(e, item.href)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <a
                href="mailto:hello@bakryllc.com"
                className={`${navFont} mt-auto pt-6 text-[11px] font-bold text-[#2A2A2A] transition-colors hover:text-[#55624A]`}
                onClick={closeDrawer}
              >
                hello@bakryllc.com
              </a>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Header;
