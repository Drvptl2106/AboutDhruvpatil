"use client";

import { motion } from "framer-motion";

import SectionTitle from "@/components/mobile/SectionTitle";
import type { TimelineItem } from "@/lib/content";

/** Entries on the thread: each dot fills as the thread reaches it. */
export default function TimelineMobile({
  id,
  index,
  label,
  title,
  items,
}: {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  items: TimelineItem[];
}) {
  return (
    <section id={id} className="relative z-10 pb-20 pt-10">
      <SectionTitle index={index} label={label}>
        {title}
      </SectionTitle>
      <ol className="flex flex-col gap-12">
        {items.map((item, i) => (
          // Opacity only: the thread measures these positions.
          <motion.li
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="relative pl-12 pr-6"
          >
            <span
              data-thread="node"
              className="absolute left-4 top-1 block size-4 rounded-full border-2 border-subtle bg-paper transition-all duration-500 data-[lit]:scale-125 data-[lit]:border-line data-[lit]:bg-line"
            />
            <p className="text-[11px] uppercase tracking-[0.25em] text-subtle">{item.period}</p>
            <h3 className="mt-2 font-serif text-[1.75rem] leading-tight">{item.title}</h3>
            <p className="mt-0.5 text-sm text-muted">{item.place}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-subtle">{item.detail}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
