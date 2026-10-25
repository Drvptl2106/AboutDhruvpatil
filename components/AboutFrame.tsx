"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

import LineFrame, { type Rel, useSceneProgress } from "@/components/LineFrame";
import { about } from "@/lib/content";
import { clamp, LineBuilder } from "@/lib/linePath";

const OFF = 90;

/**
 * Down from the top where Education's spine left, a rounded turn left above the
 * label and a circle hanging above the line; out through the left edge; back
 * in between the heading and the statement, across, down beside the statement
 * and a sweep back to the middle, out at the bottom into the artist wall.
 */
function aboutRoute(rel: Rel, w: number, h: number) {
  const e = rel("[data-line-anchor]");
  const label = rel("[data-line-label]");
  const st = rel("[data-line-pass]");
  const x = w / 2;
  const r = clamp(Math.min(w * 0.05, h * 0.085), 34, 80);
  const bend = Math.max(label.top - 64, 2 * r + 30);
  const between = (e.bottom + st.top) / 2;
  const lane = Math.min(st.right + Math.max((w - st.right) * 0.35, 30), w - 30);
  const line = new LineBuilder({ x, y: -OFF }, { x: 0, y: 1 })
    .to({ x: x - 110, y: bend }, { x: -1, y: 0 }, 0.5)
    .mark()
    .to({ x: w * 0.24, y: bend + 6 }, { x: -1, y: 0 }, 0.42)
    .circle(r, 1, "right")
    .to({ x: -OFF, y: bend + h * 0.08 }, { x: -1, y: 0.25 }, 0.42)
    // off-screen: round and back in, lower down
    .to({ x: -OFF * 0.6, y: between }, { x: 1, y: 0 }, 0.7)
    .to({ x: lane - 70, y: between + 6 }, { x: 1, y: 0.02 }, 0.42)
    .to({ x: lane, y: between + 70 }, { x: 0, y: 1 }, 0.45)
    .line({ x: lane, y: Math.max(st.bottom - 40, between + 80) })
    .to({ x: w * 0.56, y: st.bottom + (h - st.bottom) * 0.45 }, { x: -1, y: 0.3 }, 0.45)
    .to({ x, y: h + OFF }, { x: 0, y: 1 }, 0.45)
    .build();
  return { d: line.d, entry: line.marks[0] };
}

/** One word of the statement; brightens as the scene plays. */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

function Statement() {
  const progress = useSceneProgress()!;
  const words = about.statement.split(" ");
  // Lit over the first 70% of the scene, word by word.
  return (
    <p
      data-line-pass
      className="mx-auto mt-14 max-w-3xl text-center font-serif text-[clamp(1.6rem,3.2vw,3rem)] leading-[1.15] tracking-[-0.01em] md:mt-16"
    >
      {words.map((word, i) => (
        <Word key={i} progress={progress} range={[(i / words.length) * 0.7, ((i + 1) / words.length) * 0.7]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

export default function AboutFrame() {
  return (
    <LineFrame id="about" length={260} build={aboutRoute}>
      <div className="flex h-full flex-col items-center justify-center px-5 pt-[12svh]">
        <p data-line-label className="text-[11px] uppercase tracking-[0.3em] text-subtle">
          (04) — About — what defines me
        </p>
        <h2
          data-line-anchor
          className="mt-4 w-fit font-serif text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.92] tracking-[-0.03em]"
        >
          About <em className="italic text-muted">Me</em>
        </h2>
        <Statement />
      </div>
    </LineFrame>
  );
}
