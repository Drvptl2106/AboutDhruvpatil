"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { setLenis } from "@/lib/smooth";

/** Buttery inertial scrolling (Lenis), as used across the Skiper UI demos. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, anchors: true });
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
