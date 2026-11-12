"use client";

import { motion } from "framer-motion";

import { allSectionIds, goTo, linkFor, sections } from "@/lib/apps";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

/** The sections as words, within thumb reach; the one you're in is filled. */
export default function TabBar({ show }: { show: boolean }) {
  const current = linkFor(useActiveSection(allSectionIds));

  return (
    // The outer layer centres it; the inner one animates (an animated
    // transform would otherwise replace the centring).
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-50 flex justify-center px-4">
      <motion.nav
        aria-label="Sections"
        initial={{ opacity: 0, y: 24 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full max-w-[440px]"
      >
        <ul className="flex rounded-full border border-ink/10 bg-paper/85 p-1 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {sections.map((s) => {
            const on = current === s.id;
            return (
              <li key={s.id} className="flex-1">
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(s.id);
                  }}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-full text-[10px] uppercase tracking-[0.18em] transition-colors",
                    on ? "bg-ink text-paper" : "text-muted",
                  )}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}
