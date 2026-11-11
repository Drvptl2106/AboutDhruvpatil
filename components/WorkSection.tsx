"use client";

import { HoverExpand_001 } from "@/components/HoverExpand";
import LineFrame, { type Rel } from "@/components/LineFrame";
import Reveal from "@/components/Reveal";
import { work } from "@/lib/content";
import { clamp, cornerRadius, fractionAt, LineBuilder, OFF } from "@/lib/linePath";

/**
 * Down from the top centre, a turn right level with the title, along to the
 * right of the strip, down, and back left into the strip's side. Behind the
 * strip it runs to the centre and turns down, leaving through the strip's
 * foot and the bottom centre.
 */
function workLine(rel: Rel, w: number, h: number) {
  const t = rel("[data-line-title]");
  const g = rel("[data-line-gallery]");
  const r = cornerRadius(w, h);
  const x = w / 2;
  const level = Math.max(t.top + t.height * 0.5, 84 + r);
  const lane = Math.min(g.right + r + 24, w - 24);
  const into = g.top + g.height * 0.58; // where it plugs into the strip
  const line = new LineBuilder({ x, y: -OFF }, { x: 0, y: 1 })
    .round(
      [
        { x, y: level },
        { x: lane, y: level },
        // Tighter where the strip sits close to the screen edge.
        { x: lane, y: into, r: clamp(lane - g.right - 10, 18, r) },
        { x, y: into },
        { x, y: h + OFF },
      ],
      r,
    )
    .build();
  // The drop, first corner and first run draw while the scene scrolls in, so
  // the line is already moving when it takes over from the scene above.
  return { d: line.d, entry: fractionAt(line.flat, { x: lane, y: level }) };
}

/** Title + project strip; the line weaves behind both. */
export default function WorkSection({ show }: { show: boolean }) {
  return (
    <LineFrame id="work" length={180} build={workLine} show={show}>
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
