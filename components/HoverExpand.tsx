"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type WorkItem = {
  src: string;
  alt: string;
  code: string;
  title: string;
  category: string;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Panel sizes in px, scaled to the viewport. */
function usePanelSize() {
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    open: clamp(vp.w * 0.36, 280, 560),
    closed: clamp(vp.w * 0.075, 64, 120),
    height: clamp(vp.h * 0.55, 340, 520),
  };
}

/**
 * Based on Skiper 52 HoverExpand_001 by @gurvinder-singh02 — Skiper UI
 * (https://gxuri.me). Hover (or tap) opens a project; the strip scrolls
 * sideways with a trackpad, by swiping, or by dragging with the mouse.
 * Vertical scrolling is left alone so the page keeps moving.
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
  const [active, setActive] = useState(0);
  const { open, closed, height } = usePanelSize();
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !scroller.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    scroller.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    // Let the click that ends a drag through only if nothing moved.
    setTimeout(() => (drag.current = null), 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <div
        ref={scroller}
        data-line-gallery
        className="no-scrollbar cursor-grab overflow-x-auto bg-paper active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => drag.current?.moved && e.stopPropagation()}
      >
        <div className="flex w-max gap-1 px-5">
          {images.map((image, index) => {
            const isActive = active === index;
            return (
              <motion.div
                key={image.src}
                className="relative shrink-0 overflow-hidden rounded-3xl"
                initial={false}
                animate={{ width: isActive ? open : closed, height }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActive(index)}
                onHoverStart={() => !drag.current && setActive(index)}
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
                <img src={image.src} draggable={false} className="size-full select-none object-cover" alt={image.alt} />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex justify-between px-5 text-[11px] uppercase tracking-[0.25em] text-subtle">
        <span>
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <span>Drag or scroll sideways →</span>
      </div>
    </motion.div>
  );
};
