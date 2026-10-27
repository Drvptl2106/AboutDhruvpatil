"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type Peep = {
  rect: [number, number, number, number];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
};

/**
 * A crowd of Open Peeps walking across a canvas. From Skiper 39
 * Canvas_Landing_004 (Skiper UI), after zadvorsky's CodePen.
 * Illustrations: Open Peeps by Pablo Stanley (CC0), https://www.openpeeps.com/
 */
export default function CrowdCanvas({ src, rows = 15, cols = 7 }: { src: string; rows?: number; cols?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const random = (min: number, max: number) => min + Math.random() * (max - min);
    const img = new Image();
    const stage = { width: 0, height: 0 };
    const all: Peep[] = [];
    const available: Peep[] = [];
    const crowd: Peep[] = [];
    let onScreen = true;
    let builtFor = -1; // the width the crowd was last built for
    // Sharper than 2x costs a lot of fill on phones for no visible gain.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const reset = (peep: Peep) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = (100 - 250 * gsap.parseEase("power2.in")(Math.random())) * (peep.height / peep.rect[3]);
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : 0;
      peep.scaleX = direction;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      return { startY, endX };
    };

    const walk = (peep: Peep, { startY, endX }: { startY: number; endX: number }) => {
      const tl = gsap.timeline();
      tl.timeScale(random(0.5, 1.5));
      tl.to(peep, { duration: 10, x: endX, ease: "none" }, 0);
      tl.to(peep, { duration: 0.25, repeat: 40, yoyo: true, y: startY - 10 }, 0);
      return tl;
    };

    const add = (): Peep => {
      const peep = available.splice((Math.random() * available.length) | 0, 1)[0];
      peep.walk = walk(peep, reset(peep)).eventCallback("onComplete", () => {
        crowd.splice(crowd.indexOf(peep), 1);
        available.push(peep);
        add();
      });
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const render = () => {
      if (!onScreen) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      for (const p of crowd) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.scaleX, 1);
        ctx.drawImage(img, ...p.rect, 0, 0, p.width, p.height);
        ctx.restore();
      }
      ctx.restore();
    };

    const resize = () => {
      // Only a new width rebuilds the crowd. Phones change the height every
      // time the address bar shows or hides, which used to restart it.
      if (canvas.clientWidth === builtFor) {
        stage.height = canvas.clientHeight;
        canvas.height = stage.height * dpr;
        return;
      }
      builtFor = canvas.clientWidth;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      // Smaller people on smaller screens.
      const scale = Math.min(1, Math.max(0.5, stage.width / 1400));
      for (const p of all) {
        p.width = p.rect[2] * scale;
        p.height = p.rect[3] * scale;
      }
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;
      crowd.forEach((p) => p.walk?.kill());
      crowd.length = 0;
      available.length = 0;
      // As many people as the width holds without piling up (~28 on a phone).
      const count = Math.round(Math.min(all.length, Math.max(18, stage.width / 14)));
      available.push(...gsap.utils.shuffle([...all]).slice(0, count));
      while (available.length) add().walk!.progress(Math.random());
      if (reduced) {
        crowd.forEach((p) => p.walk?.pause());
        render();
      }
    };

    img.onload = () => {
      const w = img.naturalWidth / rows;
      const h = img.naturalHeight / cols;
      for (let i = 0; i < rows * cols; i++) {
        all.push({
          rect: [(i % rows) * w, ((i / rows) | 0) * h, w, h],
          width: w,
          height: h,
          x: 0,
          y: 0,
          anchorY: 0,
          scaleX: 1,
          walk: null,
        });
      }
      resize();
      if (!reduced) gsap.ticker.add(render);
    };
    img.src = src;

    // Skip drawing while the crowd is off screen.
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      crowd.forEach((p) => p.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} aria-hidden className="crowd-canvas absolute inset-0 size-full" />;
}
