"use client";

import { useRef, useState } from "react";

import ProjectSheet from "@/components/mobile/ProjectSheet";
import SectionTitle from "@/components/mobile/SectionTitle";
import { work } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Swipe through projects (native snap), tap one to open its sheet. */
export default function WorkCarousel() {
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const onScroll = () => {
    const el = strip.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const i = Math.round(el.scrollLeft / (card.offsetWidth + 12));
    setActive(Math.min(work.length - 1, Math.max(0, i)));
  };

  return (
    <section id="work" className="relative z-10 pb-24 pt-10">
      <SectionTitle index="01" label="Selected work">
        My <em className="italic text-muted">Work</em>
      </SectionTitle>

      <div
        ref={strip}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory scroll-pl-12 gap-3 overflow-x-auto overscroll-x-contain pb-2 pl-12 pr-8"
      >
        {work.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open ${p.title}`}
            className={cn(
              "relative aspect-[4/5] w-[min(74vw,330px)] shrink-0 snap-start overflow-hidden rounded-[28px] text-left transition-transform duration-500 ease-out",
              i === active ? "scale-100" : "scale-[0.94]",
            )}
          >
            <img src={p.src} alt="" draggable={false} className="absolute inset-0 size-full select-none object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute right-4 top-4 text-[11px] text-white/60">{p.code}</span>
            <span className="absolute inset-x-5 bottom-5">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-white/65">{p.category}</span>
              <span className="mt-1 block font-serif text-[1.75rem] leading-tight text-white">{p.title}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4 pl-12 pr-8 text-[11px] uppercase tracking-[0.25em] text-subtle">
        <span className="tabular-nums text-ink">
          {String(active + 1).padStart(2, "0")} / {String(work.length).padStart(2, "0")}
        </span>
        <span className="relative h-px flex-1 bg-ink/15">
          <span
            className="absolute inset-y-0 left-0 bg-line transition-[width] duration-500"
            style={{ width: `${((active + 1) / work.length) * 100}%` }}
          />
        </span>
        <span>Swipe · tap</span>
      </div>

      <ProjectSheet item={open === null ? null : work[open]} onClose={() => setOpen(null)} />
    </section>
  );
}
