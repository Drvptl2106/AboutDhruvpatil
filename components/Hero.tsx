"use client";

import LineFrame, { type Rel } from "@/components/LineFrame";
import Reveal from "@/components/Reveal";
import { clamp, LineBuilder, mapPath } from "@/lib/linePath";

// The tangle from Skiper 19's stroke (Skiper UI, after comgio.ai) — the part
// of its path up to where it drops away from the knot. In its own units.
const KNOT =
  "M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655";
const KNOT_BOX = { x: 495, y: 3, w: 778, h: 562 };
// Where the knot ends, and its last control point (gives the heading there).
const KNOT_END = { x: 953.797, y: 561.655 };
const KNOT_LAST_CTRL = { x: 956.297, y: 483.647 };

/**
 * Knot behind the headline's right side, then a tail that carries on in the
 * knot's own direction and sweeps out through the left edge.
 */
function heroLine(rel: Rel, w: number, h: number) {
  const t = rel("[data-line-anchor]");
  const s = clamp((w * 0.48) / KNOT_BOX.w, 0.36, 0.9);
  const cx = Math.min(t.right - t.width * 0.12, w - (KNOT_BOX.w * s) / 2 + 30);
  const cy = t.top + t.height * 0.42;
  const place = (p: { x: number; y: number }) => ({
    x: cx + (p.x - (KNOT_BOX.x + KNOT_BOX.w / 2)) * s,
    y: cy + (p.y - (KNOT_BOX.y + KNOT_BOX.h / 2)) * s,
  });
  const end = place(KNOT_END);
  const ctrl = place(KNOT_LAST_CTRL);
  const tail = new LineBuilder(end, { x: end.x - ctrl.x, y: end.y - ctrl.y })
    .to({ x: w * 0.4, y: h * 0.86 }, { x: -1, y: 0.05 }, 0.45)
    // Out through the left edge (not the bottom), where My Work picks it up.
    .to({ x: -90, y: h * 0.74 }, { x: -1, y: -0.12 }, 0.42)
    .build();
  // The knot draws first, so the lead-in shows most of it.
  return { d: mapPath(KNOT, place) + tail.d.replace(/^M[^C]*/, " "), entry: 0.42 };
}

export default function Hero({ show }: { show: boolean }) {
  return (
    <LineFrame id="top" length={200} build={heroLine} lead show={show}>
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <h1
          data-line-anchor
          className="font-serif text-[clamp(3.25rem,10vw,9.5rem)] font-normal leading-[0.92] tracking-[-0.03em]"
        >
          <Reveal show={show} delay={0.2}>
            Follow the line
          </Reveal>
          <Reveal show={show} delay={0.3}>
            it knows
          </Reveal>
          <Reveal show={show} delay={0.4} className="-mb-[0.14em] pb-[0.14em]">
            <em className="italic text-muted">where I&apos;ve been</em>
          </Reveal>
        </h1>
        <Reveal show={show} delay={0.7} className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">Scroll to follow it</p>
        </Reveal>
        <span className="mt-4 h-14 w-px bg-gradient-to-b from-subtle to-transparent" />
      </div>
    </LineFrame>
  );
}
