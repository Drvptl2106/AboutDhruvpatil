"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { HoverExpand_001 } from "@/components/HoverExpand";
import Reveal from "@/components/Reveal";
import { work } from "@/lib/content";
import { clamp, loop, type Point, toPath } from "@/lib/linePath";

/**
 * The line's route around the frame, in stage coordinates: in from the left,
 * behind the project strip, out on the right into a loop, then back across
 * behind the title card and off the left edge.
 */
function frameRoute(stage: HTMLElement) {
  const box = stage.getBoundingClientRect();
  const rect = (sel: string) => {
    const b = stage.querySelector(sel)!.getBoundingClientRect();
    return new DOMRect(b.left - box.left, b.top - box.top, b.width, b.height);
  };
  const w = box.width;
  const card = rect("[data-line-card]");
  const g = rect("[data-line-gallery]");
  const off = 60;
  const side = w - g.right;
  const R = clamp(Math.min(side * 0.34, (g.top - card.top) * 0.62), 46, 150);
  const L = { x: Math.min(w - side * 0.5, w - R * 1.75), y: (card.bottom + g.top) / 2 - R * 0.2 };

  const pts: Point[] = [
    { x: -off, y: g.top + g.height * 0.82 },
    { x: g.left * 0.5, y: g.top + g.height * 0.45 },
    { x: g.left + 40, y: g.top + g.height * 0.32 },
    { x: g.right - 40, y: g.top + g.height * 0.52 },
    { x: g.right + side * 0.22, y: g.top + g.height * 0.5 },
    { x: L.x - R * 0.2, y: L.y + R * 1.35 },
    // 1½ turns from the bottom: ends on top, heading left.
    ...loop(L, R, 1.5, -1, Math.PI / 2, 0.55),
    { x: card.right + 60, y: card.top + card.height * 0.32 },
    { x: card.right - 40, y: card.top + card.height * 0.38 },
    { x: card.left + 40, y: card.top + card.height * 0.5 },
    { x: card.left - 70, y: card.top + card.height * 0.48 },
    { x: -off, y: card.top + card.height * 0.2 },
  ];
  return { w, h: box.height, d: toPath(pts).d, stroke: w < 768 ? 8 : 12 };
}

/**
 * Title card + project strip. The frame holds still for a while as you scroll
 * and its own line plays out in step with the scroll (Skiper 19's
 * scroll → pathLength), weaving behind the card and the strip.
 */
export default function WorkSection({ show }: { show: boolean }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<ReturnType<typeof frameRoute> | null>(null);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const byScroll = useTransform(scrollYProgress, [0, 0.9], [0.07, 1], { clamp: true });
  const gate = useMotionValue(0);
  const pathLength = useTransform<number, number>([byScroll, gate], ([s, g]) => Math.min(s, g));
  const opacity = useTransform(pathLength, (v) => (v > 0.001 ? 1 : 0));

  const frame = useRef(0);
  const measure = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => stage.current && setGeo(frameRoute(stage.current)));
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll("[data-line-card], [data-line-gallery]").forEach((n) => ro.observe(n));
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  // Draw in the first stretch once the intro hands over.
  useEffect(() => {
    if (!show) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gate.set(1);
      return;
    }
    const c = animate(gate, 1, { duration: 1.6, delay: 0.8, ease: [0.65, 0, 0.35, 1] });
    return () => c.stop();
  }, [show, gate]);

  return (
    <section ref={section} id="work" className="relative z-10 h-[220svh] w-full">
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
              strokeWidth={geo.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength, opacity }}
            />
          </svg>
        )}

        <div className="relative flex h-full flex-col items-center justify-center gap-6 pt-14 md:gap-12 md:pt-10">
          <div
            data-line-card
            className="w-[min(80%,30rem)] rounded-2xl border border-ink/10 bg-paper px-6 pb-5 pt-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.25)] md:px-9"
          >
            <Reveal show={show} delay={0.15} className="text-[10px] uppercase tracking-[0.3em] text-subtle">
              (01) — Selected work
            </Reveal>
            <div className="mt-3 h-px bg-ink/10" />
            <h2 className="mt-3 font-serif text-[clamp(2.75rem,8vw,6rem)] font-normal leading-[0.95] tracking-[-0.03em]">
              <Reveal show={show} delay={0.3} className="-mb-[0.14em] pb-[0.14em]">
                My <em className="italic text-muted">Work</em>
              </Reveal>
            </h2>
            <Reveal show={show} delay={0.5} className="mt-3">
              <p className="text-xs text-subtle">Hover to open a project.</p>
            </Reveal>
          </div>

          <HoverExpand_001 images={work} show={show} />
        </div>
      </div>
    </section>
  );
}
