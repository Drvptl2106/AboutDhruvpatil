"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

import { moodFor, useHere } from "@/components/frame/Clock";
import NowPlaying from "@/components/frame/NowPlaying";
import { openHeritage } from "@/components/Heritage";
import ThemeToggle from "@/components/ThemeToggle";
import { allSectionIds, goTo, linkFor, sections } from "@/lib/apps";
import { profile } from "@/lib/content";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

// The pointer has to touch this close to the top edge to call the panel down…
const REVEAL_AT = 24;
// …and it stays while the pointer is within this much of the top.
const KEEP_WITHIN = 120;

/**
 * Like the macOS menu bar in full screen: shown at the top of the page, then
 * tucked away once you scroll, and called back by touching the top edge (or by
 * tabbing into it).
 */
function useTopPanel() {
  const [atTop, setAtTop] = useState(true);
  const [peek, setPeek] = useState(false);
  const [focused, setFocused] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setAtTop(y < 60));

  useEffect(() => {
    const move = (e: PointerEvent) => setPeek((was) => e.clientY <= (was ? KEEP_WITHIN : REVEAL_AT));
    const leave = () => setPeek(false);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  const focus = {
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false),
  };
  return { open: atTop || peek || focused, atTop, focus };
}

/** Ids of the parts the bottom corners must never sit on. */
const KEEP_CLEAR = ["artists", "contact"];
const BOTTOM_STRIP = 110;

/**
 * True while the artist wall or the contact scene reaches into the strip at
 * the bottom of the screen where the bottom corners sit, by where they really
 * are on screen, not by which section holds the middle.
 */
function useBottomCovered() {
  const [covered, setCovered] = useState(false);
  const { scrollY } = useScroll();
  const check = () => {
    const h = window.innerHeight;
    setCovered(
      KEEP_CLEAR.some((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return !!r && r.top < h && r.bottom > h - BOTTOM_STRIP;
      }),
    );
  };
  useMotionValueEvent(scrollY, "change", check);
  useEffect(() => {
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return covered;
}

/**
 * The four corners, like the type on the edge of a record sleeve: who you
 * are, where to go, what you're listening to, where you are now. Plain type,
 * no boxes; white with a difference blend, so it inverts against whatever is
 * behind it and always reads. Orange is left to the line.
 *
 * The bottom corners step aside over the artist wall's photos and for the
 * finale, where the contact links sit.
 */
export default function Corners({ show }: { show: boolean }) {
  const inView = useActiveSection(allSectionIds);
  const current = linkFor(inView);
  const here = useHere();
  const { open, atTop, focus } = useTopPanel();
  const covered = useBottomCovered();
  const bottom = show && !covered;
  const music = bottom;

  const corner = "pointer-events-auto fixed z-50 text-white mix-blend-difference";
  const topMotion = {
    initial: { opacity: 0, y: -16 },
    animate: show && open ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 },
    transition: { duration: 0.45, ease },
  };
  const bottomMotion = (on: boolean) => ({
    initial: { opacity: 0 },
    animate: { opacity: on ? 1 : 0 },
    transition: { duration: 0.6, ease },
  });

  return (
    <>
      {/* Called down mid-page, the panel brings a frosted bar with it, like the
          macOS menu bar, so it never sits on top of the page's own text. */}
      <motion.div
        aria-hidden
        initial={false}
        animate={show && open && !atTop ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}
        transition={{ duration: 0.45, ease }}
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[88px] bg-paper/80 backdrop-blur-xl"
      />
      <motion.div
        {...topMotion}
        {...focus}
        aria-hidden={!open || undefined}
        className={cn(corner, "left-8 top-6", !open && "pointer-events-none")}
      >
        <a href="#top" className="block text-[11px] uppercase tracking-[0.25em]">
          {profile.name}
        </a>
        {/* Opens the Goa cards. The dotted underline says "there's something here". */}
        <button
          type="button"
          onClick={openHeritage}
          className="mt-1 block font-serif text-[15px] italic underline decoration-current decoration-dotted underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
        >
          {profile.tagline}
        </button>
      </motion.div>

      <motion.nav
        {...topMotion}
        {...focus}
        aria-label="Sections"
        className={cn(
          corner,
          "right-8 top-6 flex items-center gap-9 text-[11px] uppercase tracking-[0.25em]",
          !open && "pointer-events-none",
        )}
      >
        <ul className="flex gap-7">
          {sections.map((s) => {
            const on = current === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(s.id);
                  }}
                  className={cn("relative block pb-1.5 transition-opacity hover:opacity-100", on ? "opacity-100" : "opacity-50")}
                >
                  {s.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-500",
                      on ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
        <ThemeToggle className="pb-1.5" />
      </motion.nav>

      <motion.div
        {...bottomMotion(music)}
        className={cn(corner, "bottom-6 left-8 max-w-[min(28vw,300px)]", !music && "pointer-events-none")}
      >
        <NowPlaying bars="text-white" />
      </motion.div>

      <motion.div {...bottomMotion(bottom)} className={cn(corner, "bottom-6 right-8 text-right", !bottom && "pointer-events-none")}>
        <span className="block text-[10px] uppercase tracking-[0.25em] opacity-60">
          {profile.city}
          {here.gap && <> · {here.gap}</>}
        </span>
        <span className="mt-0.5 block text-xs">
          <span className="tabular-nums">{here.time}</span>
          <span className="ml-2 font-serif text-[14px] italic opacity-75">{moodFor(here.hour)}</span>
        </span>
      </motion.div>
    </>
  );
}
