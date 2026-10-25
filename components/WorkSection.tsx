"use client";

import { HoverExpand_001 } from "@/components/HoverExpand";
import LineFrame, { type Rel } from "@/components/LineFrame";
import Reveal from "@/components/Reveal";
import { work } from "@/lib/content";
import { clamp, LineBuilder } from "@/lib/linePath";

const OFF = 80; // just past a screen edge

/**
 * In at the top-left, behind the title, across and out on the right as if
 * leaving; round off-screen and back in at the top-right into a full circle;
 * down across its own earlier stretch into the strip's right side; behind the
 * strip, out its left side, a slight turn and out at the bottom-left.
 */
function workLine(rel: Rel, w: number, h: number) {
  const t = rel("[data-line-title]");
  const g = rel("[data-line-gallery]");
  const R = clamp(w * 0.075, 48, 120);
  const line = new LineBuilder({ x: -OFF, y: t.top + t.height * 0.2 }, { x: 1, y: 0.18 })
    .to({ x: t.left + t.width * 0.45, y: t.top + t.height * 0.5 }, { x: 1, y: 0 })
    .mark()
    .to({ x: w * 0.68, y: t.top + t.height * 0.05 }, { x: 1, y: 0 }, 0.42)
    .to({ x: w + OFF * 0.6, y: g.top + g.height * 0.05 }, { x: 0.55, y: 1 }, 0.42)
    // off-screen: it only pretends to leave
    .to({ x: w + OFF * 1.4, y: t.top - h * 0.02 }, { x: 0, y: -1 }, 0.5)
    .to({ x: w - R * 0.6, y: Math.max(R * 0.3, t.top - h * 0.1) }, { x: -1, y: 0 }, 0.5)
    .circle(R, 1, "left")
    .to({ x: g.right + 10, y: g.top + g.height * 0.55 }, { x: -1, y: 0.1 }, 0.36)
    .line({ x: g.left + 20, y: g.top + g.height * 0.55 })
    .to({ x: g.left - Math.min(g.left * 0.4, 120), y: g.top + g.height * 0.66 }, { x: -1, y: 0.35 }, 0.4)
    .to({ x: -OFF, y: g.bottom + h * 0.06 }, { x: -1, y: 0.6 }, 0.4)
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
