import { useEffect, useState } from "react";

import { music } from "@/lib/content";

export type Week = {
  artists: { name: string; plays: number; href: string }[];
  track: { title: string; artist: string; plays: number; href: string } | null;
};

/** Your top artists and most-played track over the last seven days, from Last.fm. */
export function useWeekInMusic() {
  const [week, setWeek] = useState<Week | null>(null);

  useEffect(() => {
    const { user, apiKey } = music.lastfm;
    if (!user || !apiKey) return;
    const base =
      "https://ws.audioscrobbler.com/2.0/?format=json&period=7day" +
      `&user=${encodeURIComponent(user)}&api_key=${encodeURIComponent(apiKey)}`;
    let stopped = false;

    (async () => {
      try {
        const [a, t] = await Promise.all([
          fetch(`${base}&method=user.gettopartists&limit=5`).then((r) => r.json()),
          fetch(`${base}&method=user.gettoptracks&limit=1`).then((r) => r.json()),
        ]);
        if (stopped) return;
        type A = { name: string; playcount: string; url: string };
        type T = { name: string; playcount: string; url: string; artist: { name: string } };
        const top: T | undefined = t?.toptracks?.track?.[0];
        setWeek({
          artists: ((a?.topartists?.artist ?? []) as A[]).map((x) => ({
            name: x.name,
            plays: Number(x.playcount),
            href: x.url,
          })),
          track: top ? { title: top.name, artist: top.artist.name, plays: Number(top.playcount), href: top.url } : null,
        });
      } catch {
        // Offline or blocked: the section simply doesn't show.
      }
    })();

    return () => {
      stopped = true;
    };
  }, []);

  return week;
}
