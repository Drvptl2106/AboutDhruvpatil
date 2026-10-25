"use client";

import { useState } from "react";

import AboutSection from "@/components/AboutSection";
import CrowdSection from "@/components/CrowdSection";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import ScrollLine from "@/components/ScrollLine";
import SmoothScroll from "@/components/SmoothScroll";
import Timeline from "@/components/Timeline";
import WorkSection from "@/components/WorkSection";
import { education, experience } from "@/lib/content";

/** An empty screen the line wanders through between sections. */
const Blank = () => <div aria-hidden data-line-step="zone" className="h-[80svh] md:h-[100svh]" />;

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main>
      <SmoothScroll />
      <Intro onDone={() => setIntroDone(true)} />
      <Nav show={introDone} />
      <ScrollLine ready={introDone}>
        <WorkSection show={introDone} />
        <Blank />
        <Timeline
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
        <Blank />
        <Timeline
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
        <Blank />
        <AboutSection />
        <CrowdSection />
      </ScrollLine>
    </main>
  );
}
