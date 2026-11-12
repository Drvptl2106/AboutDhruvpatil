"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import ArtistCard from "@/components/ArtistCard";
import SpotifyLinks from "@/components/SpotifyLinks";
import WeekInMusic from "@/components/WeekInMusic";
import { about } from "@/lib/content";

const COLS = 5;

// How far each column drifts against the wall as you scroll past it, as a
// share of the wall's height: positive drifts up, negative drifts down. Mixed
// signs and sizes so the columns never move as one.
const DRIFT = [0.62, -0.48, 0.4, -0.66, 0.52];

type Plan = { top: number; travel: number };

/**
 * Where each column starts and how far it travels while the wall crosses the
 * screen, so that it visibly moves and never shows a gap.
 *
 * In the wall's own coordinates, the part on screen runs from
 * max(0, p·(H+V) − V) to min(H, p·(H+V)) as scroll progress p goes 0 → 1.
 * A column of height C at top + travel·p must cover that the whole way. A
 * column that kept exact pace with the page (travel = H) would look frozen,
 * so each drifts by its share of H, cut back until it fits.
 */
function plan(H: number, V: number, C: number, drift: number): Plan {
  const steps = 120;
  const fits = (travel: number) => {
    let lo = -Infinity; // the column's top may be no higher than…
    let hi = Infinity; //  …and no lower than this
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const a = Math.min(H, Math.max(0, p * (H + V) - V));
      const b = Math.min(H, Math.max(0, p * (H + V)));
      if (b <= a) continue;
      lo = Math.max(lo, b - C - travel * p);
      hi = Math.min(hi, a - travel * p);
    }
    return lo <= hi ? (lo + hi) / 2 : null;
  };
  for (let d = drift; Math.abs(d) > 0.01; d *= 0.85) {
    const travel = H * (1 - d);
    const top = fits(travel);
    if (top !== null) return { top, travel };
  }
  return { top: 0, travel: H };
}

function Column({ items, progress, layout }: { items: typeof about.artists; progress: MotionValue<number>; layout: Plan | null }) {
  const y = useTransform(progress, (p) => (layout ? layout.top + layout.travel * p : 0));
  return (
    <motion.div data-wall-col className="flex min-w-0 flex-1 flex-col gap-[1.6vw]" style={{ y }}>
      {items.map((a) => (
        <ArtistCard key={a.src} artist={a} className="aspect-[3/4] w-full shrink-0" />
      ))}
    </motion.div>
  );
}

/**
 * Five columns of artists drifting at their own pace as you scroll past (after
 * Skiper 30 Parallax_002, Skiper UI). Each card opens the artist on Spotify.
 */
export default function ArtistWall() {
  const wall = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wall, offset: ["start end", "end start"] });
  const [layouts, setLayouts] = useState<Plan[] | null>(null);
  // Your featured artists down the middle column; everyone else dealt across the rest.
  const mid = Math.floor(COLS / 2);
  const rest = about.artists.filter((a) => !a.featured);
  const sides = Array.from({ length: COLS - 1 }, (_, c) => rest.filter((_, i) => i % (COLS - 1) === c));
  const columns = [...sides.slice(0, mid), about.artists.filter((a) => a.featured), ...sides.slice(mid)];

  const measure = useCallback(() => {
    const el = wall.current;
    if (!el) return;
    const H = el.clientHeight;
    const V = window.innerHeight;
    const cols = Array.from(el.querySelectorAll<HTMLElement>("[data-wall-col]"));
    setLayouts(cols.map((col, i) => plan(H, V, col.scrollHeight, DRIFT[i % DRIFT.length])));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wall.current) ro.observe(wall.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <section id="artists" aria-label="Artists on repeat" className="relative z-10 w-full bg-paper">
      {/* The line from About carries on down into the music, centred where it left off. */}
      <span aria-hidden className="mx-auto block h-16 w-2 rounded-b-full bg-line lg:w-2.5" />
      <p className="px-5 pb-5 pt-6 text-center text-[11px] uppercase tracking-[0.3em] text-subtle">
        On repeat — the artists in my headphones
      </p>
      <WeekInMusic className="px-5 pb-6" />
      <SpotifyLinks className="flex flex-col items-center px-5 pb-8" />
      <div ref={wall} className="relative flex h-[72svh] gap-[1.6vw] overflow-hidden bg-paper px-[2vw]">
        {columns.map((items, c) => (
          <Column key={c} items={items} progress={scrollYProgress} layout={layouts?.[c] ?? null} />
        ))}
      </div>
    </section>
  );
}
