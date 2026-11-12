"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * "Dev borem karun", explained. Clicking the tagline (top-left on desktop,
 * above the headline on phones) dims the page with a circle growing from the
 * click, the way the theme switch does, and a small cluster of cards floats
 * up: what the phrase means, with Goa — where it's said — as the backdrop.
 *
 * Everything you might want to rewrite is in `copy` below. Photos come from
 * Wikimedia Commons under free licences; their credits are on the cards.
 */

export const HERITAGE_EVENT = "heritage";

/** Open the cards from where the click happened. */
export function openHeritage(e: React.MouseEvent) {
  window.dispatchEvent(new CustomEvent(HERITAGE_EVENT, { detail: { x: e.clientX, y: e.clientY } }));
}

const WM = "https://upload.wikimedia.org/wikipedia/commons/thumb";

const copy = {
  lyrics: {
    label: "Konkani",
    script: "देव बरें करूं",
    lines: ["Dev borem karun.", "May God do good.", "It’s how we say", "thank you in Goa."],
  },
  artist: {
    label: "Where it’s said",
    photo: `${WM}/4/41/Miranda_de_Miranda.jpg/960px-Miranda_de_Miranda.jpg`,
    credit: { by: "Frederick Noronha", licence: "CC BY 3.0", href: "https://commons.wikimedia.org/wiki/File:Miranda_de_Miranda.jpg" },
    name: "Mario Miranda",
    meta: "Goa’s cartoonist · 1926–2011",
    body: "He drew the Goa you hear it in: busy markets, village feasts, neighbours who stop to talk. There, nobody just says thanks — they wish good on you.",
  },
  languages: [
    { lang: "Konkani", say: "Dev borem karun", note: "Wishes good on you, not just thanks." },
    { lang: "Portuguese", say: "Obrigado", note: "Four and a half centuries of Portugal left this one in Goa too." },
    { lang: "English", say: "Thank you", note: "The short version." },
  ],
  distance: { big: "7,700", unit: "km", line: "Goa to Newcastle. The phrase made the trip." },
  mando: {
    meta: "Goa · Village feast",
    title: "Mando",
    body: "The sound of Goan weddings and feasts — where thanks get sung.",
    next: "Dekhni",
    href: "https://open.spotify.com/search/goan%20mando",
  },
  festivals: {
    title: "Where you’ll hear it",
    rows: [
      {
        name: "Carnival",
        when: "February · floats and street dance",
        photo: `${WM}/6/6b/Kunbi_dance_at_Mapusa_Goa_Carnival.jpg/330px-Kunbi_dance_at_Mapusa_Goa_Carnival.jpg`,
        href: "https://commons.wikimedia.org/wiki/File:Kunbi_dance_at_Mapusa_Goa_Carnival.jpg",
      },
      {
        name: "Shigmo",
        when: "Spring · folk troupes and colour",
        photo: `${WM}/0/0c/Goa_Shigmo_Parade_March_2026_20.jpg/330px-Goa_Shigmo_Parade_March_2026_20.jpg`,
        href: "https://commons.wikimedia.org/wiki/File:Goa_Shigmo_Parade_March_2026_20.jpg",
      },
      {
        name: "São João",
        when: "24 June · boats, crowns, the monsoon",
        photo: `${WM}/b/b1/S%C3%A3o_Jo%C3%A3o_boat_festival_in_Siolim%2C_Goa_in_2024.jpg/330px-S%C3%A3o_Jo%C3%A3o_boat_festival_in_Siolim%2C_Goa_in_2024.jpg`,
        href: "https://commons.wikimedia.org/wiki/File:S%C3%A3o_Jo%C3%A3o_boat_festival_in_Siolim,_Goa_in_2024.jpg",
      },
    ],
    credit: "Photos: Josephdesouza, Frederick Noronha (CC BY-SA 4.0), SerChevalerie (CC0), via Wikimedia Commons",
  },
};

// The cards' own palette: dark whatever the page theme, like the reference.
const ORANGE = "#ff6a2b";
const card = "rounded-[26px] bg-[#1e1e1e] text-[#f2f2f2] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/5";
const muted = "text-[#8d8d8d]";

function Lyrics() {
  const { label, script, lines } = copy.lyrics;
  const colours = ["#f2f2f2", ORANGE, "#bdbdbd", "#6f6f6f"];
  return (
    <section className={cn(card, "flex h-full flex-col p-6")}>
      <div className="flex items-center justify-between">
        <p className="text-[15px]">{label}</p>
        <p className={cn("text-sm", muted)}>{script}</p>
      </div>
      <div className="mt-5 space-y-3 text-[21px] leading-snug">
        {lines.map((l, i) => (
          <p key={l} style={{ color: colours[i] }}>
            {l}
          </p>
        ))}
      </div>
    </section>
  );
}

function Artist({ onClose }: { onClose: () => void }) {
  const a = copy.artist;
  return (
    <section className={cn(card, "flex h-full flex-col p-6")}>
      <p className="text-[15px]">{a.label}</p>
      <div className="relative mt-4 overflow-hidden rounded-2xl">
        <img src={a.photo} alt={a.name} className="aspect-[5/3] w-full object-cover" />
        <a
          href={a.credit.href}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-1.5 right-2 text-[9px] text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]"
        >
          {a.credit.by} · {a.credit.licence}
        </a>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="whitespace-nowrap text-xl">{a.name}</h3>
          <p className={cn("text-xs", muted)}>{a.meta}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full bg-[#f2f2f2] px-3.5 py-2 text-[12px] font-medium text-[#111] transition-transform active:scale-95"
        >
          Dev borem karun
        </button>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-[#cfcfcf]">{a.body}</p>
    </section>
  );
}

function Languages() {
  const [pick, setPick] = useState(0);
  const [warmth, setWarmth] = useState(85);
  const chosen = copy.languages[pick];
  return (
    <section className={cn(card, "flex h-full flex-col p-6")}>
      <p className="text-[15px]">Say thanks in</p>
      <div className="mt-3">
        {copy.languages.map((l, i) => (
          <button
            key={l.lang}
            type="button"
            role="radio"
            aria-checked={pick === i}
            onClick={() => setPick(i)}
            className="flex w-full items-center justify-between py-2"
          >
            <span className="text-[14px]">{l.lang}</span>
            <span className={cn("relative block h-6 w-11 shrink-0 rounded-full transition-colors", pick === i ? "bg-[#ff6a2b]" : "bg-[#3a3a3a]")}>
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform",
                  pick === i ? "translate-x-5" : "translate-x-0",
                )}
              />
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[17px]" style={{ color: ORANGE }}>
        {chosen.say}
      </p>
      <p className={cn("text-xs leading-snug", muted)}>{chosen.note}</p>
      <label className="mt-auto block pt-3">
        <span className="sr-only">How much you mean it</span>
        <input
          type="range"
          min={0}
          max={100}
          value={warmth}
          onChange={(e) => setWarmth(Number(e.target.value))}
          className="w-full accent-[#ff6a2b]"
        />
        <span className={cn("flex justify-between text-[11px]", muted)}>
          <span>Polite</span>
          <span>Means it</span>
        </span>
      </label>
    </section>
  );
}

function Distance() {
  const d = copy.distance;
  return (
    <section className={cn(card, "relative flex h-full flex-col overflow-hidden p-6")}>
      {/* A record peeking from the corner, as in the reference */}
      <span aria-hidden className="absolute -right-9 -top-9 size-28 rounded-full bg-[#121212] ring-1 ring-white/5">
        <span className="absolute inset-[36%] rounded-full" style={{ background: ORANGE }} />
      </span>
      <p className={cn("text-xs", muted)}>♫ Home</p>
      <p className="mt-auto flex items-baseline gap-1.5">
        <span className="text-[52px] font-light leading-none tracking-tight">{d.big}</span>
        <span className="text-xl text-[#bdbdbd]">{d.unit}</span>
      </p>
      <p className={cn("mt-2 text-xs leading-snug", muted)}>{d.line}</p>
    </section>
  );
}

function Mando() {
  const m = copy.mando;
  const bars = [10, 22, 14, 30, 18, 26, 12, 34, 20, 28, 16, 24, 32, 14, 26, 18, 30, 12, 22, 28, 16, 34, 20, 14, 26, 18, 24, 12, 30, 20];
  return (
    <section className={cn(card, "flex h-full flex-col p-6")}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-xs", muted)}>{m.meta}</p>
          <h3 className="mt-0.5 text-xl">{m.title}</h3>
        </div>
        <span aria-hidden className="text-xl text-[#bdbdbd]">
          ♡
        </span>
      </div>
      <p className={cn("mt-1 text-xs leading-snug", muted)}>{m.body}</p>
      <div className="mt-3 flex h-10 items-center gap-[5px]" aria-hidden>
        {bars.map((v, i) => (
          <span key={i} className="w-[3px] rounded-full" style={{ height: v, background: i < 12 ? ORANGE : "#6b6b6b" }} />
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between px-1 pt-2">
        <span aria-hidden className="text-base text-[#8d8d8d]">
          ⤨
        </span>
        <span aria-hidden className="text-base" style={{ color: ORANGE }}>
          ⏮
        </span>
        <a
          href={m.href}
          target="_blank"
          rel="noreferrer"
          aria-label="Listen to Mando on Spotify"
          className="flex size-12 items-center justify-center rounded-full bg-[#f2f2f2] transition-transform active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="ml-0.5 size-5" aria-hidden>
            <path d="M7 4.5v15l13-7.5z" fill={ORANGE} />
          </svg>
        </a>
        <span aria-hidden className="text-base" style={{ color: ORANGE }}>
          ⏭
        </span>
        <span className={cn("text-[11px]", muted)}>Next: {m.next}</span>
      </div>
    </section>
  );
}

function Festivals() {
  const f = copy.festivals;
  return (
    <section className={cn(card, "flex h-full flex-col p-6")}>
      <p className="text-[15px]">{f.title}</p>
      <ul className="mt-3 space-y-2">
        {f.rows.map((r) => (
          <li key={r.name}>
            <a
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-[#272727] p-2 pr-2.5 transition-colors hover:bg-[#2f2f2f]"
            >
              <img src={r.photo} alt={r.name} className="size-11 shrink-0 rounded-full object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px]">{r.name}</span>
                <span className={cn("block text-[11px] leading-snug", muted)}>{r.when}</span>
              </span>
              <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-sm text-[#111]">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-2 text-[9px] leading-snug text-[#6a6a6a]">{f.credit}</p>
    </section>
  );
}

// Desktop: the cards laid out like the reference, on a fixed canvas that is
// scaled to fit the screen. Positions in canvas pixels.
const W = 980;
const H = 690;
const layout = [
  { key: "lyrics", x: 0, y: 150, w: 280, h: 270 },
  { key: "distance", x: 80, y: 440, w: 200, h: 170 },
  { key: "artist", x: 300, y: 10, w: 340, h: 420 },
  { key: "mando", x: 300, y: 450, w: 340, h: 240 },
  { key: "languages", x: 660, y: 20, w: 260, h: 320 },
  { key: "festivals", x: 660, y: 356, w: 320, h: 320 },
] as const;

function useFit() {
  const [fit, setFit] = useState({ scale: 1, wide: true });
  useEffect(() => {
    const update = () =>
      setFit({
        wide: innerWidth >= 768,
        scale: Math.min(1, (innerWidth - 64) / W, (innerHeight - 64) / H),
      });
    update();
    addEventListener("resize", update);
    return () => removeEventListener("resize", update);
  }, []);
  return fit;
}

/**
 * The overlay: the page dims under a circle growing from the click, the
 * cards float up one after another. Escape, the ×, a click on the dimmed page
 * or "Dev borem karun" (thank you) closes it.
 */
export default function Heritage() {
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const { scale, wide } = useFit();

  useEffect(() => {
    const show = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      setAt(d ?? { x: innerWidth / 2, y: innerHeight / 2 });
      setOpen(true);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener(HERITAGE_EVENT, show);
    addEventListener("keydown", key);
    return () => {
      removeEventListener(HERITAGE_EVENT, show);
      removeEventListener("keydown", key);
    };
  }, []);

  // Hold the page still underneath while it's open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    import("@/lib/smooth").then(({ getLenis }) => getLenis()?.stop());
    return () => {
      root.style.overflow = prev;
      import("@/lib/smooth").then(({ getLenis }) => getLenis()?.start());
    };
  }, [open]);

  const close = () => setOpen(false);
  const x = at?.x ?? 0;
  const y = at?.y ?? 0;
  const radius = typeof window === "undefined" ? 2000 : Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const cards: Record<(typeof layout)[number]["key"], React.ReactNode> = {
    lyrics: <Lyrics />,
    distance: <Distance />,
    artist: <Artist onClose={close} />,
    mando: <Mando />,
    languages: <Languages />,
    festivals: <Festivals />,
  };
  const rise = (i: number) => ({
    initial: { opacity: 0, y: 28, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
    transition: { duration: 0.6, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Dev borem karun" className="fixed inset-0 z-[95]">
          {/* The dimmed page, washing in from the click like the theme switch */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-[6px]"
            onClick={close}
            initial={{ clipPath: `circle(0px at ${x}px ${y}px)` }}
            animate={{ clipPath: `circle(${radius}px at ${x}px ${y}px)` }}
            exit={{ clipPath: `circle(0px at ${x}px ${y}px)` }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.button
            type="button"
            onClick={close}
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center rounded-full bg-[#1e1e1e] text-xl text-[#f2f2f2] ring-1 ring-white/10 hover:bg-[#2a2a2a]"
          >
            ×
          </motion.button>

          {wide ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: W * scale, height: H * scale }}>
                <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
                  {layout.map((l, i) => (
                    <motion.div
                      key={l.key}
                      {...rise(i)}
                      className="pointer-events-auto absolute"
                      style={{ left: l.x, top: l.y, width: l.w, height: l.h }}
                    >
                      {cards[l.key]}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Phones: the same cards, stacked in a sheet you scroll.
            <div className="absolute inset-0 overflow-y-auto overscroll-contain px-4 pb-10 pt-20" data-lenis-prevent onClick={close}>
              <div className="mx-auto flex max-w-[420px] flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                {(["lyrics", "artist", "languages", "distance", "mando", "festivals"] as const).map((k, i) => (
                  <motion.div key={k} {...rise(i)} className={k === "distance" ? "h-[180px]" : ""}>
                    {cards[k]}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
