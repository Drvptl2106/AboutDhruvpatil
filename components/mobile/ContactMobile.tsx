"use client";

import CrowdCanvas from "@/components/CrowdCanvas";
import Reveal from "@/components/Reveal";
import { asset } from "@/lib/asset";
import { profile } from "@/lib/content";

/** The finale: the thread circles "your"; one big button to get in touch. */
export default function ContactMobile() {
  return (
    <section id="contact" className="relative z-10 pt-16">
      <div className="px-12">
        <Reveal className="text-[11px] uppercase tracking-[0.3em] text-subtle">(05) — Contact</Reveal>
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,11.5vw,3rem)] leading-[1.02] tracking-[-0.03em]">
          In this crowd
          <br />
          of people,
          <br />I can be
          <br />
          <em data-thread="final" className="italic text-muted">
            your
          </em>{" "}
          guy.
        </h2>
      </div>

      <div className="mt-14 px-6">
        <a
          href={`mailto:${profile.email}`}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink text-xs uppercase tracking-[0.22em] text-paper active:scale-[0.98]"
        >
          Hit me up <span aria-hidden>→</span>
        </a>
        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-[15px]">
          <li>
            <a href={`mailto:${profile.email}`} className="flex h-14 items-center justify-between">
              <span className="text-muted">Email</span>
              <span>{profile.email}</span>
            </a>
          </li>
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="flex h-14 items-center justify-between">
                <span>{s.label}</span>
                <span aria-hidden className="text-line">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-12 h-[34svh] min-h-[15rem]">
        <CrowdCanvas src={asset("/images/peeps/all-peeps.png")} rows={15} cols={7} />
      </div>
      <footer className="flex justify-between border-t border-ink/10 px-6 pb-[calc(env(safe-area-inset-bottom)+104px)] pt-5 text-[10px] uppercase tracking-[0.25em] text-subtle">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.location}</span>
      </footer>
    </section>
  );
}
