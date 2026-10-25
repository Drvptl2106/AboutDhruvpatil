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

/** Panel sizes in px, scaled to the viewport so all panels always fit. */
function usePanelSize() {
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const mobile = vp.w < 768;
  return {
    mobile,
    open: mobile ? clamp(vp.h * 0.42, 220, 352) : clamp(vp.w * 0.3, 256, 384),
    closed: mobile ? 44 : clamp(vp.w * 0.05, 40, 80),
    tall: mobile ? 0 : clamp(vp.h * 0.5, 288, 384),
  };
}

/**
 * Based on Skiper 52 HoverExpand_001 by @gurvinder-singh02 — Skiper UI
 * (https://gxuri.me). Expands horizontally on desktop and stacks into a
 * vertical accordion on phones. `active` is controlled so scroll can drive it.
 */
export const HoverExpand_001 = ({
  images,
  active,
  onActiveChange,
  className,
  show = true,
}: {
  images: WorkItem[];
  active: number;
  onActiveChange: (index: number) => void;
  className?: string;
  show?: boolean;
}) => {
  const { mobile, open, closed, tall } = usePanelSize();

  const size = (isActive: boolean) =>
    mobile
      ? { width: "100%", height: isActive ? open : closed }
      : { width: isActive ? open : closed, height: tall };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <div data-line-pass-x className="mx-auto flex w-full flex-col items-center justify-center gap-1 md:w-fit md:flex-row">
        {images.map((image, index) => {
          const isActive = active === index;
          return (
            <motion.div
              key={image.src}
              className="relative shrink-0 cursor-pointer overflow-hidden rounded-3xl"
              initial={false}
              animate={size(isActive)}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onActiveChange(index)}
              onHoverStart={() => onActiveChange(index)}
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
