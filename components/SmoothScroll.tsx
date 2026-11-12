"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { setLenis } from "@/lib/smooth";

/** Buttery inertial scrolling (Lenis), as used across the Skiper UI demos. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Slower and heavier than Lenis' defaults, so each scene has time to play.
      lerp: 0.06,
      wheelMultiplier: 0.7,
      touchMultiplier: 0.8,
      anchors: true,
    });
    setLenis(lenis);
    // Held still until the intro finishes (see Intro.tsx).
    if (document.body.classList.contains("intro-running")) lenis.stop();

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
