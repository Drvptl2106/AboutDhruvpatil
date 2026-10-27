"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import SectionTitle from "@/components/mobile/SectionTitle";
import { about } from "@/lib/content";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

/** One row of artist cards drifting sideways; touch to pause it. */
function ArtistRow({ items, reverse }: { items: typeof about.artists; reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <div
        className="marquee flex w-max gap-3 active:[animation-play-state:paused]"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[...items, ...items].map((a, i) => (
          <figure key={i} aria-hidden={i >= items.length} className="relative h-44 w-36 shrink-0 overflow-hidden rounded-2xl">
            <img src={a.src} alt={i < items.length ? a.name : ""} className="size-full object-cover" />
            <figcaption className="absolute bottom-2.5 left-3 text-[10px] uppercase tracking-[0.2em] text-white/85">
              {a.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** The music statement, lit word by word as you scroll, then the artists. */
export default function AboutMobile() {
  const text = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: text, offset: ["start 0.85", "end 0.5"] });
  const words = about.statement.split(" ");
  const half = Math.ceil(about.artists.length / 2);

  return (
    <section id="about" className="relative z-10 pb-24 pt-10">
      <SectionTitle index="04" label="About">
        About <em className="italic text-muted">Me</em>
      </SectionTitle>
      <p ref={text} className="px-12 pr-6 font-serif text-[1.7rem] leading-[1.18]">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>

      <p className="mt-20 px-12 text-[11px] uppercase tracking-[0.3em] text-subtle">On repeat</p>
      <div className="mt-5 flex flex-col gap-3">
        <ArtistRow items={about.artists.slice(0, half)} />
        <ArtistRow items={about.artists.slice(half)} reverse />
      </div>
    </section>
  );
}
