"use client";

import AboutFrame from "@/components/AboutFrame";
import ArtistWall from "@/components/ArtistWall";
import CrowdFrame from "@/components/CrowdFrame";
import Corners from "@/components/frame/Corners";
import Hero from "@/components/Hero";
import JourneyFrame from "@/components/JourneyFrame";
import SmoothScroll from "@/components/SmoothScroll";
import WorkSection from "@/components/WorkSection";
import { profile } from "@/lib/content";

/**
 * The wide-screen layout. One line runs through the whole page as a series of
 * scenes: each holds on screen while its part of the line plays out, leaving
 * where the next scene's part comes in.
 */
export default function DesktopView({ show }: { show: boolean }) {
  return (
    <>
      <SmoothScroll />
      <Corners show={show} />
      <Hero show={show} />
      <WorkSection show={show} />
      <JourneyFrame />
      <AboutFrame />
      <ArtistWall />
      <CrowdFrame />
      <footer className="py-8 text-center text-[10px] uppercase tracking-[0.25em] text-subtle">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
