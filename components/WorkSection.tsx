"use client";

import { motion } from "framer-motion";

import { HoverExpand_001, type WorkItem } from "@/components/HoverExpand";
import { asset } from "@/lib/asset";

// Replace these with your real projects — drop images in /public/images/work.
const work: WorkItem[] = [
  { src: asset("/images/work/01.svg"), alt: "Project one", code: "# 01", title: "Project One", category: "Brand Identity" },
  { src: asset("/images/work/02.svg"), alt: "Project two", code: "# 02", title: "Project Two", category: "Web Design" },
  { src: asset("/images/work/03.svg"), alt: "Project three", code: "# 03", title: "Project Three", category: "Development" },
  { src: asset("/images/work/04.svg"), alt: "Project four", code: "# 04", title: "Project Four", category: "UI / UX" },
  { src: asset("/images/work/05.svg"), alt: "Project five", code: "# 05", title: "Project Five", category: "Motion" },
  { src: asset("/images/work/06.svg"), alt: "Project six", code: "# 06", title: "Project Six", category: "E-commerce" },
  { src: asset("/images/work/07.svg"), alt: "Project seven", code: "# 07", title: "Project Seven", category: "Branding" },
  { src: asset("/images/work/08.svg"), alt: "Project eight", code: "# 08", title: "Project Eight", category: "Product" },
  { src: asset("/images/work/09.svg"), alt: "Project nine", code: "# 09", title: "Project Nine", category: "Editorial" },
];

const ease = [0.76, 0, 0.24, 1] as const;

/** A line of text that slides up from behind a mask. */
function Reveal({
  children,
  show,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  show: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: show ? "0%" : "110%" }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function WorkSection({ show }: { show: boolean }) {
  return (
    <section
      id="work"
      className="flex min-h-svh w-full flex-col items-center justify-center gap-14 py-20 md:gap-16"
    >
      <header className="w-full max-w-6xl px-5">
        <div className="flex items-end justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
          <Reveal show={show} delay={0.15}>(01) — Selected</Reveal>
          <Reveal show={show} delay={0.2}>2022 — 2026</Reveal>
        </div>

        <motion.div
          className="mt-4 h-px origin-left bg-white/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: show ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease }}
        />

        <h1 className="mt-6 font-serif text-[clamp(4.5rem,15vw,12rem)] font-normal leading-[0.9] tracking-[-0.03em]">
          <Reveal show={show} delay={0.3} className="-mb-[0.12em] pb-[0.12em]">
            My <em className="italic text-white/70">Work</em>
          </Reveal>
        </h1>

        <Reveal show={show} delay={0.5} className="mt-6 max-w-md">
          <p className="text-sm leading-relaxed text-white/50">
            A curated selection of projects — hover to explore.
          </p>
        </Reveal>
      </header>

      <HoverExpand_001 images={work} show={show} />
    </section>
  );
}
