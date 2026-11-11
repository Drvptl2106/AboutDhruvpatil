"use client";

import { useNowPlaying } from "@/lib/useNowPlaying";
import { cn } from "@/lib/utils";

const LABEL = { live: "Now playing", recent: "Last played", pick: "On repeat" } as const;

/** Three bars that bounce while something is playing. */
export function Equalizer({ playing, className }: { playing: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("flex h-3.5 items-end gap-[2px]", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full bg-line", playing ? "eq-bar" : "h-1")}
          style={playing ? { animationDelay: `${i * -0.35}s` } : undefined}
        />
      ))}
    </span>
  );
}

/** What you're listening to: live from Last.fm, or your pick. */
export default function NowPlaying({ className }: { className?: string }) {
  const track = useNowPlaying();
  const Tag = track.href ? "a" : "div";
  return (
    <Tag
      {...(track.href ? { href: track.href, target: "_blank", rel: "noreferrer" } : {})}
      className={cn("group flex min-w-0 items-center gap-3", className)}
    >
      <Equalizer playing={track.kind !== "recent"} />
      <span className="min-w-0">
        <span className="block text-[9px] uppercase tracking-[0.25em] text-subtle">{LABEL[track.kind]}</span>
        <span className="block truncate text-xs text-ink">
          {track.title} <span className="text-muted">— {track.artist}</span>
          {track.href && <span className="ml-1 text-subtle transition-colors group-hover:text-line">↗</span>}
        </span>
      </span>
    </Tag>
  );
}
