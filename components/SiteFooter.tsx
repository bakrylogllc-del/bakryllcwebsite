/**
 * SECTION 8 — Site footer (legal links)
 * Also rendered at the end of ContactSection
 * See SECTIONS.md
 */

export function SiteFooter() {
  return (
    <footer className="relative w-full border-t border-white/10 bg-[#0b1230]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-7">
        <p className="order-1 text-center text-[11px] tracking-[0.18em] text-white/55 uppercase sm:order-none sm:text-left sm:text-xs">
          Bakry LLC © 2026
        </p>

        <nav
          aria-label="Legal"
          className="order-3 flex w-full flex-col items-center gap-2.5 text-sm text-white/65 sm:order-none sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2"
        >
          <a
            href="/terms"
            className="transition-colors duration-200 hover:text-cyan"
          >
            Terms &amp; Conditions
          </a>
          <a
            href="/privacy"
            className="transition-colors duration-200 hover:text-cyan"
          >
            Privacy Policy
          </a>
          <a
            href="mailto:hello@bakryllc.com"
            className="transition-colors duration-200 hover:text-cyan"
          >
            hello@bakryllc.com
          </a>
        </nav>

        <p className="order-2 bg-gradient-to-r from-[#24dbe7] via-[#2f7cf6] to-[#7a3af9] bg-clip-text text-center text-[10px] tracking-[0.2em] text-transparent uppercase sm:order-none sm:text-right sm:text-[11px] sm:tracking-[0.22em]">
          Design. Develop. Scale.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
