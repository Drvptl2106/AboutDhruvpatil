"use client";

import { HoverExpand_001 } from "@/components/HoverExpand";
import LineFrame, { type Rel } from "@/components/LineFrame";
import Reveal from "@/components/Reveal";
import { work } from "@/lib/content";
import { clamp, LineBuilder } from "@/lib/linePath";

const OFF = 90; // just past a screen edge

/**
 * In at the top-left with a dip; up behind the title and out at its top-right;
 * a high run that sweeps down to the right and round along the bottom of a
 * circle, out through the right edge as if leaving; back in at the top-right,
 * down the circle's left side across its own earlier stretch and into the
 * strip's right side; behind the strip, out its left side, a slight turn and
 * out at the bottom-left.
 */
function workLine(rel: Rel, w: number, h: number) {
  const t = rel("[data-line-title]");
  const g = rel("[data-line-gallery]");
  // The round: a circle whose right side is just off-screen.
  const r = clamp(Math.min(w * 0.075, h * 0.13), 56, 128);
  const c = { x: w + r * 0.35 - r, y: g.top - r * 0.75 };
  const into = g.top + g.height * 0.58; // where it plugs into the strip
  const line = new LineBuilder({ x: -OFF, y: t.top + t.height * 0.15 }, { x: 1, y: 0.25 })
    .to({ x: t.left * 0.62, y: t.top + t.height * 0.66 }, { x: 1, y: 0 }, 0.42)
    .mark()
    .to({ x: t.right + 24, y: t.top + t.height * 0.04 }, { x: 1, y: -0.04 }, 0.42)
    .to({ x: w * 0.6, y: t.top + t.height * 0.1 }, { x: 1, y: 0.1 }, 0.42)
    // sweep down to the bottom of the round, then round the right side and out
    .to({ x: c.x, y: c.y + r }, { x: 1, y: 0 }, 0.42)
    .to({ x: c.x + r, y: c.y }, { x: 0, y: -1 }, 0.39)
    .to({ x: c.x, y: c.y - r }, { x: -1, y: 0 }, 0.39)
    .to({ x: c.x - r, y: c.y }, { x: 0, y: 1 }, 0.39)
    // down across the stretch it came in on, and into the strip
    .to({ x: c.x - r * 0.7, y: c.y + r * 1.9 }, { x: 0.15, y: 1 }, 0.42)
    .to({ x: g.right + 14, y: into }, { x: -1, y: 0 }, 0.45)
    .line({ x: g.left + 20, y: into })
    .to({ x: g.left - Math.min(g.left * 0.45, 140), y: into + g.height * 0.1 }, { x: -1, y: 0.3 }, 0.42)
    .to({ x: -OFF, y: g.bottom + h * 0.08 }, { x: -1, y: 0.75 }, 0.42)
    .build();
  return { d: line.d, entry: line.marks[0] };
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
