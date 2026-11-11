"use client";

import { useState } from "react";

import DesktopView from "@/components/DesktopView";
import Intro from "@/components/Intro";
import MobileView from "@/components/mobile/MobileView";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * One address for every screen: the intro, then the layout that fits the
 * window (it switches if the window is resized across the breakpoint).
 */
export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const mobile = useIsMobile();

  return (
    <main>
      <Intro onDone={() => setIntroDone(true)} />
      {mobile === null ? null : mobile ? <MobileView show={introDone} /> : <DesktopView show={introDone} />}
    </main>
  );
}
