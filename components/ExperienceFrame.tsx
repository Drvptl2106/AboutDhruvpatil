"use client";

import LineFrame, { type Rel } from "@/components/LineFrame";
import { experience } from "@/lib/content";
import { clamp, fractionAt, LineBuilder } from "@/lib/linePath";

const OFF = 80;

/**
 * In from the left, turning up into a full circle at the top-left; straight
 * across above the title and out at the top-right; round off-screen and back
 * in, crossing itself, down the title's right side; a wave back underneath
 * it, a rounded turn down into the spine and straight through every dot.
 */
function experienceLine(rel: Rel, w: number, h: number, stage: HTMLElement) {
  const e = rel("[data-line-anchor]");
  const label = rel("[data-line-label]");
  const dots = Array.from(stage.querySelectorAll<HTMLElement>("[data-line-node]"));
  const dotRects = dots.map((_, i) => rel(`[data-line-node="${i}"]`));
  const x = dotRects[0] ? dotRects[0].left + dotRects[0].width / 2 : w / 2;
  const firstDot = dotRects[0] ? dotRects[0].top + dotRects[0].height / 2 : e.bottom + 120;
  const R = clamp(w * 0.045, 34, 76);
  const turn = clamp((firstDot - e.bottom) * 0.35, 24, 48);
  // The straight run sits just above the "(02)" label; the circle hangs above it.
  const run = Math.max(R * 2 + 70, label.top - 26);
  const above = run - R;
  const under = Math.min(e.bottom + (firstDot - e.bottom) * 0.4, firstDot - turn - 16);

  const b = new LineBuilder({ x: -OFF, y: e.bottom + e.height * 0.3 }, { x: 1, y: -0.04 })
    .to({ x: w * 0.13, y: e.bottom + e.height * 0.22 }, { x: 1, y: -0.12 })
    .mark()
    .to({ x: w * 0.25, y: above }, { x: 0, y: -1 }, 0.5)
    // ¾ of a circle: up, over to the left, down and back heading right,
    // crossing the stretch it came up on.
    .circle(R, 0.75, "left")
    .line({ x: w * 0.32, y: run - 2 })
    .to({ x: w * 0.72, y: Math.max(run - R * 0.7, 40) }, { x: 1, y: -0.1 }, 0.4)
    .to({ x: w * 0.86, y: -OFF }, { x: 0.45, y: -1 }, 0.45)
    // off-screen U-turn, then back in heading down
    .to({ x: w * 0.77, y: -OFF * 0.6 }, { x: 0.12, y: 1 }, 0.9)
    .to({ x: w * 0.8, y: e.top + e.height * 0.55 }, { x: 0, y: 1 }, 0.42)
    .to({ x: w * 0.68, y: under + e.height * 0.25 }, { x: -1, y: 0 }, 0.5)
    .to({ x: x + turn, y: under }, { x: -1, y: 0 }, 0.4)
    .circle(turn, 0.25, "left")
    .line({ x, y: firstDot });
  for (const r of dotRects.slice(1)) b.line({ x, y: r.top + r.height / 2 });
  const line = b.line({ x, y: h + OFF }).build();

  return {
    d: line.d,
    entry: line.marks[0],
    nodes: dots.map((el, i) => ({
      el,
      at: fractionAt(line.flat, { x, y: dotRects[i].top + dotRects[i].height / 2 }),
    })),
  };
}

export default function ExperienceFrame() {
  return (
    <LineFrame id="experience" length={240} build={experienceLine}>
      <div className="flex h-full flex-col items-center justify-center px-5 pt-[22svh]">
        <p data-line-label className="text-[11px] uppercase tracking-[0.3em] text-subtle">
          (02) — Experience
        </p>
        <h2
          data-line-anchor
          className="mt-4 w-fit font-serif text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.92] tracking-[-0.03em]"
        >
          My <em className="italic text-muted">Experience</em>
        </h2>

        <ol data-line-spine className="mt-12 flex w-full max-w-4xl flex-col gap-7 md:mt-16 md:gap-9">
          {experience.map((item, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] items-start md:grid-cols-[1fr_6rem_1fr]">
              <p className="hidden pt-3 text-right text-[11px] uppercase tracking-[0.25em] text-subtle md:block">
                {item.period}
              </p>
              <div className="flex justify-center pt-2.5">
                <span
                  data-line-node={i}
                  data-line-handoff={i === 0 ? "" : undefined}
                  className="block size-4 rounded-full border-2 border-subtle bg-paper transition-all duration-500 data-[lit]:scale-125 data-[lit]:border-line data-[lit]:bg-line"
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
