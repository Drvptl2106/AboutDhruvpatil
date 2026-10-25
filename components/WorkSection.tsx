"use client";

import { HoverExpand_001 } from "@/components/HoverExpand";
import LineFrame, { type Rel } from "@/components/LineFrame";
import Reveal from "@/components/Reveal";
import { work } from "@/lib/content";
import { toPath } from "@/lib/linePath";

const OFF = 70; // just past a screen edge

/**
 * In at the top-left, behind the title, out on the right as if leaving; back
 * in at the top-right, round and down across its own earlier stretch, into
 * the strip's right side; behind the strip, out its left side, a slight turn
 * and out at the bottom-left.
 */
function workLine(rel: Rel, w: number, h: number) {
  const t = rel("[data-line-title]");
  const g = rel("[data-line-gallery]");
  const side = w - g.right;
  const rx = (f: number) => g.right + side * f;
  const d = toPath([
    { x: -OFF, y: t.top + t.height * 0.3 },
    { x: t.left * 0.55, y: t.top + t.height * 0.55 },
    { x: t.left + 10, y: t.top + t.height * 0.42 },
    { x: t.right - 10, y: t.top + t.height * 0.15 },
    { x: t.right + (g.right - t.right) * 0.45, y: t.top + t.height * 0.2 },
    { x: rx(0.12), y: t.top + t.height * 0.65 },
    { x: rx(0.7), y: g.top - h * 0.02 },
    { x: w + OFF, y: g.top + h * 0.01 },
    // Off-screen turn: it only pretends to leave.
    { x: w + OFF * 1.8, y: (t.top + g.top) / 2 },
    { x: w + OFF, y: t.top - h * 0.03 },
    { x: rx(0.85), y: t.top + h * 0.005 },
    { x: rx(0.56), y: t.top + t.height * 0.28 },
    { x: rx(0.46), y: t.top + t.height * 0.72 },
    { x: rx(0.6), y: g.top + h * 0.01 },
    { x: rx(0.56), y: g.top + g.height * 0.3 },
    { x: g.right + 24, y: g.top + g.height * 0.55 },
    { x: g.right - 30, y: g.top + g.height * 0.56 },
    { x: g.left + 30, y: g.top + g.height * 0.5 },
    { x: g.left - 20, y: g.top + g.height * 0.48 },
    { x: g.left * 0.4, y: g.top + g.height * 0.62 },
    { x: -OFF, y: g.bottom + h * 0.06 },
  ]).d;
  return { d };
}

/** Title + project strip; the line weaves behind both. */
export default function WorkSection({ show }: { show: boolean }) {
  return (
    <LineFrame id="work" length={230} build={workLine} show={show}>
      <div className="flex h-full items-center justify-center pt-10">
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <div data-line-title className="px-5">
            <Reveal show={show} delay={0.15} className="text-[10px] uppercase tracking-[0.3em] text-subtle">
              (01) — Selected work
            </Reveal>
            <h2 className="mt-2 font-serif text-[clamp(2.75rem,7vw,6rem)] font-normal leading-[0.95] tracking-[-0.03em]">
              <Reveal show={show} delay={0.3} className="-mb-[0.14em] pb-[0.14em]">
                My <em className="italic text-muted">Work</em>
              </Reveal>
            </h2>
          </div>
          <HoverExpand_001 images={work} show={show} />
        </div>
      </div>
    </LineFrame>
  );
}
