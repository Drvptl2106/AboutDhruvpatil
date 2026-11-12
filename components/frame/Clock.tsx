"use client";

import { useEffect, useState } from "react";

import { profile } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Minutes ahead of UTC in `timeZone` right now (undefined: the visitor's own). */
function offsetMinutes(now: Date, timeZone?: string) {
  const local = new Date(now.toLocaleString("en-US", timeZone ? { timeZone } : undefined));
  const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((local.getTime() - utc.getTime()) / 60000);
}

/** "5h", "4½h", "30 min". */
function span(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m === 30 ? `${h}½h` : m ? `${h}h ${m}m` : `${h}h`;
}

/** What you're probably doing at this hour where you are. Edit freely. */
export function moodFor(hour: number) {
  if (hour < 5) return "probably still building something";
  if (hour < 8) return "early start, coffee first";
  if (hour < 12) return "deep in the morning's problem";
  if (hour < 14) return "lunch, headphones in";
  if (hour < 18) return "solving the afternoon's problem";
  if (hour < 22) return "music on, side projects out";
  return "late, still building";
}

/**
 * Your local time, your hour's mood, and how far you are from the visitor
 * ("5h behind you"), ticking.
 */
export function useHere() {
  const [here, setHere] = useState({ time: "--:--", hour: 12, gap: "" });
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timeZone });
    const tick = () => {
      const now = new Date();
      const time = fmt.format(now);
      const diff = offsetMinutes(now, profile.timeZone) - offsetMinutes(now);
      const gap = diff === 0 ? "same time as you" : `${span(Math.abs(diff))} ${diff > 0 ? "ahead of" : "behind"} you`;
      setHere({ time, hour: Number(time.slice(0, 2)), gap });
    };
    tick();
    const timer = setInterval(tick, 15_000);
    return () => clearInterval(timer);
  }, []);
  return here;
}

/** The status line with its pulsing dot (in the text colour). */
export function Status({ className }: { className?: string }) {
  if (!profile.status) return null;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" />
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
      {profile.status}
    </span>
  );
}

/** "21:04 in Newcastle, UK — music on, side projects out". */
export default function Clock({ className, mood = true }: { className?: string; mood?: boolean }) {
  const { time, hour } = useHere();
  return (
    <span className={cn("tabular-nums", className)}>
      {time} <span className="opacity-60">in {profile.city}</span>
      {mood && <span className="block font-serif text-base italic opacity-70">{moodFor(hour)}</span>}
    </span>
  );
}
