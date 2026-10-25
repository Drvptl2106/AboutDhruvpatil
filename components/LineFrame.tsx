"use client";

import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type FrameLine = {
  d: string;
  /** How much of the line draws while the scene scrolls into view (0–1). */
  entry?: number;
  /** Timeline dots and the fraction of the line at which each gets lit. */
  nodes?: { el: HTMLElement; at: number }[];
};

const SceneProgress = createContext<MotionValue<number> | null>(null);

/** Inside a scene: 0 → 1 over the part where the scene holds still. */
export const useSceneProgress = () => useContext(SceneProgress);

/** Measure an element relative to the stage. */
export type Rel = (sel: string) => DOMRect;

/**
 * One "scene": the stage holds still on screen while its own line plays out
 * in step with the scroll (Skiper 19's scroll → pathLength). The page only
 * moves on once the line has drawn all the way out.
 *
 * The line starts while the scene is still scrolling into view (its `entry`
 * part), so it picks up right where the previous scene's line left; the rest
 * plays out while the scene holds.
 *
 * `build` lays out the line from the stage's content; it re-runs whenever the
 * stage resizes. With `lead`, the part already due at the top of the page
 * draws itself in once `show` turns true.
 */
export default function LineFrame({
  id,
  length = 220,
  build,
  lead = false,
  show = true,
  className,
  children,
}: {
  id?: string;
  length?: number;
  build: (rel: Rel, w: number, h: number, stage: HTMLElement) => FrameLine;
  lead?: boolean;
  show?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<(FrameLine & { w: number; h: number }) | null>(null);

  // Progress runs from the scene's top entering the screen to the scene
  // letting go: the first screen is the scroll-in, the rest is the hold.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end end"] });
  const entry = useMotionValue(0.1);
  const inEnd = 100 / length;
  const holdEnd = inEnd + 0.9 * (1 - inEnd);
  const byScroll = useTransform<number, number>([scrollYProgress, entry], ([p, e]) =>
    p <= inEnd ? (p / inEnd) * e : Math.min(1, e + ((p - inEnd) / (holdEnd - inEnd)) * (1 - e)),
  );
  const hold = useTransform(scrollYProgress, [inEnd, holdEnd], [0, 1], { clamp: true });
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
      const line = build(rel, box.width, box.height, el);
      entry.set(line.entry ?? 0.1);
      setGeo({ ...line, w: box.width, h: box.height });
    });
  }, [build, entry]);

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
              stroke="rgb(var(--line))"
              strokeWidth={geo.w < 768 ? 10 : 16}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength, opacity }}
            />
          </svg>
        )}
        <SceneProgress.Provider value={hold}>
          <div className={cn("relative h-full w-full", className)}>{children}</div>
        </SceneProgress.Provider>
      </div>
    </section>
  );
}
