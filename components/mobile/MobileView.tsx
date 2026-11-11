"use client";

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
 * The phone layout, designed for touch: normal scrolling throughout, one
 * thread down the left gutter, swipeable projects, a bottom tab bar.
 */
export default function MobileView({ show }: { show: boolean }) {
  return (
    <div className="mx-auto max-w-[480px] overflow-x-clip">
      <MobileHeader show={show} />
      <Thread ready={show}>
        <HeroMobile show={show} />
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
      <TabBar show={show} />
    </div>
  );
}
