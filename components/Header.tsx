"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Featured Work", href: "#featured-work" },
];

export function Header({ servicesMode = false }: { servicesMode?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (servicesMode) setMobileOpen(false);
  }, [servicesMode]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 w-full backdrop-blur-md transition-colors duration-400 ${
        servicesMode ? "border-b border-[#111111]/0 bg-[#E6E2D6]/55" : "border-b border-[#111111]/10 bg-[#E6E2D6]/90"
      }`}
    >
      <div className="relative flex h-16 w-full items-center justify-between pl-1.5 pr-4 sm:pl-2 sm:pr-5 md:h-[4.5rem] md:pl-2 md:pr-6 lg:pl-3">
        <a
          href="/"
          className={`relative z-10 block h-10 w-[min(200px,48vw)] shrink-0 transition-opacity duration-400 sm:h-12 md:h-[52px] md:w-[200px] ${
            servicesMode ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-label="Bakry LLC home"
        >
          <TextHoverEffect text="BAKRY LLC" />
        </a>

        <nav
          className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 transition-opacity duration-400 md:flex ${
            servicesMode ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-label="Main"
        >
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ y: -2, color: "#111111" }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="text-sm font-medium text-[#2A2A2A]"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <div className={`flex w-10 items-center justify-end transition-opacity duration-300 md:w-[200px] ${servicesMode ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          <motion.button
            type="button"
            className="rounded-lg border border-[#111111]/15 p-2 text-[#111111] md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
          </motion.button>
        </div>

        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 h-10 w-[min(200px,48vw)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-400 sm:h-12 md:h-[52px] md:w-[200px] ${
            servicesMode ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!servicesMode}
        >
          <TextHoverEffect text="BAKRY LLC" />
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#111111]/10 bg-[#E6E2D6] md:hidden"
          >
            <ul className="flex flex-col gap-1 px-2 pb-4 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-1 sm:px-3">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block rounded-lg py-3 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#111111]/5 hover:text-[#111111]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
