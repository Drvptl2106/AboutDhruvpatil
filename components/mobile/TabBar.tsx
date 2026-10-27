"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const tabs = [
  { id: "work", sections: ["work"], label: "Work", icon: "M4 5h7v6H4zM13 5h7v14h-7zM4 13h7v6H4z" },
  {
    id: "experience",
    sections: ["experience", "education"],
    label: "Journey",
    icon: "M6 4v16M6 8c6 0 12 1 12 6s-6 6-12 6",
  },
  {
    id: "about",
    sections: ["about"],
    label: "About",
    icon: "M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z",
  },
  { id: "contact", sections: ["contact"], label: "Contact", icon: "M4 6h16v10H8l-4 4z" },
];

/** Bottom tab bar within thumb reach; follows the section in view. */
export default function TabBar({ show }: { show: boolean }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const tab = tabs.find((t) => t.sections.includes(e.target.id));
          setCurrent(tab ? tab.id : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", ...tabs.flatMap((t) => t.sections)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    // The outer layer centres it; the inner one animates (an animated
    // transform would otherwise replace the centring).
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-50 flex justify-center px-3">
      <motion.nav
        aria-label="Sections"
        initial={{ opacity: 0, y: 24 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto w-full max-w-[456px]"
      >
        <ul className="flex rounded-full border border-ink/10 bg-paper/85 p-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {tabs.map((t) => (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                aria-current={current === t.id ? "true" : undefined}
                onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth" })}
                className={cn(
                  "flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-full text-[10px] uppercase tracking-[0.12em] transition-colors",
                  current === t.id ? "bg-ink text-paper" : "text-subtle",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d={t.icon} />
                </svg>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </motion.nav>
    </div>
  );
}
