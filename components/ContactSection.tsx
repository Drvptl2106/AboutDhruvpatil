"use client";

import { motion } from "framer-motion";

import { profile } from "@/lib/content";

/** Closing card the scroll line runs into. Layout from Skiper 19 (Skiper UI). */
export default function ContactSection() {
  return (
    <section id="contact" className="relative z-10 px-3 pb-3 pt-32 md:pt-48">
      <motion.div
        data-line-end
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full overflow-hidden rounded-[2.5rem] bg-ink pb-8 text-paper"
      >
        <div className="flex items-center justify-between px-6 pt-8 text-[11px] uppercase tracking-[0.3em] text-paper/50 md:px-10">
          <span>(04) — Contact</span>
          <span>Open to work</span>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="group mt-16 block px-6 font-serif text-[clamp(2.75rem,9vw,8rem)] leading-[0.95] tracking-[-0.03em] md:px-10"
        >
          Let&apos;s build <em className="italic text-paper/60 transition-colors group-hover:text-accent">something</em>
          <br />
          together.
        </a>

        <h2 className="mt-24 select-none whitespace-nowrap text-center font-serif text-[16.5vw] leading-[0.85] tracking-[-0.04em] md:mt-32">
          {profile.name}
        </h2>

        <div className="mt-10 flex flex-col gap-8 px-6 text-xs uppercase tracking-[0.2em] md:flex-row md:justify-between md:px-10">
          <div className="flex justify-between gap-12">
            <p>
              <span className="text-paper/50">Based in</span>
              <br />
              {profile.location}
            </p>
            <p className="text-right md:text-left">
              <span className="text-paper/50">Write to</span>
              <br />
              <a href={`mailto:${profile.email}`} className="normal-case tracking-normal hover:text-accent">
                {profile.email}
              </a>
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
