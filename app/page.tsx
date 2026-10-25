"use client";

import { useState } from "react";

import AboutFrame from "@/components/AboutFrame";
import ArtistWall from "@/components/ArtistWall";
import CrowdFrame from "@/components/CrowdFrame";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import TimelineFrame, { educationRoute, experienceRoute } from "@/components/TimelineFrame";
import WorkSection from "@/components/WorkSection";
import { education, experience, profile } from "@/lib/content";

/**
 * One line runs through the whole page as a series of scenes: each holds on
 * screen while its part of the line plays out, leaving where the next scene's
 * part comes in.
 */
export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main>
      <SmoothScroll />
      <Intro onDone={() => setIntroDone(true)} />
      <Nav show={introDone} />
      <Hero show={introDone} />
      <WorkSection show={introDone} />
      <TimelineFrame
        id="experience"
        index="02"
        label="Experience"
        title={
          <>
            My <em className="italic text-muted">Experience</em>
          </>
        }
        items={experience}
        route={experienceRoute}
      />
      <TimelineFrame
        id="education"
        index="03"
        label="Education"
        title={
          <>
            My <em className="italic text-muted">Education</em>
          </>
        }
        items={education}
        route={educationRoute}
      />
      <AboutFrame />
      <ArtistWall />
      <CrowdFrame />
      <footer className="flex justify-between border-t border-ink/10 px-5 py-5 text-[10px] uppercase tracking-[0.25em] text-subtle">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.location}</span>
      </footer>
    </main>
  );
}
