"use client";

import { motion } from "framer-motion";

import ThemeToggle from "@/components/ThemeToggle";
import { profile } from "@/lib/content";

/** Slim top bar: your name and the theme switch, kept out of the thumb zone. */
export default function MobileHeader({ show }: { show: boolean }) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="fixed left-1/2 top-0 z-50 flex h-[calc(env(safe-area-inset-top)+56px)] w-full max-w-[480px] -translate-x-1/2 items-end justify-between bg-gradient-to-b from-paper via-paper/85 to-transparent px-5 pb-2"
    >
      <a href="#top" className="text-[11px] uppercase tracking-[0.25em]">
        {profile.name}
      </a>
      <ThemeToggle className="size-9" />
    </motion.header>
  );
}
