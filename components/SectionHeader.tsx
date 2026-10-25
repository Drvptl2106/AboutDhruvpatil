"use client";

import { motion } from "framer-motion";

import Reveal from "@/components/Reveal";

/**
 * "(01) — Label ........ meta" rule + big serif title.
 * The title carries `data-line-anchor`, which tells the scroll line where to loop.
 */
export default function SectionHeader({
  index,
  label,
  meta,
  title,
  intro,
  show,
}: {
  index: string;
  label: string;
  meta: string;
  title: React.ReactNode;
  intro?: string;
  show?: boolean;
}) {
  const rule =
    show === undefined
      ? { whileInView: { scaleX: 1 }, viewport: { once: true, amount: 1 } }
      : { animate: { scaleX: show ? 1 : 0 } };

  return (
    <header className="w-full">
      <div className="flex items-end justify-between text-[11px] uppercase tracking-[0.3em] text-subtle">
        <Reveal show={show} delay={0.15}>
          ({index}) — {label}
        </Reveal>
        <Reveal show={show} delay={0.2}>
          {meta}
        </Reveal>
      </div>

      <motion.div
        className="mt-4 h-px origin-left bg-ink/20"
        initial={{ scaleX: 0 }}
        transition={{ duration: 1.2, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
        {...rule}
      />

      <h2
        data-line-anchor
        className="mt-6 w-fit font-serif text-[clamp(3.75rem,13vw,11rem)] font-normal leading-[0.9] tracking-[-0.03em]"
      >
        <Reveal show={show} delay={0.3} className="-mb-[0.14em] pb-[0.14em]">
          {title}
        </Reveal>
      </h2>

      {intro && (
        <Reveal show={show} delay={0.5} className="mt-6 max-w-md">
          <p className="text-sm leading-relaxed text-subtle">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
