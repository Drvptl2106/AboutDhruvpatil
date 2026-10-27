"use client";

import Reveal from "@/components/Reveal";

/**
 * Small label + big serif title. The thread underlines the title and loops at
 * its end, then sweeps back to the gutter in the space reserved below it.
 */
export default function SectionTitle({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return (
    <header className="px-12 pb-32">
      <Reveal className="text-[11px] uppercase tracking-[0.3em] text-subtle">
        ({index}) — {label}
      </Reveal>
      <h2 data-thread="title" className="mt-3 w-fit font-serif text-[clamp(2.5rem,12vw,3.1rem)] leading-[0.95] tracking-[-0.03em]">
        <Reveal delay={0.1} className="-mb-[0.14em] pb-[0.14em]">
          {children}
        </Reveal>
      </h2>
    </header>
  );
}
