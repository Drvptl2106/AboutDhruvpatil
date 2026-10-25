"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import SectionHeader from "@/components/SectionHeader";
import { about } from "@/lib/content";

/** One word of the statement; brightens as scroll passes its slot. */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      data-line-pass
      className="mx-auto mt-16 max-w-4xl text-center font-serif text-[clamp(2rem,4.4vw,4rem)] leading-[1.12] tracking-[-0.01em] md:mt-24"
    >
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Column({ images, y }: { images: typeof about.artists; y: MotionValue<number> }) {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[170px] flex-col gap-[2vw] md:min-w-[250px] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((a) => (
        <figure key={a.src} className="relative h-full w-full overflow-hidden rounded-2xl">
          <img src={a.src} alt={a.name} className="pointer-events-none size-full object-cover" />
          <figcaption className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.25em] text-white/80">
            {a.name}
          </figcaption>
        </figure>
      ))}
    </motion.div>
  );
}

/** Four columns drifting at different speeds. From Skiper 30 Parallax_002 (Skiper UI). */
function ArtistWall() {
  const gallery = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const { scrollYProgress } = useScroll({ target: gallery, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const resize = () => setHeight(window.innerHeight);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const a = about.artists;
  return (
    <div
      ref={gallery}
      data-line-wall
      className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-paper p-[2vw]"
    >
      <Column images={a.slice(0, 3)} y={y} />
      <Column images={a.slice(3, 6)} y={y2} />
      <Column images={a.slice(6, 9)} y={y3} />
      <Column images={a.slice(9, 12)} y={y4} />
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" data-line-step="about" className="relative z-10 w-full">
      <div className="mx-auto w-full max-w-6xl px-5 pb-32 md:pb-48">
        <SectionHeader
          index="04"
          label="About — what defines me"
          title={
            <>
              About <em className="italic text-muted">Me</em>
            </>
          }
        />
        <Statement text={about.statement} />
      </div>

      <p className="px-5 pb-8 text-center text-[11px] uppercase tracking-[0.3em] text-subtle">
        On repeat — the artists in my headphones
      </p>
      <ArtistWall />
    </section>
  );
}
