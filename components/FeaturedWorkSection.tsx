"use client";

/**
 * SECTION 6 — Featured Work
 * Styles: this file + app/globals.css (.featured-work-section)
 * See SECTIONS.md
 *
 * How to swap in real work:
 * 1. Drop screenshots in /public/featured/ (1240×874 or 2480×1748)
 * 2. Set `image` to "/featured/your-file.jpg"
 * 3. Set `href` to the live site URL — click opens in a new tab
 */

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

gsap.registerPlugin(ScrollTrigger);

const w = 1240;
const h = 874;

type FeaturedProject = {
  title: string;
  /** Live site — opens in a new tab */
  href: string;
  /** Screenshot path under /public or remote URL */
  image: string;
};

/**
 * 4 rows × 4 projects. Replace image + href for each when you have screenshots.
 * Example:
 *   { title: "Acme", href: "https://acme.com", image: "/featured/acme.jpg" }
 */
const GALLERIES: FeaturedProject[][] = [
  [
    {
      title: "Project 01",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 02",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1498050108023-c419941f0af2?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 03",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1551650975-87deedd944c3?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 04",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=${w}&h=${h}&fit=crop&q=80`,
    },
  ],
  [
    {
      title: "Project 05",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 06",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1547658719-da2b51169166?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 07",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1558655146-d09347e92766?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 08",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1467232004584-a24160f0373c?w=${w}&h=${h}&fit=crop&q=80`,
    },
  ],
  [
    {
      title: "Project 09",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 10",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 11",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 12",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=${w}&h=${h}&fit=crop&q=80`,
    },
  ],
  [
    {
      title: "Project 13",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 14",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1581291518633-83b4ebd1d83c?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 15",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=${w}&h=${h}&fit=crop&q=80`,
    },
    {
      title: "Project 16",
      href: "https://example.com",
      image: `https://images.unsplash.com/photo-1559028012-481c04fa702d?w=${w}&h=${h}&fit=crop&q=80`,
    },
  ],
];

export function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const demoInitRef = useRef(false);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];
    let fallbackId: number | undefined;

    const ctx = gsap.context(() => {
      const runScrollAnimations = () => {
        if (demoInitRef.current || !root.isConnected) return;
        demoInitRef.current = true;

        const sections = gsap.utils.toArray<HTMLElement>(
          "section.demo-gallery, section.demo-text:not(.demo-text--static)",
          root
        );

        const isMobile = window.matchMedia("(max-width: 900px)").matches;

        sections.forEach((section, index) => {
          const wrap = section.querySelector<HTMLElement>(".wrapper");
          if (!wrap) return;

          const maxShift = Math.max(0, wrap.scrollWidth - section.offsetWidth);
          if (maxShift <= 0 && isMobile) return;

          const [x, xEnd] =
            index % 2 === 1
              ? (["100%", -maxShift] as const)
              : ([-maxShift, 0] as const);

          gsap.fromTo(
            wrap,
            { x },
            {
              x: xEnd,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                scrub: isMobile ? 0.4 : 0.75,
                start: isMobile ? "top 92%" : "top 88%",
                end: () =>
                  `+=${Math.max(isMobile ? 280 : 520, section.offsetHeight * (isMobile ? 1.4 : 2.25))}`,
                invalidateOnRefresh: true,
                fastScrollEnd: true,
              },
            }
          );
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => ScrollTrigger.refresh());
        });
      };

      const tryInit = () => {
        if (demoInitRef.current) return;
        requestAnimationFrame(() => {
          runScrollAnimations();
        });
      };

      const images = gsap.utils.toArray<HTMLImageElement>("img", root);

      if (images.length === 0) {
        tryInit();
        return;
      }

      let loaded = 0;
      const bump = () => {
        loaded++;
        if (loaded >= images.length) tryInit();
      };

      images.forEach((img) => {
        const onDone = () => {
          img.removeEventListener("load", onDone);
          img.removeEventListener("error", onDone);
          bump();
        };
        img.addEventListener("load", onDone);
        img.addEventListener("error", onDone);
        cleanups.push(() => {
          img.removeEventListener("load", onDone);
          img.removeEventListener("error", onDone);
        });
        if (img.complete) queueMicrotask(onDone);
      });

      fallbackId = window.setTimeout(() => {
        if (!demoInitRef.current) tryInit();
      }, 3500);
    }, root);

    return () => {
      if (fallbackId !== undefined) window.clearTimeout(fallbackId);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      demoInitRef.current = false;
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="featured-work-section relative w-full overflow-x-hidden bg-[#0b1230]"
      id="featured-work"
    >
      <header className="df aic jcc flex min-h-[38vh] flex-col items-center justify-center py-10 sm:min-h-[55vh] sm:py-16 md:min-h-[100vh]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-[min(28vw,120px)] w-full min-h-[88px] max-w-5xl sm:h-[180px] sm:min-h-[140px] md:h-[280px] lg:h-[300px]"
        >
          <TextHoverEffect text="FEATURED WORK" />
        </motion.div>
      </header>

      {GALLERIES.map((projects, i) => (
        <section key={`gallery-${i}`} className="demo-gallery py-3 sm:py-8">
          <ul className="wrapper">
            {projects.map((project) => (
              <li key={project.title}>
                <a
                  className="featured-work-link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} (opens in a new tab)`}
                >
                  <img
                    src={project.image}
                    width={w}
                    height={h}
                    alt={project.title}
                    loading="eager"
                    decoding="async"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="demo-text demo-text--static flex min-h-[28vh] items-center justify-center overflow-hidden py-8 sm:min-h-[40vh] sm:py-20">
        <div className="text text-center text-white px-4 sm:px-8">
          BUILT TO SHIP
        </div>
      </section>
    </section>
  );
}
