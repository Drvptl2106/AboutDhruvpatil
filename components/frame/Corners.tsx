"use client";

import { motion } from "framer-motion";

import Clock, { Status } from "@/components/frame/Clock";
import NowPlaying from "@/components/frame/NowPlaying";
import ThemeToggle from "@/components/ThemeToggle";
import { profile } from "@/lib/content";

const fade = (show: boolean, delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: show ? 1 : 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Soft backing so a corner stays readable over the line, cards or crowd. */
const chip = "rounded-full border border-ink/10 bg-paper/70 px-4 py-2.5 backdrop-blur-md";

/**
 * The four corners, fixed for the whole page like the edge of a record sleeve:
 * who you are, the theme, what you're listening to, and where you are now.
 */
export default function Corners({ show }: { show: boolean }) {
  return (
    <>
      {/* Top: page colour fades behind, so the line slips under it. */}
      <motion.header
        {...fade(show, 0.6)}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between bg-gradient-to-b from-paper via-paper/85 to-transparent px-8 pb-6 pt-5"
      >
        <a href="#top" className="pointer-events-auto block">
          <span className="block text-[11px] uppercase tracking-[0.25em] text-ink">{profile.name}</span>
          <span className="mt-1 block font-serif text-[15px] italic text-muted">{profile.tagline}</span>
        </a>
        <ThemeToggle className="pointer-events-auto" />
      </motion.header>

      <motion.div {...fade(show, 1.1)} className={`fixed bottom-5 left-6 z-50 max-w-[min(26vw,280px)] ${chip}`}>
        <NowPlaying />
      </motion.div>

      <motion.div
        {...fade(show, 1.1)}
        className={`fixed bottom-5 right-6 z-50 flex items-center gap-4 text-xs text-ink ${chip}`}
      >
        <Clock />
        <Status className="hidden text-muted lg:inline-flex" />
      </motion.div>
    </>
  );
}
