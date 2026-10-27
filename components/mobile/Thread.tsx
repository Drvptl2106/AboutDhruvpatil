"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { clamp, fractionAt, LineBuilder, type Point } from "@/lib/linePath";

/** x of the gutter the thread runs down (timeline dots sit on it). */
export const GUTTER = 24;

// The tip of the thread tracks this point of the screen (0 = top, 1 = bottom).
const TIP_AT = 0.66;
// Scroll spent per px of thread, so underlines and loops draw gradually.
const PACE = 0.35;
const PACE_MIN = 0.1;

/**
 * The route, from the page's markers in order:
 *  - `data-thread="title"`: come off the gutter, underline the title, loop at
 *    its end, sweep back to the gutter (the first one starts off-screen left)
 *  - `data-thread="node"`: straight down the gutter through the dot
 *  - `data-thread="final"`: circle the word and stop
 */
function route(root: HTMLElement) {
  const box = root.getBoundingClientRect();
  const w = root.clientWidth;
  const rect = (el: Element) => {
    const b = el.getBoundingClientRect();
    return new DOMRect(b.left - box.left, b.top - box.top, b.width, b.height);
  };
  const r = 15;
  const nodes: { el: HTMLElement; at: Point }[] = [];
  let b: LineBuilder | null = null;

  for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-thread]"))) {
    const t = rect(el);
    const kind = el.dataset.thread;
    if (kind === "title") {
      const y = t.bottom + 14;
      const end = Math.min(t.right + r + 6, w - r - 10);
      if (!b) b = new LineBuilder({ x: -30, y }, { x: 1, y: 0 });
      else
        b.line({ x: GUTTER, y: Math.max(b.point.y + 1, y - 56) }).to(
          { x: Math.min(t.left + 8, GUTTER + 34), y },
          { x: 1, y: 0 },
          0.55,
        );
      b.line({ x: end, y })
        .circle(r, 1, "left")
        .to({ x: Math.min(end + 30, w - 12), y: y + 34 }, { x: 0, y: 1 }, 0.5)
        .to({ x: GUTTER + 36, y: y + 82 }, { x: -1, y: 0.25 }, 0.45)
        .to({ x: GUTTER, y: y + 118 }, { x: 0, y: 1 }, 0.55);
    } else if (kind === "node" && b) {
      const at = { x: GUTTER, y: t.top + t.height / 2 };
      b.line(at);
      nodes.push({ el, at });
    } else if (kind === "final" && b) {
      const rx = t.width / 2 + 14;
      const ry = t.height / 2 + 6;
      const cy = t.top + t.height * 0.55;
      b.line({ x: GUTTER, y: Math.max(b.point.y + 1, cy - 70) })
        .to({ x: t.left + t.width / 2 - rx, y: cy }, { x: 0, y: 1 }, 0.5)
        .ellipse("left", rx, ry, 5);
    }
  }
  if (!b) return null;
  const line = b.build();
  return {
    w,
    h: root.scrollHeight,
    d: line.d,
    flat: line.flat,
    nodes: nodes.map(({ el, at }) => ({ el, at: fractionAt(line.flat, at) })),
  };
}

/**
 * One continuous line down the whole mobile page, drawn by how far you've
 * scrolled — never by holding the page still. Wrap the page content in it.
 */
export default function Thread({ ready, children }: { ready: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<ReturnType<typeof route>>(null);
  const paced = useRef<Float32Array | null>(null);

  const target = useMotionValue(0);
  const gate = useMotionValue(0);
  const drawn = useTransform<number, number>([target, gate], ([p, g]) => Math.min(p, g));
  const visible = useTransform(drawn, (v) => (v > 0.001 ? 1 : 0));
  const { scrollY } = useScroll();

  const raf = useRef(0);
  const measure = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => ref.current && setGeo(route(ref.current)));
  }, []);

  useEffect(() => {
    const el = ref.current;
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

  const update = useCallback(() => {
    const el = ref.current;
    const p = paced.current;
    if (!el || !p || !geo) return;
    const y = window.innerHeight * TIP_AT - el.getBoundingClientRect().top;
    let lo = 0;
    let hi = p.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (p[mid] < y) lo = mid + 1;
      else hi = mid;
    }
    // Interpolate between points so the thread grows with every pixel.
    const { lens, total } = geo.flat;
    let len = lens[lo];
    if (lo > 0 && p[lo] > p[lo - 1]) len = lens[lo - 1] + (lens[lo] - lens[lo - 1]) * clamp((y - p[lo - 1]) / (p[lo] - p[lo - 1]), 0, 1);
    target.set(total ? len / total : 0);
  }, [geo, target]);

  // For every point on the thread: the tip position at which it is drawn.
  useLayoutEffect(() => {
    if (!geo) return;
    const { ys, lens } = geo.flat;
    const out = new Float32Array(ys.length);
    const maxLag = window.innerHeight * 0.3;
    let maxY = -Infinity;
    let p = -Infinity;
    for (let i = 0; i < ys.length; i++) {
      const step = i ? lens[i] - lens[i - 1] : 0;
      maxY = Math.max(maxY, ys[i]);
      p = Math.max(p + PACE_MIN * step, maxY, Math.min(p + PACE * step, maxY + maxLag));
      out[i] = p;
    }
    paced.current = out;
    update();
  }, [geo, update]);

  useMotionValueEvent(scrollY, "change", update);

  useMotionValueEvent(drawn, "change", (v) => {
    geo?.nodes.forEach(({ el, at }) => el.toggleAttribute("data-lit", v >= at - 0.001));
  });

  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gate.set(1);
      return;
    }
    const c = animate(gate, 1, { duration: 1.8, delay: 0.5, ease: [0.65, 0, 0.35, 1] });
    return () => c.stop();
  }, [ready, gate]);

  return (
    <div ref={ref} className="relative">
      {geo && (
        <svg
          aria-hidden
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          fill="none"
          className="pointer-events-none absolute left-0 top-0 z-0"
        >
          <motion.path
            d={geo.d}
            stroke="rgb(var(--line))"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: drawn, opacity: visible }}
          />
        </svg>
      )}
      {children}
    </div>
  );
}
