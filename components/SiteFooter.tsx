/**
 * SECTION 8 — Site footer (legal links)
 * Also rendered at the end of ContactSection
 * See SECTIONS.md
 */

export function SiteFooter() {
  return (
    <footer id="site-footer" className="relative w-full border-t border-[#111111]/15 bg-[#E6E2D6]">
      {/* Phone / tablet: 2 rows — meta+links, then email under a dotted rule */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-0 px-5 py-6 sm:hidden">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <p className="text-[11px] tracking-[0.18em] text-[#2A2A2A] uppercase">
            Bakry LLC © 2026
          </p>
          <p className="bg-gradient-to-r from-[#C6B28A] via-[#55624A] to-[#2A2A2A] bg-clip-text text-[10px] tracking-[0.2em] text-transparent uppercase">
            Design. Develop. Scale.
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-[#2A2A2A]"
          >
            <a
              href="/terms"
              className="transition-colors duration-200 hover:text-[#C6B28A]"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/privacy"
              className="transition-colors duration-200 hover:text-[#C6B28A]"
            >
              Privacy Policy
            </a>
          </nav>
        </div>

        <a
          href="mailto:hello@bakryllc.com"
          className="mt-4 w-full border-t border-dotted border-[#111111]/35 pt-4 text-center text-sm text-[#2A2A2A] transition-colors duration-200 hover:text-[#C6B28A]"
        >
          hello@bakryllc.com
        </a>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-6xl items-center justify-between gap-6 px-6 py-7 sm:flex">
        <p className="text-xs tracking-[0.18em] text-[#2A2A2A] uppercase">
          Bakry LLC © 2026
        </p>

        <nav
          aria-label="Legal"
          className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#2A2A2A]"
        >
          <a
            href="/terms"
            className="transition-colors duration-200 hover:text-[#C6B28A]"
          >
            Terms &amp; Conditions
          </a>
          <a
            href="/privacy"
            className="transition-colors duration-200 hover:text-[#C6B28A]"
          >
            Privacy Policy
          </a>
          <a
            href="mailto:hello@bakryllc.com"
            className="transition-colors duration-200 hover:text-[#C6B28A]"
          >
            hello@bakryllc.com
          </a>
        </nav>

        <p className="bg-gradient-to-r from-[#C6B28A] via-[#55624A] to-[#2A2A2A] bg-clip-text text-right text-[11px] tracking-[0.22em] text-transparent uppercase">
          Design. Develop. Scale.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
