"use client";

import { AnimatePresence, motion, type MotionValue, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import AppIcon from "@/components/frame/AppIcon";
import { type App, dockApps, goTo } from "@/lib/apps";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

const BASE = 48;
const PEAK = 76;
const REACH = 150; // px either side of the pointer that swells

function DockItem({ app, mouseX, active }: { app: App; mouseX: MotionValue<number>; active: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const still = useReducedMotion();
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - (b.left + b.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-REACH, 0, REACH], [BASE, still ? BASE : PEAK, BASE]);
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });

  const outside = "href" in app.target;
  return (
    <li className="relative flex flex-col items-center">
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md border border-ink/10 bg-paper/90 px-2.5 py-1 text-[11px] text-ink shadow-md backdrop-blur"
          >
            {app.label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.a
        ref={ref}
        href={outside ? (app.target as { href: string }).href : `#${(app.target as { section: string }).section}`}
        {...(outside ? { target: "_blank", rel: "noreferrer" } : {})}
        aria-label={app.label}
        aria-current={active ? "true" : undefined}
        onClick={(e) => {
          if (outside) return;
          e.preventDefault();
          goTo((app.target as { section: string }).section);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{ width: size, height: size }}
        className="block rounded-[23%] outline-none focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <AppIcon id={app.id} />
      </motion.a>
      {/* The "app is open" dot, under whichever section you're in. */}
      <span className={cn("mt-1 size-1 rounded-full bg-ink transition-opacity", active ? "opacity-70" : "opacity-0")} />
    </li>
  );
}

/** A macOS-style dock at the bottom centre: one app per section, then your links. */
export default function Dock({ show }: { show: boolean }) {
  const apps = dockApps();
  const mouseX = useMotionValue(Infinity);
  const current = useActiveSection(apps.flatMap((a) => a.sections ?? []));
  const internal = apps.filter((a) => !("href" in a.target) && a.sections);
  const external = apps.filter((a) => !internal.includes(a));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center">
      <motion.nav
        aria-label="Sections"
        initial={{ opacity: 0, y: 30 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto"
      >
        <ul
          className="flex items-end gap-2.5 rounded-[22px] border border-ink/10 bg-paper/55 px-2.5 pb-1 pt-2.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          style={{ height: BASE + 22 }}
        >
          {internal.map((app) => (
            <DockItem key={app.id} app={app} mouseX={mouseX} active={!!current && !!app.sections?.includes(current)} />
          ))}
          <li aria-hidden className="mx-0.5 mb-2 h-10 w-px self-end bg-ink/15" />
          {external.map((app) => (
            <DockItem key={app.id} app={app} mouseX={mouseX} active={!!current && !!app.sections?.includes(current)} />
          ))}
        </ul>
      </motion.nav>
    </div>
  );
}
