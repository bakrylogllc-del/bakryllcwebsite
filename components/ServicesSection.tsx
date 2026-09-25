"use client";

/**
 * SECTION 3 — Services (Web / Mobile / SaaS / Automation)
 * Styles: app/globals.css (.services-* / #services-* / open wipe)
 * Detail pages: app/services/[slug]/page.tsx
 * See SECTIONS.md
 */

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 0,
    title: "Web",
    tags: "Sites • Apps • Platforms",
    slug: "web",
    img: "/service-web.webp",
  },
  {
    id: 1,
    title: "Mobile",
    tags: "iOS • Android • Cross-platform",
    slug: "mobile",
    img: "/service-mobile.webp",
  },
  {
    id: 2,
    title: "SaaS",
    tags: "Products • Billing • Scale",
    slug: "saas",
    img: "/service-saas.webp",
  },
  {
    id: 3,
    title: "Automation",
    tags: "Workflows • Integrations • Ops",
    slug: "automation",
    img: "/service-automation.webp",
  },
];

function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

function Words({
  as: Tag = "h1",
  text,
  className,
  id,
}: {
  as?: "h1" | "h2";
  text: string;
  className?: string;
  id?: string;
}) {
  const words = splitWords(text);
  return (
    <Tag className={className} id={id}>
      {words.map((w, i) => (
        <React.Fragment key={`${id ?? "w"}-${i}-${w}`}>
          {i > 0 ? "\u00A0" : null}
          <span className="word" data-word={w}>
            {w}
          </span>
        </React.Fragment>
      ))}
    </Tag>
  );
}

export const ServicesSection = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  // ScrollTrigger — scoped to this section, after React has painted
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const panels = root.querySelectorAll<HTMLElement>(".services-panel");

      const isMobile = window.matchMedia("(max-width: 900px)").matches;

      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          // On phone: fill while the card is crossing the middle of the screen
          start: isMobile ? "top 85%" : "top bottom",
          end: isMobile ? "center 35%" : "bottom 25%",
          // Lower scrub = less “rubber band” catch-up glitches on touch
          scrub: isMobile ? 0.35 : 0.55,
          onUpdate: (self) => {
            panel.style.setProperty("--progress", String(self.progress));
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (slug: string) => {
    setActiveService(`/services/${slug}`);
    setActive(true);
  };

  const handleClose = useCallback(() => {
    setActive(false);
    setTimeout(() => setActiveService(null), 800);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  useEffect(() => {
    document.documentElement.classList.toggle("services-overlay-open", active);
    return () => document.documentElement.classList.remove("services-overlay-open");
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const y = window.scrollY;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyLeft = document.body.style.left;
    const prevBodyRight = document.body.style.right;
    const prevBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.left = prevBodyLeft;
      document.body.style.right = prevBodyRight;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, y);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [active]);

  const closeOverlay =
    typeof document !== "undefined" && active
      ? createPortal(
          <button
            type="button"
            id="services-close"
            onClick={handleClose}
            aria-label="Back to services"
          >
            <span className="services-close-icon" aria-hidden>
              <span className="services-close-line" />
            </span>
            <span className="services-close-label">Back</span>
          </button>,
          document.body
        )
      : null;

  return (
    <div
      ref={rootRef}
      className={`services-root services-loaded w-full min-h-0 max-w-full scroll-mt-20 sm:scroll-mt-24 ${
        active ? "services-active" : ""
      }`}
      id="services"
    >
      <div ref={wrapRef} id="services-wrap">
        <Words as="h1" text="Our Services" />
        <p className="services-subhead">From idea to production</p>

        {services.map((s) => (
          <div key={s.id} className="services-panel">
            <Words as="h2" text={s.title} />

            <div className="services-thumb">
              <p>{s.tags}</p>
              <div
                className="inner"
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(s.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(s.slug);
                  }
                }}
              >
                <img loading="lazy" src={s.img} alt={s.title} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={frameRef} id="services-frame" aria-hidden={!active}>
        <div className="frame-wrap">
          <div className="frame-container">
            {activeService ? (
              <iframe
                key={activeService}
                ref={iframeRef}
                title="Service"
                src={active ? activeService : "about:blank"}
                className="border-0"
                allow="clipboard-read; clipboard-write; fullscreen"
              />
            ) : null}
          </div>
        </div>
      </div>
      {closeOverlay}
    </div>
  );
};

export default ServicesSection;