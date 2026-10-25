"use client";

import { HoverExpand_001 } from "@/components/HoverExpand";
import SectionHeader from "@/components/SectionHeader";
import { work } from "@/lib/content";

export default function WorkSection({ show }: { show: boolean }) {
  return (
    <section
      id="work"
      data-line-step="work"
      className="relative z-10 flex w-full flex-col items-center gap-14 pb-10 pt-28 md:gap-20"
    >
      <div className="w-full max-w-6xl px-5">
        <SectionHeader
          index="01"
          label="Selected work"
          title={
            <>
              My <em className="italic text-muted">Work</em>
            </>
          }
          intro="Hover to open a project — drag or scroll sideways to see more."
          show={show}
        />
      </div>

      <HoverExpand_001 images={work} show={show} />
    </section>
  );
}
