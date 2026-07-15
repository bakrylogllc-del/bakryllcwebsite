/**
 * SECTION 8 — Site footer (legal links)
 * Also rendered at the end of ContactSection
 * See SECTIONS.md
 */

export function SiteFooter() {
  return (
    <footer id="site-footer" className="relative w-full border-t border-[#111111]/15 bg-[#E6E2D6]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-7">
        <p className="order-1 text-center text-[11px] tracking-[0.18em] text-[#2A2A2A] uppercase sm:order-none sm:text-left sm:text-xs">
          Bakry LLC © 2026
        </p>

        <nav
          aria-label="Legal"
          className="order-3 flex w-full flex-col items-center gap-2.5 text-sm text-[#2A2A2A] sm:order-none sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2"
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

        <p className="order-2 bg-gradient-to-r from-[#C6B28A] via-[#55624A] to-[#2A2A2A] bg-clip-text text-center text-[10px] tracking-[0.2em] text-transparent uppercase sm:order-none sm:text-right sm:text-[11px] sm:tracking-[0.22em]">
          Design. Develop. Scale.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
