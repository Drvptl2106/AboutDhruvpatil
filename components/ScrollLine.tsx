"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

const SAMPLES = 1000;
// The tip of the line tracks this point of the viewport (0 = top, 1 = bottom).
const TIP_AT = 0.62;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Build one continuous stroke: drop in from the top, loop beside every
 * `[data-line-anchor]` heading, swing across the page between them, and
 * end at the top of `[data-line-end]`.
 */
function buildPath(w: number, anchors: Point[], end: Point) {
  const r = clamp(w * 0.04, 26, 52);
  const kx = Math.min(r * 4, w * 0.12);
  const loops = anchors.map((a) => ({ x: clamp(a.x + r * 2.4, r * 1.6, w - r * 1.6), y: a.y }));

  // A full circle that starts and ends at its bottom point, travelling right.
  const loop = ({ x, y }: Point) =>
    `C ${x + 1.33 * r} ${y + r}, ${x + 1.33 * r} ${y - r}, ${x} ${y - r} ` +
    `C ${x - 1.33 * r} ${y - r}, ${x - 1.33 * r} ${y + r}, ${x} ${y + r} `;

  const startX = w * 0.9;
  const first = loops[0];
  let d = `M ${startX} 0 C ${startX} ${first.y * 0.6}, ${first.x - kx} ${first.y + r}, ${first.x} ${first.y + r} `;
  d += loop(first);

  for (let i = 1; i < loops.length; i++) {
    const a = loops[i - 1];
    const b = loops[i];
    const side = i % 2 === 1 ? w * 0.06 : w * 0.94;
    const midY = (a.y + b.y) / 2 + r;
    const k = (b.y - a.y) * 0.3;
    d += `C ${a.x + kx} ${a.y + r}, ${side} ${midY - k}, ${side} ${midY} `;
    d += `C ${side} ${midY + k}, ${b.x - kx} ${b.y + r}, ${b.x} ${b.y + r} `;
    d += loop(b);
  }

  const last = loops[loops.length - 1];
  const k = (end.y - last.y) * 0.5;
  d += `C ${last.x + kx} ${last.y + r}, ${end.x} ${end.y - k}, ${end.x} ${end.y}`;
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
  const smooth = useSpring(target, { stiffness: 90, damping: 26, restDelta: 0.0001 });
  const gate = useMotionValue(0);
  const drawn = useTransform<number, number>([smooth, gate], ([p, g]) => Math.min(p, g));
  const visible = useTransform(drawn, (v) => (v > 0.002 ? 1 : 0));
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const rel = (r: DOMRect, x: number) => ({ x: x - box.left, y: r.top + r.height / 2 - box.top });

    const anchors = Array.from(el.querySelectorAll<HTMLElement>("[data-line-anchor]")).map((a) => {
      const r = a.getBoundingClientRect();
      return rel(r, r.right);
    });
    const endEl = el.querySelector<HTMLElement>("[data-line-end]");
    if (!anchors.length || !endEl) return;
    const er = endEl.getBoundingClientRect();
    const end = { x: er.left + er.width / 2 - box.left, y: er.top - box.top + 2 };

    const w = el.clientWidth;
    setGeo({ w, h: el.scrollHeight, d: buildPath(w, anchors, end), stroke: w < 768 ? 9 : 14 });
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
