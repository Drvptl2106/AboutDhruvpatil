"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type FrameLine = {
  d: string;
  /** Timeline dots and the fraction of the line at which each gets lit. */
  nodes?: { el: HTMLElement; at: number }[];
};

/** Measure an element relative to the stage. */
export type Rel = (sel: string) => DOMRect;

/**
 * One "scene": the stage holds still on screen while its own line plays out
 * in step with the scroll (Skiper 19's scroll → pathLength). The page only
 * moves on once the line has drawn all the way out.
 *
 * `build` lays out the line from the stage's content; it re-runs whenever the
 * stage resizes. `from` is how much is drawn before any scrolling; with
 * `lead`, that part draws itself in once `show` turns true.
 */
export default function LineFrame({
  id,
  length = 220,
  build,
  from = 0,
  lead = false,
  show = true,
  className,
  children,
}: {
  id?: string;
  length?: number;
  build: (rel: Rel, w: number, h: number, stage: HTMLElement) => FrameLine;
  from?: number;
  lead?: boolean;
  show?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<(FrameLine & { w: number; h: number }) | null>(null);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const byScroll = useTransform(scrollYProgress, [0, 0.9], [from, 1], { clamp: true });
  const gate = useMotionValue(lead ? 0 : 1);
  const pathLength = useTransform<number, number>([byScroll, gate], ([s, g]) => Math.min(s, g));
  const opacity = useTransform(pathLength, (v) => (v > 0.001 ? 1 : 0));

  const raf = useRef(0);
  const measure = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = stage.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const rel: Rel = (sel) => {
        const b = el.querySelector(sel)!.getBoundingClientRect();
        return new DOMRect(b.left - box.left, b.top - box.top, b.width, b.height);
      };
      setGeo({ ...build(rel, box.width, box.height, el), w: box.width, h: box.height });
    });
  }, [build]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [measure]);

  // Text reveals settle shortly after the intro; measure again then.
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(measure, 1800);
    return () => clearTimeout(t);
  }, [show, measure]);

  useEffect(() => {
    if (!lead || !show) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gate.set(1);
      return;
    }
    const c = animate(gate, 1, { duration: 2, delay: 0.6, ease: [0.65, 0, 0.35, 1] });
    return () => c.stop();
  }, [lead, show, gate]);

  // Light each timeline dot as the line reaches it.
  useMotionValueEvent(pathLength, "change", (v) => {
    geo?.nodes?.forEach(({ el, at }) => el.toggleAttribute("data-lit", v >= at - 0.002));
  });

  return (
    <section ref={section} id={id} className="relative w-full" style={{ height: `${length}svh` }}>
      <div ref={stage} className="sticky top-0 h-svh w-full overflow-hidden">
        {geo && (
          <svg
            aria-hidden
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            fill="none"
            className="pointer-events-none absolute inset-0"
          >
            <motion.path
              d={geo.d}
              stroke="rgb(var(--accent))"
              strokeWidth={geo.w < 768 ? 8 : 12}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength, opacity }}
            />
          </svg>
        )}
        <div className={cn("relative h-full w-full", className)}>{children}</div>
      </div>
    </section>
  );
}
