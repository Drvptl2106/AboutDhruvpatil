"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { about } from "@/lib/content";

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
export default function ArtistWall() {
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
    <section aria-label="Artists on repeat" className="relative z-10 w-full bg-paper">
      <p className="px-5 pb-8 pt-16 text-center text-[11px] uppercase tracking-[0.3em] text-subtle">
        On repeat — the artists in my headphones
      </p>
      <div
        ref={gallery}
      className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-paper p-[2vw]"
    >
      <Column images={a.slice(0, 3)} y={y} />
      <Column images={a.slice(3, 6)} y={y2} />
      <Column images={a.slice(6, 9)} y={y3} />
      <Column images={a.slice(9, 12)} y={y4} />
      </div>
    </section>
  );
}
