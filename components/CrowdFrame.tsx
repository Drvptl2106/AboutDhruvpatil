"use client";

import CrowdCanvas from "@/components/CrowdCanvas";
import LineFrame, { type Rel } from "@/components/LineFrame";
import { asset } from "@/lib/asset";
import { profile } from "@/lib/content";
import { clamp, cornerRadius, fractionAt, LineBuilder, OFF } from "@/lib/linePath";

/**
 * Down from the top centre, a turn left above the label, down beside the
 * headline, then right along its last line — underlining "I can be" — into a
 * pen-circle around "your" to finish.
 */
function crowdRoute(rel: Rel, w: number, h: number) {
  const label = rel("[data-line-label]");
  const head = rel("[data-line-anchor]");
  const f = rel("[data-line-final]");
  const r = cornerRadius(w, h);
  const x = w / 2;
  const above = Math.max(label.top - 44, 76);
  const side = Math.max(head.left - 64, 28);
  const rx = f.width / 2 + clamp(w * 0.018, 14, 26);
  const ry = f.height / 2 + 8;
  const c = { x: f.left + f.width / 2, y: f.top + f.height * 0.55 };
  const line = new LineBuilder({ x, y: -OFF }, { x: 0, y: 1 })
    .round(
      [
        { x, y: above },
        { x: side, y: above },
        { x: side, y: c.y + ry },
        { x: c.x, y: c.y + ry },
      ],
      r,
    )
    .ellipse("bottom", rx, ry, 5)
    .build();
  // The drop, first corner and first run draw while the scene scrolls in, so
  // the line is already moving when it takes over from the scene above.
  return { d: line.d, entry: fractionAt(line.flat, { x: side, y: above }) };
}

/** The finale: the line ends by circling "your". */
export default function CrowdFrame() {
  return (
    <LineFrame id="contact" length={160} build={crowdRoute}>
      <div className="relative z-10 flex flex-col items-center px-5 pt-[20svh] text-center">
        <p data-line-label className="text-[11px] uppercase tracking-[0.3em] text-subtle">
          (04) — Contact
        </p>
        <h2 data-line-anchor className="mt-8 w-fit font-serif text-[clamp(2.4rem,6.5vw,6rem)] leading-[1.05] tracking-[-0.03em]">
          In this crowd of people,
          <br />I can be{" "}
          <em data-line-final className="italic text-muted">
            your
          </em>{" "}
          guy.
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-transform hover:scale-[1.04]"
        >
          Hit me up
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted">
          <li className="normal-case tracking-normal">
            <a href={`mailto:${profile.email}`} className="hover:text-line">
              {profile.email}
            </a>
          </li>
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-line">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[38%]">
        <CrowdCanvas src={asset("/images/peeps/all-peeps.png")} rows={15} cols={7} />
      </div>
    </LineFrame>
  );
}
