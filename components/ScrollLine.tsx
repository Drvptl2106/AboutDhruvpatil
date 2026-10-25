"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

/** Per section: the heading to underline + loop, and the block to run beside. */
type Stop = {
  heading: DOMRect;
  /** Top of the section header (label row), so the crossing stays above it. */
  top: number;
  pass?: { top: number; bottom: number; right: number };
};

const SAMPLES = 1200;
// The tip of the line tracks this point of the viewport (0 = top, 1 = bottom).
const TIP_AT = 0.62;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * One continuous stroke. For every section it slides in from the left edge as
 * an underline beneath the heading, loops at the heading's end, turns down
 * into the right-hand margin beside the section's content, then crosses the
 * gap above the next section, leaves the screen on the left and comes back in
 * as that heading's underline. It finishes at the top of `[data-line-end]`.
 */
function buildPath(w: number, stops: Stop[], end: Point) {
  const r = clamp(w * 0.035, 24, 48);
  const edge = Math.min(w * 0.04, 40);

  // A full circle that starts and ends at its bottom point, travelling right.
  const loop = ({ x, y }: Point) =>
    `C ${x + 1.33 * r} ${y}, ${x + 1.33 * r} ${y - 2 * r}, ${x} ${y - 2 * r} ` +
    `C ${x - 1.33 * r} ${y - 2 * r}, ${x - 1.33 * r} ${y}, ${x} ${y} `;

  let d = "";
  let p: Point | null = null;

  for (const stop of stops) {
    const h = stop.heading;
    const b = { x: clamp(h.right + r * 2, r * 1.6, w - r * 1.6), y: h.bottom + 18 };

    if (!p) {
      d += `M ${-r} ${b.y} `;
    } else {
      // Down the margin, then turn left across the gap above this section…
      const gapY = Math.max(p.y + r * 2, (p.y + stop.top) / 2);
      const t = clamp(gapY - p.y, r, 200);
      d += `L ${p.x} ${gapY - t} `;
      d += `C ${p.x} ${gapY - t * 0.45}, ${p.x - t * 0.45} ${gapY}, ${p.x - t} ${gapY} `;
      d += `L ${edge + r} ${gapY} `;
      // …out past the left edge and back in, level with the underline.
      const k = (b.y - gapY) * 0.7;
      d += `C ${edge - k} ${gapY}, ${edge - k} ${b.y}, ${edge + r} ${b.y} `;
    }
    d += `L ${b.x} ${b.y} `;
    d += loop(b);

    // Margin lane just right of the content (or hugging the screen edge).
    const right = stop.pass?.right ?? w * 0.9;
    const lane = clamp(right + Math.min((w - right) / 2, 72), b.x + r, w - 8);
    const turn = clamp(lane - b.x, r * 2, 240);
    d += `C ${b.x + (lane - b.x) * 0.6} ${b.y}, ${lane} ${b.y + turn * 0.4}, ${lane} ${b.y + turn} `;
    const bottom = Math.max(stop.pass?.bottom ?? 0, b.y + turn);
    d += `L ${lane} ${bottom} `;
    p = { x: lane, y: bottom };
  }

  if (p) {
    const k = (end.y - p.y) * 0.5;
    d += `C ${p.x} ${p.y + k}, ${end.x} ${end.y - k}, ${end.x} ${end.y}`;
  }
  return d;
}

/**
 * Wraps the page sections and draws a stroke behind them that grows with
 * scroll. Inspired by Skiper 19 (Skiper UI).
 */
export default function ScrollLine({
  children,
  ready,
}: {
  children: React.ReactNode;
  ready: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const lookup = useRef<{ ys: Float32Array; len: number } | null>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; stroke: number } | null>(null);

  const target = useMotionValue(0);
  const gate = useMotionValue(0);
  const drawn = useTransform<number, number>([target, gate], ([p, g]) => Math.min(p, g));
  const visible = useTransform(drawn, (v) => (v > 0.002 ? 1 : 0));
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const local = (r: DOMRect) =>
      new DOMRect(r.left - box.left, r.top - box.top, r.width, r.height);

    const stops: Stop[] = Array.from(el.querySelectorAll<HTMLElement>("[data-line-anchor]")).map((a) => {
      const section = a.closest("section");
      const passY = section?.querySelector<HTMLElement>("[data-line-pass]");
      const passX = section?.querySelector<HTMLElement>("[data-line-pass-x]") ?? passY;
      const y = passY && local(passY.getBoundingClientRect());
      const x = passX && local(passX.getBoundingClientRect());
      const header = a.closest("header") ?? a;
      return {
        heading: local(a.getBoundingClientRect()),
        top: local(header.getBoundingClientRect()).top,
        pass: y && x ? { top: y.top, bottom: y.bottom, right: x.right } : undefined,
      };
    });
    const endEl = el.querySelector<HTMLElement>("[data-line-end]");
    if (!stops.length || !endEl) return;
    const er = local(endEl.getBoundingClientRect());
    const end = { x: er.left + er.width / 2, y: er.top + 2 };

    const w = el.clientWidth;
    setGeo({ w, h: el.scrollHeight, d: buildPath(w, stops, end), stroke: w < 768 ? 8 : 12 });
  }, []);

  const update = useCallback(() => {
    const el = ref.current;
    const lu = lookup.current;
    if (!el || !lu) return;
    const y = window.innerHeight * TIP_AT - el.getBoundingClientRect().top;
    // First sample whose (running-max) y reaches the tip line.
    let lo = 0;
    let hi = SAMPLES;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (lu.ys[mid] < y) lo = mid + 1;
      else hi = mid;
    }
    target.set(lo / SAMPLES);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  // Sample the path once per layout so scroll → length is a cheap lookup.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!geo || !path) return;
    const len = path.getTotalLength();
    const ys = new Float32Array(SAMPLES + 1);
    let max = -Infinity;
    for (let i = 0; i <= SAMPLES; i++) {
      max = Math.max(max, path.getPointAtLength((len * i) / SAMPLES).y);
      ys[i] = max;
    }
    lookup.current = { ys, len };
    update();
  }, [geo, update]);

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gate.set(1);
      return;
    }
    const controls = animate(gate, 1, { duration: 2.4, delay: 0.6, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [ready, gate]);

  // Keep the glowing dot on the tip of the stroke.
  useMotionValueEvent(drawn, "change", (v) => {
    const path = pathRef.current;
    const tip = tipRef.current;
    const lu = lookup.current;
    if (!path || !tip || !lu) return;
    const p = path.getPointAtLength(v * lu.len);
    tip.setAttribute("cx", String(p.x));
    tip.setAttribute("cy", String(p.y));
  });

  return (
    <div ref={ref} className="relative">
      {geo && (
        <svg
          aria-hidden
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          fill="none"
          className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
        >
          <motion.path
            ref={pathRef}
            d={geo.d}
            stroke="rgb(var(--accent))"
            strokeWidth={geo.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: drawn, opacity: visible }}
          />
          <motion.circle
            ref={tipRef}
            r={geo.stroke * 0.9}
            fill="rgb(var(--accent))"
            style={{ opacity: visible, filter: "drop-shadow(0 0 12px rgb(var(--accent)))" }}
          />
        </svg>
      )}
      {children}
    </div>
  );
}
