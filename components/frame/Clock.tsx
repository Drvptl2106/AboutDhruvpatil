"use client";

import { useEffect, useState } from "react";

import { profile } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Your local time, ticking, and where you are. */
export function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const timer = setInterval(tick, 15_000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

/** The status line with its pulsing dot. */
export function Status({ className }: { className?: string }) {
  if (!profile.status) return null;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-line opacity-60" />
        <span className="relative size-2 rounded-full bg-line" />
      </span>
      {profile.status}
    </span>
  );
}

export default function Clock({ className }: { className?: string }) {
  const time = useLocalTime();
  return (
    <span className={cn("tabular-nums", className)}>
      {time || "--:--"} <span className="text-subtle">in {profile.city}</span>
    </span>
  );
}
