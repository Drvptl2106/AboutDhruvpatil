"use client";

import { motion } from "framer-motion";

import CrowdCanvas from "@/components/CrowdCanvas";
import { asset } from "@/lib/asset";
import { profile } from "@/lib/content";

/**
 * Closing card. Always light (the Open Peeps are black line drawings), so it
 * reads as a bright final frame in dark mode too.
 */
export default function CrowdSection() {
  return (
    <section id="contact" className="relative z-10 px-3 pb-3 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[40rem] w-full md:h-[max(100svh,46rem)] overflow-hidden rounded-[2.5rem] border border-black/5 bg-[#fbfaf6] text-[#151515]"
      >
        <div className="relative z-10 px-6 pt-8 md:px-10">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-black/45">
            <span>(05) — Contact</span>
            <span>Open to work</span>
          </div>

          <h2 className="mt-12 max-w-5xl font-serif text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.03em] md:mt-16">
            In this crowd of people,
            <br />I can be <em className="italic text-black/50">your</em> guy.
          </h2>

          <div className="mt-8 flex flex-col gap-6 text-xs uppercase tracking-[0.2em] md:flex-row md:items-end md:justify-between">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#151515] px-6 py-4 text-[#fbfaf6] transition-transform hover:scale-[1.03]"
            >
              Hit me up
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              <li className="normal-case tracking-normal">
                <a href={`mailto:${profile.email}`} className="hover:underline">
                  {profile.email}
                </a>
              </li>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:underline">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CrowdCanvas src={asset("/images/peeps/all-peeps.png")} rows={15} cols={7} />
      </motion.div>

      <p className="flex justify-between px-4 pt-4 text-[10px] uppercase tracking-[0.25em] text-subtle">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.location}</span>
      </p>
    </section>
  );
}
