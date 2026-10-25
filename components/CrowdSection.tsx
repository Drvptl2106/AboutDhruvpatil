"use client";

import { motion } from "framer-motion";

import CrowdCanvas from "@/components/CrowdCanvas";
import { asset } from "@/lib/asset";
import { profile } from "@/lib/content";

/** The finale: the scroll line ends by circling "your" (`data-line-final`). */
export default function CrowdSection() {
  return (
    <section id="contact" data-line-step="crowd" className="relative z-10 w-full pt-40 md:pt-56">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
        className="mx-auto flex max-w-5xl flex-col items-center px-5 text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">(05) — Contact</p>

        <h2 className="mt-8 font-serif text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.98] tracking-[-0.03em]">
          In this crowd of people,
          <br />I can be{" "}
          <em data-line-final className="italic text-muted">
            your
          </em>{" "}
          guy.
        </h2>

        <a
          href={`mailto:${profile.email}`}
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-transform hover:scale-[1.04]"
        >
          Hit me up
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted">
          <li className="normal-case tracking-normal">
            <a href={`mailto:${profile.email}`} className="hover:text-accent">
              {profile.email}
            </a>
          </li>
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-accent">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="relative mt-10 h-[48svh] min-h-[22rem] md:h-[62svh]">
        <CrowdCanvas src={asset("/images/peeps/all-peeps.png")} rows={15} cols={7} />
      </div>

      <p className="flex justify-between border-t border-ink/10 px-5 py-5 text-[10px] uppercase tracking-[0.25em] text-subtle">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.location}</span>
      </p>
    </section>
  );
}
