"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

type LoadingScreenProps = {
  onComplete: () => void;
};

/**
 * One-time entrance: mark draws → fills → tan chip → label → wipe reveal.
 * Paths are a stylized trace of the logo (swap when vector source is available).
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainPathRef = useRef<SVGPathElement>(null);
  const leafPathRef = useRef<SVGPathElement>(null);
  const squareRef = useRef<SVGRectElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Hide full filled logo for one frame; set dash offsets before paint
  useLayoutEffect(() => {
    const mainPath = mainPathRef.current;
    const leafPath = leafPathRef.current;
    const square = squareRef.current;
    const label = labelRef.current;
    const dot = dotRef.current;
    if (!mainPath || !leafPath || !square || !label || !dot) return;

    const mainLen = mainPath.getTotalLength();
    const leafLen = leafPath.getTotalLength();

    gsap.set(mainPath, {
      strokeDasharray: mainLen,
      strokeDashoffset: mainLen,
      fillOpacity: 0,
    });
    gsap.set(leafPath, {
      strokeDasharray: leafLen,
      strokeDashoffset: leafLen,
      fillOpacity: 0,
    });
    gsap.set(square, { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(label, { opacity: 0, y: 8 });
    gsap.set(dot, { scale: 0, opacity: 0 });
    setPrimed(true);
  }, []);

  useEffect(() => {
    if (!primed) return;

    const mainPath = mainPathRef.current;
    const leafPath = leafPathRef.current;
    const square = squareRef.current;
    const label = labelRef.current;
    const dot = dotRef.current;
    const overlay = overlayRef.current;
    const root = rootRef.current;
    if (!mainPath || !leafPath || !square || !label || !dot || !overlay || !root) {
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => onCompleteRef.current(),
    });

    tl.to(mainPath, { strokeDashoffset: 0, duration: 1.15 })
      .to(leafPath, { strokeDashoffset: 0, duration: 0.75 }, "-=0.55")
      .to(
        [mainPath, leafPath],
        { fillOpacity: 1, duration: 0.45, ease: "power1.out" },
        "-=0.1",
      )
      .to(square, { scale: 1, duration: 0.55, ease: "back.out(2.2)" }, "-=0.15")
      .to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.25")
      .to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: "power1.out" }, "-=0.3")
      .to(dot, {
        scale: 1.6,
        opacity: 0,
        duration: 0.6,
        ease: "power1.out",
      })
      .to({}, { duration: 0.25 })
      .to(
        [mainPath, leafPath, square, label],
        { opacity: 0, scale: 0.92, duration: 0.4, ease: "power2.in" },
        "exit",
      )
      .to(
        overlay,
        {
          clipPath: "circle(150% at 33% 78%)",
          duration: 0.9,
          ease: "power3.inOut",
        },
        "exit+=0.05",
      )
      .set(root, { display: "none" });

    return () => {
      tl.kill();
    };
  }, [primed]);

  return (
    <>
      <style>{`
        .bk-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
        }
        .bk-loader__overlay {
          position: absolute;
          inset: 0;
          background: #E6E2D6;
          clip-path: circle(150% at 50% 50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bk-loader__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(17, 17, 17, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(17, 17, 17, 0.08) 1px, transparent 1px);
          background-size: calc(100vw / 8) calc(100svh / 8);
          pointer-events: none;
        }
        .bk-loader__stage {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          opacity: 0;
        }
        .bk-loader__stage.is-primed {
          opacity: 1;
        }
        .bk-loader__mark {
          width: min(34vw, 220px);
          height: auto;
          overflow: visible;
        }
        .bk-loader__stroke {
          stroke: #111111;
          stroke-width: 3.5;
          stroke-linejoin: round;
          stroke-linecap: round;
          fill: #111111;
        }
        .bk-loader__square {
          fill: #C6B28A;
          transform-box: fill-box;
        }
        .bk-loader__label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-geist-mono, "JetBrains Mono"), ui-monospace, monospace;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.35em;
          color: #111111;
          text-transform: uppercase;
        }
        .bk-loader__dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #C6B28A;
        }
        @media (prefers-reduced-motion: reduce) {
          .bk-loader { display: none !important; }
        }
      `}</style>

      <div ref={rootRef} className="bk-loader" aria-label="Loading">
        <div ref={overlayRef} className="bk-loader__overlay">
          <div className="bk-loader__grid" />

          <div className={`bk-loader__stage${primed ? " is-primed" : ""}`}>
            <svg
              className="bk-loader__mark"
              viewBox="0 0 582 527"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                ref={mainPathRef}
                className="bk-loader__stroke bk-loader__stroke--main"
                d="M128,62 L196,62 Q222,62 222,108 L222,222 L354,222
                   C416,222 458,262 458,325
                   C458,388 412,443 305,443
                   L222,443 L222,340 L128,340 Z"
              />
              <path
                ref={leafPathRef}
                className="bk-loader__stroke bk-loader__stroke--leaf"
                d="M250,60
                   L338,58
                   C388,58 424,88 424,125
                   C424,165 402,196 368,210
                   C332,225 278,215 233,207
                   C237,155 240,102 250,60 Z"
              />
              <rect
                ref={squareRef}
                className="bk-loader__square"
                x="128"
                y="340"
                width="94"
                height="103"
              />
            </svg>

            <div className="bk-loader__label" ref={labelRef}>
              <span>BAKRY&nbsp;LLC</span>
              <em className="bk-loader__dot" ref={dotRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
