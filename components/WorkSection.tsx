"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { HoverExpand_001 } from "@/components/HoverExpand";
import SectionHeader from "@/components/SectionHeader";
import { work } from "@/lib/content";

// Scroll distance (in viewport heights) spent on each project while pinned.
const PER_PROJECT_VH = 32;

export default function WorkSection({ show }: { show: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const pinned = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pin, setPin] = useState({ top: 0, trackHeight: 0 });

  // Pin the gallery vertically centred.
  useEffect(() => {
    const el = pinned.current;
    if (!el) return;
    const update = () =>
      setPin({
        top: Math.max(72, (window.innerHeight - el.offsetHeight) / 2),
        trackHeight: el.offsetHeight + work.length * window.innerHeight * PER_PROJECT_VH * 0.01,
      });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // While pinned, scrolling steps through the projects.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    const t = track.current;
    const p = pinned.current;
    if (!t || !p) return;
    const travel = t.offsetHeight - p.offsetHeight;
    const progress = (pin.top - t.getBoundingClientRect().top) / travel;
    const index = Math.min(work.length - 1, Math.max(0, Math.floor(progress * work.length)));
    setActive((prev) => (prev === index ? prev : index));
  });

  return (
    <section id="work" className="relative z-10 w-full pt-28">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHeader
          index="01"
          label="Selected"
          meta="2022 — 2026"
          title={
            <>
              My <em className="italic text-muted">Work</em>
            </>
          }
          intro="A curated selection of projects — scroll or hover to explore."
          show={show}
        />
      </div>

      <div
        ref={track}
        data-line-pass
        className="relative mt-12 md:mt-16"
        style={{ height: pin.trackHeight || undefined }}
      >
        <div ref={pinned} className="sticky flex w-full justify-center" style={{ top: pin.top }}>
          <HoverExpand_001 images={work} active={active} onActiveChange={setActive} show={show} />
        </div>
      </div>
    </section>
  );
}
