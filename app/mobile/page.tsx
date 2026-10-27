"use client";

import { useState } from "react";

import Intro from "@/components/Intro";
import AboutMobile from "@/components/mobile/AboutMobile";
import ContactMobile from "@/components/mobile/ContactMobile";
import HeroMobile from "@/components/mobile/HeroMobile";
import MobileHeader from "@/components/mobile/MobileHeader";
import TabBar from "@/components/mobile/TabBar";
import Thread from "@/components/mobile/Thread";
import TimelineMobile from "@/components/mobile/TimelineMobile";
import WorkCarousel from "@/components/mobile/WorkCarousel";
import { education, experience } from "@/lib/content";

/**
 * The phone version, designed for touch: normal scrolling throughout, one
 * thread down the left gutter, swipeable projects, a bottom tab bar.
 * Phones are sent here from "/" (see app/layout.tsx).
 */
export default function MobileHome() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main className="mx-auto max-w-[480px] overflow-x-clip">
      <Intro onDone={() => setIntroDone(true)} />
      <MobileHeader show={introDone} />
      <Thread ready={introDone}>
        <HeroMobile show={introDone} />
        <WorkCarousel />
        <TimelineMobile
          id="experience"
          index="02"
          label="Experience"
          title={
            <>
              My <em className="italic text-muted">Experience</em>
            </>
          }
          items={experience}
        />
        <TimelineMobile
          id="education"
          index="03"
          label="Education"
          title={
            <>
              My <em className="italic text-muted">Education</em>
            </>
          }
          items={education}
        />
        <AboutMobile />
        <ContactMobile />
      </Thread>
      <TabBar show={introDone} />
    </main>
  );
}
