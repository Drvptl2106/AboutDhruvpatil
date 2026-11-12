"use client";

import { useWeekInMusic } from "@/lib/useWeekInMusic";
import { cn } from "@/lib/utils";

/** "This week": your most-played track and top five artists, live from Last.fm. */
export default function WeekInMusic({ className }: { className?: string }) {
  const week = useWeekInMusic();
  if (!week || (!week.track && !week.artists.length)) return null;

  return (
    <div className={cn("text-center", className)}>
      <p className="text-[10px] uppercase tracking-[0.3em] text-subtle">This week, live</p>
      {week.track && (
        <a href={week.track.href} target="_blank" rel="noreferrer" className="group mt-2 block">
          <span className="font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] italic leading-tight">“{week.track.title}”</span>
          <span className="mt-1 block text-sm text-muted">
            {week.track.artist} · {week.track.plays} {week.track.plays === 1 ? "play" : "plays"}
            <span className="ml-1 opacity-60 transition-opacity group-hover:opacity-100">↗</span>
          </span>
        </a>
      )}
      {week.artists.length > 0 && (
        <ol className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted">
          {week.artists.map((a, i) => (
            <li key={a.name}>
              <a href={a.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                <span className="mr-1.5 tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
                {a.name}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
