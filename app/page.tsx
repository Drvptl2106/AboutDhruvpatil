"use client";

import { useState } from "react";

import Intro from "@/components/Intro";
import WorkSection from "@/components/WorkSection";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main>
      <Intro onDone={() => setIntroDone(true)} />
      <WorkSection show={introDone} />
    </main>
  );
}
