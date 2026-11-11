import { useEffect, useState } from "react";

import { music } from "@/lib/content";

export type Track = {
  title: string;
  artist: string;
  href?: string;
  /** "live": playing right now; "recent": the last thing played; "pick": your hand-picked song. */
  kind: "live" | "recent" | "pick";
};

const pick: Track = { ...music.onRepeat, href: music.onRepeat.href || undefined, kind: "pick" };

type LastfmTrack = {
  name: string;
  url: string;
  artist: { "#text": string };
  "@attr"?: { nowplaying?: string };
};

/**
 * What you're listening to, from Last.fm (which Spotify can report to), so a
 * static site can show it without holding any secret. Falls back to the song
 * picked in `lib/content.ts`.
 */
export function useNowPlaying() {
  const [track, setTrack] = useState<Track>(pick);

  useEffect(() => {
    const { user, apiKey } = music.lastfm;
    if (!user || !apiKey) return;
    let stopped = false;
    const url =
      "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&limit=1" +
      `&user=${encodeURIComponent(user)}&api_key=${encodeURIComponent(apiKey)}`;

    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const t: LastfmTrack | undefined = data?.recenttracks?.track?.[0];
        if (!t || stopped) return;
        setTrack({
          title: t.name,
          artist: t.artist["#text"],
          href: t.url,
          kind: t["@attr"]?.nowplaying === "true" ? "live" : "recent",
        });
      } catch {
        // Offline or blocked: keep what's showing.
      }
    };

    load();
    const timer = setInterval(load, 60_000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, []);

  return track;
}
