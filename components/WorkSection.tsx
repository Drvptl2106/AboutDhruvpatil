"use client";

import { HoverExpand_001 } from "@/components/HoverExpand";
import SectionHeader from "@/components/SectionHeader";
import { work } from "@/lib/content";

export default function WorkSection({ show }: { show: boolean }) {
  return (
    <section
      id="work"
      className="relative z-10 flex min-h-svh w-full flex-col items-center justify-center gap-14 pb-24 pt-28 md:gap-16"
    >
      <div className="w-full max-w-6xl px-5">
        <SectionHeader
          index="01"
          label="Selected"
          meta="2022 — 2026"
          title={
            <>
              My <em className="italic text-muted">Work</em>
            </>
          }
          intro="A curated selection of projects — hover to explore."
          show={show}
        />
      </div>

      <HoverExpand_001 images={work} show={show} />
    </section>
  );
}
