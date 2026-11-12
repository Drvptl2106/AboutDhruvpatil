"use client";

import CrowdCanvas from "@/components/CrowdCanvas";
import { Status } from "@/components/frame/Clock";
import LineFrame, { type Rel } from "@/components/LineFrame";
import { asset } from "@/lib/asset";
import { profile } from "@/lib/content";
import { clamp, clearance, cornerRadius, fractionAt, LineBuilder, OFF } from "@/lib/linePath";

/**
 * Down from the top centre, a turn left above the label, down beside the
 * headline, then right beneath its last line — underlining "I can be" — into
 * a pen scribble round "your" to finish.
 */
function crowdRoute(rel: Rel, w: number, h: number) {
  const label = rel("[data-line-label]");
  const head = rel("[data-line-anchor]");
  const f = rel("[data-line-final]");
  const r = cornerRadius(w, h);
  const gap = clearance(w, h);
  const x = w / 2;
  const above = Math.max(label.top - gap, 76);
  const side = Math.max(head.left - gap * 1.3, 28);
  const rx = f.width / 2 + clamp(w * 0.02, 16, 30);
  const ry = f.height / 2 + 10;
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
    .scribble(c, rx, ry)
    .build();
  // The drop, first corner and first run draw while the scene scrolls in, so
  // the line is already moving when it takes over from the scene above.
  return { d: line.d, entry: fractionAt(line.flat, { x: side, y: above }) };
}

/** The contact links, under the crowd. */
function Contact() {
  return (
    <div className="flex flex-col items-center">
      <Status className="mb-2.5 text-[11px] uppercase tracking-[0.25em] text-muted" />
      <a
        href={`mailto:${profile.email}`}
        className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-transform hover:scale-[1.04]"
      >
        Hit me up
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted">
        <li className="normal-case tracking-normal">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-ink">
            {profile.email}
          </a>
        </li>
        {profile.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              {s.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The finale: the line ends by scribbling round "your"; the crowd walks
 * beneath, and the way to get in touch sits under the crowd — you, out of it.
 */
export default function CrowdFrame() {
  return (
    <LineFrame id="contact" length={160} build={crowdRoute}>
      <div className="relative z-10 flex flex-col items-center px-5 pt-[13svh] text-center">
        <p data-line-label className="text-[11px] uppercase tracking-[0.3em] text-subtle">
          (04) — Contact
        </p>
        <h2 data-line-anchor className="mt-6 w-fit font-serif text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.05] tracking-[-0.03em]">
          In this crowd of people,
          <br />I can be{" "}
          <em data-line-final className="italic text-muted">
            your
          </em>{" "}
          guy.
        </h2>
      </div>
      <div className="crowd-band absolute inset-x-0 bottom-[140px] h-[34%]">
        <CrowdCanvas src={asset("/images/peeps/all-peeps.png")} rows={15} cols={7} />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-[140px] items-end justify-center bg-paper px-5 pb-6">
        <Contact />
      </div>
    </LineFrame>
  );
}
