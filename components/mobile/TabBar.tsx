"use client";

import { motion } from "framer-motion";

import AppIcon from "@/components/frame/AppIcon";
import { dockApps, goTo } from "@/lib/apps";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

/**
 * The phone's dock: the same apps as the desktop one, within thumb reach,
 * with a dot under the section you're in.
 */
export default function TabBar({ show }: { show: boolean }) {
  // Sections first, then Spotify; the other outside links live in Contact.
  const apps = dockApps().filter((a) => a.sections || a.id === "spotify");
  const current = useActiveSection(apps.flatMap((a) => a.sections ?? []));

  return (
    // The outer layer centres it; the inner one animates (an animated
    // transform would otherwise replace the centring).
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+10px)] z-50 flex justify-center px-3">
      <motion.nav
        aria-label="Sections"
        initial={{ opacity: 0, y: 24 }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto"
      >
        <ul className="flex items-start gap-3 rounded-[24px] border border-ink/10 bg-paper/60 px-3 pb-1.5 pt-2.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          {apps.map((app) => {
            const active = !!current && !!app.sections?.includes(current);
            const outside = "href" in app.target;
            return (
              <li key={app.id} className="flex flex-col items-center">
                <a
                  href={outside ? (app.target as { href: string }).href : `#${(app.target as { section: string }).section}`}
                  {...(outside ? { target: "_blank", rel: "noreferrer" } : {})}
                  aria-label={app.label}
                  aria-current={active ? "true" : undefined}
                  onClick={(e) => {
                    if (outside) return;
                    e.preventDefault();
                    goTo((app.target as { section: string }).section);
                  }}
                  className="block size-12 transition-transform active:scale-90"
                >
                  <AppIcon id={app.id} />
                </a>
                <span className={cn("mt-1 size-1 rounded-full bg-ink transition-opacity", active ? "opacity-70" : "opacity-0")} />
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}
