"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import ArtistCard from "@/components/ArtistCard";
import NowPlaying from "@/components/frame/NowPlaying";
import SectionTitle from "@/components/mobile/SectionTitle";
import SpotifyLinks from "@/components/SpotifyLinks";
import WeekInMusic from "@/components/WeekInMusic";
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
          <ArtistCard key={i} artist={a} hidden={i >= items.length} className="h-44 w-36 shrink-0" />
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

      <NowPlaying className="mx-12 mr-6 mt-14 rounded-2xl border border-ink/10 px-4 py-3.5" />

      <p id="artists" className="mt-16 px-12 text-[11px] uppercase tracking-[0.3em] text-subtle">On repeat</p>
      <SpotifyLinks className="mt-5 px-12 pr-6" />
      <WeekInMusic className="mt-10 px-12 pr-6 !text-left [&_ol]:justify-start" />
      <div className="mt-5 flex flex-col gap-3">
        <ArtistRow items={about.artists.slice(0, half)} />
        <ArtistRow items={about.artists.slice(half)} reverse />
      </div>
    </section>
  );
}
