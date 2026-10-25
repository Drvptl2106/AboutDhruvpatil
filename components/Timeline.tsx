"use client";

import { motion } from "framer-motion";

import SectionHeader from "@/components/SectionHeader";
import type { TimelineItem } from "@/lib/content";

/** Shared layout for Experience and Education: header + staggered rows. */
export default function Timeline({
  id,
  index,
  label,
  meta,
  title,
  items,
}: {
  id: string;
  index: string;
  label: string;
  meta: string;
  title: React.ReactNode;
  items: TimelineItem[];
}) {
  return (
    <section id={id} className="relative z-10 mx-auto w-full max-w-6xl px-5 py-32 md:py-48">
      <SectionHeader index={index} label={label} meta={meta} title={title} />

      <ul data-line-pass className="mt-16 md:mt-24">
        {items.map((item, i) => (
          <motion.li
            key={`${item.title}-${i}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="group grid grid-cols-1 gap-3 border-t border-ink/15 bg-paper/60 py-8 backdrop-blur-[2px] last:border-b md:grid-cols-[10rem_1fr_1fr] md:gap-8 md:py-10"
          >
            <p className="pt-2 text-[11px] uppercase tracking-[0.25em] text-subtle">{item.period}</p>
            <div className="transition-transform duration-500 ease-out group-hover:translate-x-2">
              <h3 className="relative font-serif text-3xl leading-tight md:text-4xl">
                <span className="absolute -left-4 top-1/2 size-2 -translate-y-1/2 scale-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-100" />
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{item.place}</p>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-subtle md:pt-2">{item.detail}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
