"use client";

import { openHeritage } from "@/components/Heritage";
import Reveal from "@/components/Reveal";
import { profile } from "@/lib/content";

/** Full-screen opener; the thread starts here, underlining the headline. */
export default function HeroMobile({ show }: { show: boolean }) {
  return (
    <section id="top" className="relative z-10 flex min-h-[92svh] flex-col justify-center px-12 pb-24 pt-24">
      <Reveal show={show} delay={0.1}>
        <button
          type="button"
          onClick={openHeritage}
          className="font-serif text-lg italic text-muted underline decoration-dotted underline-offset-4"
        >
          {profile.tagline}
        </button>
      </Reveal>
      <h1
        data-thread="title"
        className="mt-5 w-fit font-serif text-[clamp(2.6rem,12.5vw,3.5rem)] leading-[0.92] tracking-[-0.03em]"
      >
        <Reveal show={show} delay={0.2}>
          Follow the line
        </Reveal>
        <Reveal show={show} delay={0.3}>
          it knows
        </Reveal>
        <Reveal show={show} delay={0.4} className="-mb-[0.14em] pb-[0.14em]">
          <em className="italic text-muted">where I&apos;ve been</em>
        </Reveal>
      </h1>
    </section>
  );
}
