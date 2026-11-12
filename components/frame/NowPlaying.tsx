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
          className={cn("w-[2px] rounded-full bg-current", playing ? "eq-bar" : "h-1")}
          style={playing ? { animationDelay: `${i * -0.35}s` } : undefined}
        />
      ))}
    </span>
  );
}

/** What you're listening to: live from Last.fm, or your pick. */
export default function NowPlaying({ className, bars = "text-line" }: { className?: string; bars?: string }) {
  const track = useNowPlaying();
  const Tag = track.href ? "a" : "div";
  return (
    <Tag
      {...(track.href ? { href: track.href, target: "_blank", rel: "noreferrer" } : {})}
      className={cn("group flex min-w-0 items-center gap-3", className)}
    >
      <Equalizer playing={track.kind !== "recent"} className={bars} />
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-[0.25em] opacity-60">{LABEL[track.kind]}</span>
        <span className="mt-0.5 block truncate text-xs">
          {track.title} <span className="opacity-60">— {track.artist}</span>
          {track.href && <span className="ml-1 opacity-60 transition-opacity group-hover:opacity-100">↗</span>}
        </span>
      </span>
    </Tag>
  );
}
