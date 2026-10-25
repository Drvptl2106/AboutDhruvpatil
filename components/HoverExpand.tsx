"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type WorkItem = {
  src: string;
  alt: string;
  code: string;
  title: string;
  category: string;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Panel sizes in px, scaled so the whole strip always fits on screen. */
function usePanelSize(count: number) {
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const mobile = vp.w < 768;
  if (mobile) {
    return { mobile, open: clamp(vp.h * 0.3, 180, 280), closed: 30, height: 0 };
  }
  const open = clamp(vp.w * 0.27, 260, 420);
  const room = Math.min(vp.w - 120, 1100) - open - (count - 1) * 4;
  return { mobile, open, closed: clamp(room / (count - 1), 36, 64), height: clamp(vp.h * 0.42, 280, 400) };
}

/**
 * Based on Skiper 52 HoverExpand_001 by @gurvinder-singh02 — Skiper UI
 * (https://gxuri.me). Hover (or tap) opens a project. A row on desktop,
 * a stacked accordion on phones; always fully visible.
 */
export const HoverExpand_001 = ({
  images,
  className,
  show = true,
}: {
  images: WorkItem[];
  className?: string;
  show?: boolean;
}) => {
  const [active, setActive] = useState(1);
  const { mobile, open, closed, height } = usePanelSize(images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className={cn("relative flex w-full justify-center px-5", className)}
    >
      {/* Solid backing fills the gaps, so the line passes cleanly behind. */}
      <div data-line-gallery className="flex w-[80%] flex-col gap-1 bg-paper md:w-fit md:flex-row">
        {images.map((image, index) => {
          const isActive = active === index;
          return (
            <motion.div
              key={image.src}
              className="relative shrink-0 cursor-pointer overflow-hidden rounded-3xl"
              initial={false}
              animate={
                mobile
                  ? { width: "100%", height: isActive ? open : closed }
                  : { width: isActive ? open : closed, height }
              }
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActive(index)}
              onHoverStart={() => setActive(index)}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-10 h-full w-full bg-gradient-to-t from-black/60 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.15 }}
                    className="absolute z-20 flex h-full w-full items-end justify-between p-5"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">{image.category}</p>
                      <p className="mt-1 whitespace-nowrap font-serif text-2xl text-white">{image.title}</p>
                    </div>
                    <p className="text-xs text-white/50">{image.code}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img src={image.src} className="size-full object-cover" alt={image.alt} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
