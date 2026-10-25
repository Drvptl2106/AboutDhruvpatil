"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

// The tip of the line tracks this point of the viewport (0 = top, 1 = bottom).
const TIP_AT = 0.65;
// Minimum scroll (px) spent per px of line, so sideways runs and loops draw
// gradually instead of appearing all at once.
const PACE = 0.32;
const TAU = Math.PI * 2;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * A hand-drawn loop: 1–2 revolutions whose radius wobbles and whose centre
 * drifts, like the scribbles in Skiper 19. Starts at angle `start`.
 */
function scribble(c: Point, r: number, turns: number, dir: 1 | -1, start: number, seed: number): Point[] {
  const n = Math.ceil(turns * 16);
  const pts: Point[] = [];
  for (let k = 1; k <= n; k++) {
    const t = k / n;
    const a = start + dir * t * turns * TAU;
    const rr = r * (1 + 0.2 * Math.sin(a * 2.3 + seed) - 0.15 * t);
    pts.push({ x: c.x + rr * 1.1 * Math.cos(a) + t * r * 0.6, y: c.y + rr * Math.sin(a) + t * r * 0.15 });
  }
  return pts;
}

type Flat = { xs: Float32Array; ys: Float32Array; lens: Float32Array; total: number };

const FLAT_STEPS = 12;

/**
 * Smooth curve through every point (centripetal Catmull-Rom → cubic Béziers).
 * Also returns the curve flattened into a polyline so scroll lookups don't
 * need the (slow) SVG getPointAtLength.
 */
function toPath(pts: Point[]): { d: string; flat: Flat } {
  const n = Math.max(pts.length - 1, 0) * FLAT_STEPS + 1;
  const flat: Flat = { xs: new Float32Array(n), ys: new Float32Array(n), lens: new Float32Array(n), total: 0 };
  if (pts.length < 2) return { d: "", flat };
  flat.xs[0] = pts[0].x;
  flat.ys[0] = pts[0].y;
  let k = 1;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const d1 = Math.sqrt(dist(p0, p1));
    const d2 = Math.sqrt(dist(p1, p2)) || 1e-3;
    const d3 = Math.sqrt(dist(p2, p3));
    const c1 =
      d1 < 1e-3
        ? p1
        : {
            x: (d1 * d1 * p2.x - d2 * d2 * p0.x + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.x) / (3 * d1 * (d1 + d2)),
            y: (d1 * d1 * p2.y - d2 * d2 * p0.y + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.y) / (3 * d1 * (d1 + d2)),
          };
    const c2 =
      d3 < 1e-3
        ? p2
        : {
            x: (d3 * d3 * p1.x - d2 * d2 * p3.x + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.x) / (3 * d3 * (d3 + d2)),
            y: (d3 * d3 * p1.y - d2 * d2 * p3.y + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.y) / (3 * d3 * (d3 + d2)),
          };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    for (let j = 1; j <= FLAT_STEPS; j++, k++) {
      const t = j / FLAT_STEPS;
      const u = 1 - t;
      const a = u * u * u;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const e = t * t * t;
      flat.xs[k] = a * p1.x + b * c1.x + c * c2.x + e * p2.x;
      flat.ys[k] = a * p1.y + b * c1.y + c * c2.y + e * p2.y;
      flat.lens[k] = flat.lens[k - 1] + Math.hypot(flat.xs[k] - flat.xs[k - 1], flat.ys[k] - flat.ys[k - 1]);
    }
  }
  flat.total = flat.lens[n - 1];
  return { d, flat };
}

/**
 * Walk the page's `[data-line-step]` blocks in order and lay out the route:
 *  - work:     underline the heading from the left edge, scribble a loop, run
 *              down the right side and plug into the project strip's right
 *              edge; hidden behind it, then out of its left side.
 *  - zone:     an empty screen — wander off an edge, loop, come back.
 *  - timeline: underline + loop, then become the spine through every node.
 *  - about:    underline + loop, down beside the statement, behind the
 *              artist wall and out of its bottom.
 *  - crowd:    finish by circling the `[data-line-final]` word.
 */
function route(root: HTMLElement) {
  const box = root.getBoundingClientRect();
  const w = root.clientWidth;
  const r = clamp(w * 0.035, 26, 56);
  const R = clamp(w * 0.1, 60, 170);
  const off = r * 2.5; // just past either screen edge
  const rect = (el: Element) => {
    const b = el.getBoundingClientRect();
    return new DOMRect(b.left - box.left, b.top - box.top, b.width, b.height);
  };
  const pts: Point[] = [];
  const nodes: { el: HTMLElement; at: Point }[] = [];
  const last = () => pts[pts.length - 1];
  let zone = 0;
  let seed = 1;

  const underlineAndLoop = (h: DOMRect) => {
    const y = h.bottom + 16;
    pts.push({ x: -off, y }, { x: h.left - 8, y }, { x: h.right - 8, y });
    const cx = clamp(h.right + r * 0.9, r * 1.6, w - r * 2.2);
    pts.push(...scribble({ x: cx, y: y - r }, r, 1.75, -1, Math.PI / 2, seed++));
    return y;
  };
  const laneRightOf = (right: number) => clamp(right + Math.min((w - right) / 2, 72), 0, w - 12);

  root.querySelectorAll<HTMLElement>("[data-line-step]").forEach((step) => {
    const kind = step.dataset.lineStep;
    const q = (s: string) => step.querySelector<HTMLElement>(s);
    const heading = q("[data-line-anchor]");

    if (kind === "work" && heading) {
      const y = underlineAndLoop(rect(heading));
      const g = rect(q("[data-line-gallery]")!);
      const gm = g.top + g.height * 0.45;
      const lane = laneRightOf(g.right);
      pts.push(
        { x: lane, y: y + (gm - y) * 0.35 },
        { x: lane, y: gm - r * 1.4 },
        { x: Math.min(g.right + r * 0.4, lane - 6), y: gm },
        { x: g.right - 24, y: gm + 4 },
        { x: g.left + 24, y: gm + 40 },
        { x: g.left - r, y: gm + 70 },
      );
    } else if (kind === "zone") {
      const z = rect(step);
      const at = (fx: number, fy: number) => ({ x: w * fx, y: z.top + z.height * fy });
      const v = zone++ % 3;
      if (v === 0) {
        pts.push({ x: -off, y: z.top + z.height * 0.12 }, at(0.14, 0.34));
        pts.push(...scribble(at(0.52, 0.5), R, 1.8, -1, Math.PI, seed++));
        pts.push(at(0.8, 0.68), { x: -off, y: z.top + z.height * 0.93 });
      } else if (v === 1) {
        pts.push({ x: w + off, y: z.top + z.height * 0.16 }, at(0.84, 0.36));
        pts.push(...scribble(at(0.44, 0.52), R, 1.6, 1, 0, seed++));
        pts.push(at(0.22, 0.72), { x: -off, y: z.top + z.height * 0.93 });
      } else {
        pts.push(at(0.16, 0.2));
        pts.push(...scribble(at(0.3, 0.36), R * 0.8, 1.5, -1, Math.PI, seed++));
        pts.push(at(0.68, 0.54));
        pts.push(...scribble(at(0.72, 0.64), R * 0.6, 1.4, 1, -Math.PI / 2, seed++));
        pts.push({ x: -off, y: z.top + z.height * 0.93 });
      }
    } else if (kind === "timeline" && heading) {
      const y = underlineAndLoop(rect(heading));
      const spine = rect(q("[data-line-spine]")!);
      const dots = Array.from(step.querySelectorAll<HTMLElement>("[data-line-node]"));
      const x = dots.length ? rect(dots[0]).left + rect(dots[0]).width / 2 : spine.left + spine.width / 2;
      pts.push({ x: (last().x + x) / 2, y: (y + spine.top) / 2 + r * 0.5 }, { x, y: spine.top - r * 0.6 });
      for (const el of dots) {
        const d = rect(el);
        const at = { x, y: d.top + d.height / 2 };
        pts.push(at);
        nodes.push({ el, at });
      }
      pts.push({ x, y: spine.bottom + r });
    } else if (kind === "about" && heading) {
      const y = underlineAndLoop(rect(heading));
      const text = rect(q("[data-line-pass]")!);
      const wall = rect(q("[data-line-wall]")!);
      const lane = laneRightOf(text.right);
      pts.push(
        { x: lane, y: Math.max(y + r * 3, text.top + r) },
        { x: lane, y: text.bottom },
        { x: w * 0.55, y: (text.bottom + wall.top) / 2 + r },
        { x: w * 0.5, y: wall.top + 40 },
        { x: w * 0.5, y: wall.bottom - 40 },
        { x: w * 0.5, y: wall.bottom + r * 2 },
      );
    } else if (kind === "crowd") {
      const word = rect(q("[data-line-final]")!);
      const c = { x: word.left + word.width / 2, y: word.top + word.height * 0.55 };
      const rx = word.width / 2 + r * 0.8;
      const ry = word.height / 2 + r * 0.25;
      // Come in from the right side rather than across the first line of text.
      const side = Math.min(Math.max(c.x + rx * 1.8, w * 0.88), w - 16);
      pts.push({ x: side, y: (last().y + word.top) / 2 }, { x: side, y: c.y - ry * 0.9 });
      // Circle the word ~1.3 times, like a pen mark.
      const n = 28;
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        const a = -Math.PI * 0.3 + t * 1.3 * TAU;
        const wob = 1 + 0.06 * Math.sin(a * 3 + 1) - 0.08 * t;
        pts.push({ x: c.x + rx * wob * Math.cos(a), y: c.y + ry * wob * Math.sin(a) });
      }
    }
  });

  const { d, flat } = toPath(pts);
  return { w, h: root.scrollHeight, d, flat, stroke: w < 768 ? 10 : 16, nodes };
}

/**
 * Wraps the page and draws one stroke behind it that grows with scroll.
 * Inspired by Skiper 19 (Skiper UI).
 */
export default function ScrollLine({ children, ready }: { children: React.ReactNode; ready: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const lookup = useRef<{ paced: Float32Array; nodeLens: { el: HTMLElement; at: number }[] } | null>(null);
  const [geo, setGeo] = useState<ReturnType<typeof route> | null>(null);

  const target = useMotionValue(0);
  const gate = useMotionValue(0);
  const drawn = useTransform<number, number>([target, gate], ([p, g]) => Math.min(p, g));
  const visible = useTransform(drawn, (v) => (v > 0.001 ? 1 : 0));
  const { scrollY } = useScroll();

  // Batched to at most once per frame — layout shifts can come in bursts.
  const frame = useRef(0);
  const measure = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (ref.current) setGeo(route(ref.current));
    });
  }, []);

  const update = useCallback(() => {
    const el = ref.current;
    const lu = lookup.current;
    if (!el || !lu || !geo) return;
    const y = window.innerHeight * TIP_AT - el.getBoundingClientRect().top;
    // First point whose paced y reaches the tip line.
    let lo = 0;
    let hi = lu.paced.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (lu.paced[mid] < y) lo = mid + 1;
      else hi = mid;
    }
    target.set(geo.flat.total ? geo.flat.lens[lo] / geo.flat.total : 0);
  }, [target, geo]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  // Re-measure once the intro's reveal animations have settled.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(measure, 1800);
    return () => clearTimeout(t);
  }, [ready, measure]);

  // Once per layout: for each point on the line, the scroll position (as a
  // tip y) at which it gets drawn.
  useLayoutEffect(() => {
    if (!geo) return;
    const { xs, ys, lens, total } = geo.flat;
    const paced = new Float32Array(ys.length);
    // Lag is capped so the tip never drifts off the top of the screen.
    const maxLag = window.innerHeight * 0.35;
    let maxY = -Infinity;
    let p = -Infinity;
    for (let i = 0; i < ys.length; i++) {
      const step = i ? lens[i] - lens[i - 1] : 0;
      maxY = Math.max(maxY, ys[i]);
      // Follow the page, but never faster than PACE allows.
      p = Math.max(maxY, Math.min(p + PACE * step, maxY + maxLag));
      paced[i] = p;
    }
    const nodeLens = geo.nodes.map(({ el, at }) => {
      let best = Infinity;
      let len = 0;
      for (let i = 0; i < ys.length; i++) {
        const d = Math.hypot(xs[i] - at.x, ys[i] - at.y);
        if (d < best) {
          best = d;
          len = lens[i];
        }
      }
      return { el, at: total ? len / total : 0 };
    });
    lookup.current = { paced, nodeLens };
    update();
  }, [geo, update]);

  useMotionValueEvent(scrollY, "change", update);

  // Light the timeline nodes the line has reached.
  useMotionValueEvent(drawn, "change", (v) => {
    lookup.current?.nodeLens.forEach(({ el, at }) => el.toggleAttribute("data-lit", v >= at - 0.001));
  });

  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gate.set(1);
      return;
    }
    const controls = animate(gate, 1, { duration: 2.4, delay: 0.6, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
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
          className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
        >
          <motion.path
            d={geo.d}
            stroke="rgb(var(--accent))"
            strokeWidth={geo.stroke}
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
