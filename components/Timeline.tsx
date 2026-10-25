"use client";

import { motion } from "framer-motion";

import SectionHeader from "@/components/SectionHeader";
import type { TimelineItem } from "@/lib/content";

/**
 * Experience / Education. The scroll line runs down the spine of this list
 * (`data-line-spine`) and lights each node (`data-line-node`) as it passes.
 * Rows only fade (no transforms) so the line can measure them reliably.
 */
export default function Timeline({
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
    <section id={id} data-line-step="timeline" className="relative z-10 mx-auto w-full max-w-6xl px-5">
      <SectionHeader index={index} label={label} title={title} />

      <ol data-line-spine className="mt-20 flex flex-col gap-16 md:mt-28 md:gap-24">
        {items.map((item, i) => (
          <motion.li
            key={`${item.title}-${i}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="grid grid-cols-[2.5rem_1fr] items-start md:grid-cols-[1fr_7rem_1fr]"
          >
            <p className="hidden pt-4 text-right text-[11px] uppercase tracking-[0.25em] text-subtle md:block">
              {item.period}
            </p>
            <div className="flex justify-center pt-3.5">
              <span
                data-line-node
                className="block size-4 rounded-full border-2 border-subtle bg-paper transition-all duration-500 data-[lit]:scale-125 data-[lit]:border-accent data-[lit]:bg-accent"
              />
            </div>
            <div className="pl-3 md:pl-0">
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-subtle md:hidden">{item.period}</p>
              <h3 className="font-serif text-3xl leading-tight md:text-4xl">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.place}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-subtle">{item.detail}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
