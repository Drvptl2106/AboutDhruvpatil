"use client";

import LineFrame, { type Rel } from "@/components/LineFrame";
import { education, experience, type TimelineItem } from "@/lib/content";
import { cornerRadius, fractionAt, LineBuilder, OFF } from "@/lib/linePath";

/**
 * Down from the top centre, a turn left above the label, down beside the
 * heading, back to the centre beneath it and down into the spine: straight
 * through every dot and out at the bottom centre.
 */
function journeyRoute(rel: Rel, w: number, h: number, stage: HTMLElement) {
  const e = rel("[data-line-anchor]");
  const label = rel("[data-line-label]");
  const dots = Array.from(stage.querySelectorAll<HTMLElement>("[data-line-node]"));
  const dotY = dots.map((_, i) => {
    const d = rel(`[data-line-node="${i}"]`);
    return d.top + d.height / 2;
  });
  const r = cornerRadius(w, h);
  const x = w / 2;
  const above = Math.max(label.top - 44, 76);
  const side = Math.max(e.left - 72, 28);
  const under = e.bottom + (dotY[0] - e.bottom) * 0.42;
  const b = new LineBuilder({ x, y: -OFF }, { x: 0, y: 1 })
    .round(
      [
        { x, y: above },
        { x: side, y: above },
        { x: side, y: under },
        { x, y: under, r: Math.min(r, dotY[0] - under - 10) },
        { x, y: dotY[0] },
      ],
      r,
    );
  for (const y of dotY.slice(1)) b.line({ x, y });
  const line = b.line({ x, y: h + OFF }).build();
  return {
    d: line.d,
    // The drop, first corner and first run draw while the scene scrolls in.
    entry: fractionAt(line.flat, { x: side, y: above }),
    nodes: dots.map((el, i) => ({ el, at: fractionAt(line.flat, { x, y: dotY[i] }) })),
  };
}

/** One side of a row: what it was, when, where. */
function Entry({ kind, item, side }: { kind: string; item?: TimelineItem; side: "left" | "right" }) {
  if (!item) return <div />;
  return (
    <div className={side === "left" ? "flex flex-col items-end text-right" : ""}>
      <p className="text-[10px] uppercase tracking-[0.25em] text-subtle">
        {kind} · {item.period}
      </p>
      <h3 className="mt-1 font-serif text-2xl leading-tight lg:text-3xl">{item.title}</h3>
      <p className="mt-0.5 text-sm text-muted">{item.place}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-subtle">{item.detail}</p>
    </div>
  );
}

/**
 * Experience and Education in one scene: work on the left of the spine,
 * study on the right, the line running down between them.
 */
export default function JourneyFrame() {
  const rows = Array.from({ length: Math.max(experience.length, education.length) }, (_, i) => i);
  return (
    <LineFrame id="experience" length={190} build={journeyRoute}>
      <div className="flex h-full flex-col items-center justify-center px-5 pt-[14svh] md:pt-[20svh]">
        <p data-line-label className="text-[11px] uppercase tracking-[0.3em] text-subtle">
          (02) — Experience &amp; Education
        </p>
        <h2
          data-line-anchor
          className="mt-4 w-fit font-serif text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.92] tracking-[-0.03em]"
        >
          My <em className="italic text-muted">Journey</em>
        </h2>

        <ol className="mt-24 flex w-full max-w-5xl flex-col gap-7">
          {rows.map((i) => (
            <li key={i} className="grid grid-cols-[1fr_6rem_1fr] items-start">
              <Entry kind="Experience" item={experience[i]} side="left" />
              {/* Sits level with the row's titles; a ring on the line once lit. */}
              <div className="flex justify-center pt-[30px]">
                <span
                  data-line-node={i}
                  className="block size-4 rounded-full border-2 border-subtle bg-paper transition-all duration-500 data-[lit]:scale-125 data-[lit]:border-[3px] data-[lit]:border-line"
                />
              </div>
              <Entry kind="Education" item={education[i]} side="right" />
            </li>
          ))}
        </ol>
      </div>
    </LineFrame>
  );
}
