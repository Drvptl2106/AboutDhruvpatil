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

function useIsMobile(query = "(max-width: 767px)") {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/**
 * Based on Skiper 52 HoverExpand_001 by @gurvinder-singh02 — Skiper UI
 * (https://gxuri.me). Expands horizontally on desktop and stacks into a
 * vertical accordion on phones so nothing overflows.
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
  const [activeImage, setActiveImage] = useState<number | null>(1);
  const isMobile = useIsMobile();

  const size = (active: boolean) =>
    isMobile
      ? { width: "100%", height: active ? "22rem" : "3.5rem" }
      : { width: active ? "24rem" : "5rem", height: "24rem" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <div className="flex w-full flex-col items-center justify-center gap-1 md:flex-row">
        {images.map((image, index) => {
          const active = activeImage === index;
          return (
            <motion.div
              key={image.src}
              className="relative shrink-0 cursor-pointer overflow-hidden rounded-3xl"
              initial={false}
              animate={size(active)}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-10 h-full w-full bg-gradient-to-t from-black/60 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.15 }}
                    className="absolute z-20 flex h-full w-full items-end justify-between p-5"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                        {image.category}
                      </p>
                      <p className="mt-1 whitespace-nowrap font-serif text-2xl text-white">
                        {image.title}
                      </p>
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
