"use client";

import LineFrame, { type Rel } from "@/components/LineFrame";
import type { TimelineItem } from "@/lib/content";
import { clamp, fractionAt, LineBuilder } from "@/lib/linePath";

const OFF = 90;

/** Shared measurements for a timeline scene. */
function measure(rel: Rel, w: number, h: number, stage: HTMLElement) {
  const e = rel("[data-line-anchor]");
  const label = rel("[data-line-label]");
  const dots = Array.from(stage.querySelectorAll<HTMLElement>("[data-line-node]"));
  const dotY = dots.map((_, i) => {
    const r = rel(`[data-line-node="${i}"]`);
    return r.top + r.height / 2;
  });
  const d0 = rel(`[data-line-node="0"]`);
  const x = d0.left + d0.width / 2;
  const r = clamp(Math.min(w * 0.05, h * 0.085), 34, 80);
  const gap = dotY[0] - e.bottom; // between the heading and the first dot
  const tr = clamp(gap * 0.2, 22, 40); // radius of the turn into the spine
  return { e, label, dots, dotY, x, r, gap, tr };
}

/** Straight down the spine through every dot, then out at the bottom. */
function spine(b: LineBuilder, x: number, dotY: number[], h: number) {
  for (const y of dotY) b.line({ x, y });
  return b.line({ x, y: h + OFF });
}

function withNodes(b: LineBuilder, m: ReturnType<typeof measure>) {
  const line = b.build();
  return {
    d: line.d,
    entry: line.marks[0],
    nodes: m.dots.map((el, i) => ({ el, at: fractionAt(line.flat, { x: m.x, y: m.dotY[i] }) })),
  };
}

/**
 * Experience: in from the left, up into a circle at the top-left; a long
 * gentle ramp above the label and out of the top-right corner; back in just
 * right of the heading, crossing the ramp once; a broad U, a wave back under
 * the heading and a rounded turn down into the spine.
 */
export function experienceRoute(rel: Rel, w: number, h: number, stage: HTMLElement) {
  const m = measure(rel, w, h, stage);
  const { e, label, x, r, gap, tr } = m;
  const run = Math.max(2 * r + 50, label.top - 30);
  const cx = w * 0.2;
  const x0 = Math.min(e.right + w * 0.05, w * 0.8); // where it comes back in
  const b = new LineBuilder({ x: -OFF, y: e.bottom + e.height * 0.35 }, { x: 1, y: -0.05 })
    .to({ x: w * 0.1, y: e.bottom + e.height * 0.28 }, { x: 1, y: -0.12 })
    .mark()
    .to({ x: cx + r, y: run - r }, { x: 0, y: -1 }, 0.5)
    .circle(r, 0.75, "left")
    .line({ x: cx + r * 1.6, y: run })
    .to({ x: w * 0.8, y: run - h * 0.06 }, { x: 1, y: -0.14 }, 0.42)
    .to({ x: w + OFF * 0.6, y: -OFF * 0.6 }, { x: 0.7, y: -0.7 }, 0.42)
    // off-screen: round and back in, heading down
    .to({ x: x0, y: -OFF * 0.4 }, { x: 0.15, y: 1 }, 0.6)
    .to({ x: x0 + w * 0.045, y: e.top + e.height * 0.55 }, { x: 0.05, y: 1 }, 0.42)
    .to({ x: x0 - w * 0.03, y: m.dotY[0] - 40 }, { x: -1, y: 0 }, 0.5)
    .to({ x: x + tr, y: e.bottom + gap * 0.36 }, { x: -1, y: 0 }, 0.45)
    .circle(tr, 0.25, "left");
  return withNodes(spine(b, x, m.dotY, h), m);
}

/**
 * Education (same pattern, mirrored): down from the top where Experience's
 * spine left, a rounded turn right above the label and out of the top-right
 * corner; back in from the right below the heading, a circle hanging above the
 * line at the heading's right; on under the heading and down into the spine.
 */
export function educationRoute(rel: Rel, w: number, h: number, stage: HTMLElement) {
  const m = measure(rel, w, h, stage);
  const { e, label, x, r, gap, tr } = m;
  const bend = Math.max(label.top - 64, 70);
  const under = e.bottom + gap * 0.32; // the line beneath the heading
  const cx = Math.min(e.right + r * 1.4, w - r * 1.6);
  const b = new LineBuilder({ x, y: -OFF }, { x: 0, y: 1 })
    .to({ x: x + 110, y: bend }, { x: 1, y: 0 }, 0.5)
    .mark()
    .to({ x: w * 0.8, y: bend - h * 0.05 }, { x: 1, y: -0.14 }, 0.42)
    .to({ x: w + OFF * 0.6, y: -OFF * 0.5 }, { x: 0.7, y: -0.7 }, 0.42)
    // off-screen: round and back in from the right, lower down
    .to({ x: w + OFF * 0.5, y: under }, { x: -1, y: 0 }, 0.7)
    .to({ x: cx, y: under }, { x: -1, y: 0 }, 0.4)
    .circle(r, 1, "right")
    .to({ x: w * 0.6, y: under + gap * 0.06 }, { x: -1, y: 0 }, 0.42)
    .to({ x: x + tr, y: e.bottom + gap * 0.5 }, { x: -1, y: 0 }, 0.45)
    .circle(tr, 0.25, "left");
  return withNodes(spine(b, x, m.dotY, h), m);
}

/** A timeline scene: heading and rows, with the line as the spine. */
export default function TimelineFrame({
  id,
  index,
  label,
  title,
  items,
  route,
}: {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  items: TimelineItem[];
  route: typeof experienceRoute;
}) {
  return (
    <LineFrame id={id} length={240} build={route}>
      <div className="flex h-full flex-col items-center justify-center px-5 pt-[14svh] md:pt-[20svh]">
        <p data-line-label className="text-[11px] uppercase tracking-[0.3em] text-subtle">
          ({index}) — {label}
        </p>
        <h2
          data-line-anchor
          className="mt-4 w-fit font-serif text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.92] tracking-[-0.03em]"
        >
          {title}
        </h2>

        <ol className="mt-16 flex w-full max-w-4xl flex-col gap-6 md:mt-24 md:gap-7">
          {items.map((item, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] items-start md:grid-cols-[1fr_6rem_1fr]">
              <p className="hidden pt-3 text-right text-[11px] uppercase tracking-[0.25em] text-subtle md:block">
                {item.period}
              </p>
              <div className="flex justify-center pt-2.5">
                <span
                  data-line-node={i}
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
