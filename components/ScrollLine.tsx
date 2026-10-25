"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { clamp, loop, type Point, TAU, toPath } from "@/lib/linePath";

// The tip of the line tracks this point of the viewport (0 = top, 1 = bottom).
const TIP_AT = 0.65;
// Scroll (px) spent per px of line, so sideways runs and loops draw
// gradually instead of appearing all at once. Never less than PACE_MIN,
// even when the line is already trailing as far as it may.
const PACE = 0.32;
const PACE_MIN = 0.08;

/**
 * Walk the page's `[data-line-step]` blocks in order and lay out the route:
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

  // Continue straight down from wherever the previous scene's line left
  // (the Experience spine).
  const handoff = document.querySelector("[data-line-handoff]");
  if (handoff) {
    const h = rect(handoff);
    pts.push({ x: h.left + h.width / 2, y: -40 });
  }

  const underlineAndLoop = (h: DOMRect) => {
    const y = h.bottom + 16;
    pts.push({ x: -off, y }, { x: h.left - 8, y }, { x: h.right - 8, y });
    const cx = clamp(h.right + r * 0.9, r * 1.6, w - r * 2.2);
    pts.push(...loop({ x: cx, y: y - r }, r, 1.75, -1, Math.PI / 2));
    return y;
  };
  const laneRightOf = (right: number) => clamp(right + Math.min((w - right) / 2, 72), 0, w - 12);

  root.querySelectorAll<HTMLElement>("[data-line-step]").forEach((step) => {
    const kind = step.dataset.lineStep;
    const q = (s: string) => step.querySelector<HTMLElement>(s);
    const heading = q("[data-line-anchor]");

    if (kind === "zone") {
      const z = rect(step);
      const at = (fx: number, fy: number) => ({ x: w * fx, y: z.top + z.height * fy });
      const v = zone++ % 3;
      if (v === 0) {
        pts.push({ x: -off, y: z.top + z.height * 0.12 }, at(0.14, 0.34));
        pts.push(...loop(at(0.52, 0.5), R, 1.8, -1, Math.PI));
        pts.push(at(0.8, 0.68), { x: -off, y: z.top + z.height * 0.93 });
      } else if (v === 1) {
        pts.push({ x: w + off, y: z.top + z.height * 0.16 }, at(0.84, 0.36));
        pts.push(...loop(at(0.44, 0.52), R, 1.6, 1, 0));
        pts.push(at(0.22, 0.72), { x: -off, y: z.top + z.height * 0.93 });
      } else {
        pts.push(at(0.16, 0.2));
        pts.push(...loop(at(0.3, 0.36), R * 0.8, 1.5, -1, Math.PI));
        pts.push(at(0.68, 0.54));
        pts.push(...loop(at(0.72, 0.64), R * 0.6, 1.4, 1, -Math.PI / 2));
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
  return { w, h: root.scrollHeight, d, flat, stroke: w < 768 ? 8 : 12, nodes };
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
    // First point whose paced y reaches the tip line…
    const { paced } = lu;
    const { lens, total } = geo.flat;
    let lo = 0;
    let hi = paced.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (paced[mid] < y) lo = mid + 1;
      else hi = mid;
    }
    // …then interpolate from the previous one, so the line grows with every
    // pixel of scroll instead of jumping point to point.
    let len = lens[lo];
    if (lo > 0 && paced[lo] > paced[lo - 1]) {
      const t = clamp((y - paced[lo - 1]) / (paced[lo] - paced[lo - 1]), 0, 1);
      len = lens[lo - 1] + (lens[lo] - lens[lo - 1]) * t;
    }
    target.set(total ? len / total : 0);
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
      // Follow the page, never faster than PACE allows, and always spend at
      // least PACE_MIN — so no stretch is ever drawn in one jump.
      p = Math.max(p + PACE_MIN * step, maxY, Math.min(p + PACE * step, maxY + maxLag));
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
