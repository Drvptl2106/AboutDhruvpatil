"use client";

import { motion } from "framer-motion";

import ThemeToggle from "@/components/ThemeToggle";
import { profile } from "@/lib/content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ show }: { show: boolean }) {
  const fade = {
    initial: { opacity: 0, y: -12 },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 },
    transition: { duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <>
      {/* Difference blend keeps the text legible over any section or theme. */}
      <motion.nav
        {...fade}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between py-5 pl-5 pr-20 text-[11px] uppercase tracking-[0.25em] text-white mix-blend-difference md:pl-8 md:pr-24"
      >
        <a href="#work" className="whitespace-nowrap">
          {profile.name}
        </a>
        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="opacity-60 transition-opacity hover:opacity-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>
      <motion.div {...fade} className="fixed right-5 top-3 z-50 md:right-8">
        <ThemeToggle />
      </motion.div>
    </>
  );
}
