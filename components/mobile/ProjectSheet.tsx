"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { WorkItem } from "@/components/HoverExpand";

/** Bottom sheet for one project: slides up, drag it down (or tap outside) to close. */
export default function ProjectSheet({ item, onClose }: { item: WorkItem | null; onClose: () => void }) {
  // Rendered at the top of the page, above the tab bar and every section.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Hold the page still behind the sheet, and let Escape close it.
  useEffect(() => {
    if (!item) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            className="fixed inset-x-0 bottom-0 z-[61] mx-auto max-w-[480px] rounded-t-[28px] bg-paper pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.5)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 340 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => (info.offset.y > 110 || info.velocity.y > 600) && onClose()}
          >
            <div className="flex justify-center pb-1 pt-3">
              <span className="h-1.5 w-10 rounded-full bg-ink/20" />
            </div>
            <div className="px-5 pt-3">
              <img src={item.src} alt={item.alt} draggable={false} className="aspect-[16/10] w-full select-none rounded-2xl object-cover" />
              <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-subtle">
                {item.category} · {item.code}
              </p>
              <h3 className="mt-1 font-serif text-[2rem] leading-tight">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {item.blurb ?? "A short description of this project: what it is, your role, and what it achieved."}
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href={item.href ?? "#"}
                  className="flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-xs uppercase tracking-[0.2em] text-paper"
                >
                  View project →
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-12 items-center justify-center rounded-full border border-ink/15 px-6 text-xs uppercase tracking-[0.2em]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
