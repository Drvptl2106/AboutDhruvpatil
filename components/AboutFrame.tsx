"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

import LineFrame, { type Rel, useSceneProgress } from "@/components/LineFrame";
import { about } from "@/lib/content";
import { cornerRadius, fractionAt, LineBuilder, OFF } from "@/lib/linePath";

/**
 * Down from the top centre, a turn right above the label, down beside the
 * statement, back to the centre beneath it and out at the bottom centre,
 * into the artist wall.
 */
function aboutRoute(rel: Rel, w: number, h: number) {
  const label = rel("[data-line-label]");
  const st = rel("[data-line-pass]");
  const r = cornerRadius(w, h);
  const x = w / 2;
  const above = Math.max(label.top - 44, 76);
  const side = Math.min(st.right + Math.max((w - st.right) * 0.35, 30), w - 28);
  const below = st.bottom + (h - st.bottom) * 0.42;
  const line = new LineBuilder({ x, y: -OFF }, { x: 0, y: 1 })
    .round(
      [
        { x, y: above },
        { x: side, y: above },
        { x: side, y: below },
        { x, y: below, r: Math.min(r, (h - below) * 0.8) },
        { x, y: h + OFF },
      ],
      r,
    )
    .build();
  // The drop, first corner and first run draw while the scene scrolls in, so
  // the line is already moving when it takes over from the scene above.
  return { d: line.d, entry: fractionAt(line.flat, { x: side, y: above }) };
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
    <LineFrame id="about" length={200} build={aboutRoute}>
      <div className="flex h-full flex-col items-center justify-center px-5 pt-[12svh]">
        <p data-line-label className="text-[11px] uppercase tracking-[0.3em] text-subtle">
          (03) — About — what defines me
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
