"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * "Light / Dark" as two words, the current one at full strength. The new theme
 * is revealed as a circle growing from where you clicked (View Transitions).
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("light"));
  }, []);

  const set = (dark: boolean, e: React.MouseEvent<HTMLButtonElement>) => {
    if (dark === isDark) return;
    const apply = () => {
      document.documentElement.classList.toggle("light", !dark);
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch {}
      setIsDark(dark);
    };

    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  const word = (dark: boolean, label: string) => (
    <button
      type="button"
      onClick={(e) => set(dark, e)}
      aria-pressed={isDark === dark}
      className={cn("transition-opacity hover:opacity-100", isDark === dark ? "opacity-100" : "opacity-40")}
    >
      {label}
    </button>
  );

  return (
    <span role="group" aria-label="Theme" className={cn("inline-flex items-center gap-1.5", className)}>
      {word(false, "Light")}
      <span aria-hidden className="opacity-40">
        /
      </span>
      {word(true, "Dark")}
    </span>
  );
}
