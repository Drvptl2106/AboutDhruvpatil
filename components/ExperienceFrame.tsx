"use client";

import LineFrame, { type Rel } from "@/components/LineFrame";
import { experience } from "@/lib/content";
import { fractionAt, type Point, toPath } from "@/lib/linePath";

const OFF = 70;

/**
 * In from the left, up into a loop at the top-left, straight across above the
 * title and out at the top-right; back in from the top, crossing itself, down
 * the title's right side, a wave back underneath it, then down the timeline
 * spine through every dot and out at the bottom.
 */
function experienceLine(rel: Rel, w: number, h: number, stage: HTMLElement) {
  const e = rel("[data-line-anchor]");
  const spine = rel("[data-line-spine]");
  const dots = Array.from(stage.querySelectorAll<HTMLElement>("[data-line-node]"));
  const first = dots[0] && rel(`[data-line-node="0"]`);
  const x = first ? first.left + first.width / 2 : spine.left + spine.width / 2;
  const up = (f: number) => e.top - e.height * f; // above the title
  const down = (f: number) => e.bottom + e.height * f; // below it

  const nodePts: Point[] = dots.map((_, i) => {
    const r = rel(`[data-line-node="${i}"]`);
    return { x, y: r.top + r.height / 2 };
  });
  const pts: Point[] = [
    { x: -OFF, y: down(0.35) },
    { x: w * 0.16, y: down(0.25) },
    { x: w * 0.235, y: e.top + e.height * 0.7 },
    // the loop
    { x: w * 0.262, y: up(0.33) },
    { x: w * 0.25, y: up(1.5) },
    { x: w * 0.215, y: up(1.68) },
    { x: w * 0.19, y: up(1.58) },
    { x: w * 0.165, y: up(0.96) },
    { x: w * 0.2, y: up(0.38) },
    { x: w * 0.27, y: up(0.36) },
    // straight across, then out at the top-right
    { x: w * 0.725, y: up(0.96) },
    { x: w * 0.8, y: up(1.17) },
    { x: w * 0.835, y: up(1.5) },
    { x: w * 0.865, y: -OFF },
    // back in from the top, crossing itself
    { x: w * 0.75, y: -OFF * 1.4 },
    { x: w * 0.775, y: up(1.1) },
    { x: w * 0.795, y: e.top + e.height * 0.1 },
    { x: w * 0.78, y: down(0.1) },
    { x: w * 0.725, y: down(0.67) },
    { x: w * 0.65, y: down(0.71) },
    // the wave under the title, then into the spine
    { x: w * 0.53, y: down(0.42) },
    { x: (w * 0.53 + x) / 2, y: down(0.4) },
    { x, y: Math.min(down(0.95), spine.top - 10) },
    ...nodePts,
    { x, y: h + OFF },
  ];
  const { d, flat } = toPath(pts);
  return { d, nodes: dots.map((el, i) => ({ el, at: fractionAt(flat, nodePts[i]) })) };
}

export default function ExperienceFrame() {
  return (
    <LineFrame id="experience" length={240} build={experienceLine}>
      <div className="flex h-full flex-col items-center justify-center px-5 pt-[14svh]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">(02) — Experience</p>
        <h2
          data-line-anchor
          className="mt-4 w-fit font-serif text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.92] tracking-[-0.03em]"
        >
          My <em className="italic text-muted">Experience</em>
        </h2>

        <ol data-line-spine className="mt-14 flex w-full max-w-4xl flex-col gap-8 md:mt-20 md:gap-12">
          {experience.map((item, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] items-start md:grid-cols-[1fr_6rem_1fr]">
              <p className="hidden pt-3 text-right text-[11px] uppercase tracking-[0.25em] text-subtle md:block">
                {item.period}
              </p>
              <div className="flex justify-center pt-2.5">
                <span
                  data-line-node={i}
                  data-line-handoff={i === 0 ? "" : undefined}
                  className="block size-4 rounded-full border-2 border-subtle bg-paper transition-all duration-500 data-[lit]:scale-125 data-[lit]:border-accent data-[lit]:bg-accent"
                />
              </div>
              <div className="pl-3 md:pl-0">
                <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-subtle md:hidden">{item.period}</p>
                <h3 className="font-serif text-2xl leading-tight md:text-3xl">{item.title}</h3>
                <p className="mt-0.5 text-sm text-muted">{item.place}</p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-subtle">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </LineFrame>
  );
}
