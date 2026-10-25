"use client";

import { useState } from "react";

import ContactSection from "@/components/ContactSection";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import ScrollLine from "@/components/ScrollLine";
import Timeline from "@/components/Timeline";
import WorkSection from "@/components/WorkSection";
import { education, experience } from "@/lib/content";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main>
      <Intro onDone={() => setIntroDone(true)} />
      <Nav show={introDone} />
      <ScrollLine ready={introDone}>
        <WorkSection show={introDone} />
        <Timeline
          id="experience"
          index="02"
          label="Experience"
          meta="Where I've been"
          title={
            <>
              My <em className="italic text-muted">Experience</em>
            </>
          }
          items={experience}
        />
        <Timeline
          id="education"
          index="03"
          label="Education"
          meta="What I've learned"
          title={
            <>
              My <em className="italic text-muted">Education</em>
            </>
          }
          items={education}
        />
        <ContactSection />
      </ScrollLine>
    </main>
  );
}
