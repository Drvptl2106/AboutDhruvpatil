import type { WorkItem } from "@/components/HoverExpand";
import { asset } from "@/lib/asset";

// Everything you'll want to edit lives here.

export const profile = {
  name: "Dhruv Patil",
  // Top-left corner, under your name.
  tagline: "I find problems — then the solutions to them.",
  location: "India — and online",
  // Bottom-right corner: your city and its live local time.
  city: "India",
  timeZone: "Asia/Kolkata",
  // Shown next to the clock with a pulsing dot. Set to "" to hide.
  status: "Open to work",
  email: "hello@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Drvptl2106" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],
};

// Drop images in /public/images/work and point `src` at them.
// `track` (optional): the song you had on repeat while building it.
export const work: WorkItem[] = [
  { src: asset("/images/work/01.svg"), alt: "Project one", code: "# 01", title: "Project One", category: "Brand Identity", track: "Song — Artist" },
  { src: asset("/images/work/02.svg"), alt: "Project two", code: "# 02", title: "Project Two", category: "Web Design" },
  { src: asset("/images/work/03.svg"), alt: "Project three", code: "# 03", title: "Project Three", category: "Development" },
  { src: asset("/images/work/04.svg"), alt: "Project four", code: "# 04", title: "Project Four", category: "UI / UX" },
  { src: asset("/images/work/05.svg"), alt: "Project five", code: "# 05", title: "Project Five", category: "Motion" },
  { src: asset("/images/work/06.svg"), alt: "Project six", code: "# 06", title: "Project Six", category: "E-commerce" },
  { src: asset("/images/work/07.svg"), alt: "Project seven", code: "# 07", title: "Project Seven", category: "Branding" },
  { src: asset("/images/work/08.svg"), alt: "Project eight", code: "# 08", title: "Project Eight", category: "Product" },
  { src: asset("/images/work/09.svg"), alt: "Project nine", code: "# 09", title: "Project Nine", category: "Editorial" },
];

export type TimelineItem = {
  period: string;
  title: string;
  place: string;
  detail: string;
};

export const experience: TimelineItem[] = [
  {
    period: "2025 — Now",
    title: "Role Title",
    place: "Company Name",
    detail: "One or two lines on what you built, owned or shipped here, and the impact it had.",
  },
  {
    period: "2024 — 2025",
    title: "Role Title",
    place: "Company Name",
    detail: "One or two lines on what you built, owned or shipped here, and the impact it had.",
  },
  {
    period: "2023 — 2024",
    title: "Internship Title",
    place: "Company Name",
    detail: "One or two lines on what you built, owned or shipped here, and the impact it had.",
  },
];

export const education: TimelineItem[] = [
  {
    period: "2021 — 2025",
    title: "Degree, Major",
    place: "University Name",
    detail: "Focus areas, notable projects, or achievements.",
  },
  {
    period: "2019 — 2021",
    title: "Higher Secondary",
    place: "School Name",
    detail: "Stream, results, or anything worth a mention.",
  },
];

// Music — the bottom-left "now playing" corner and the Spotify links.
export const music = {
  // Your Spotify profile (open.spotify.com/user/…), linked from the dock and the artist wall.
  spotifyProfile: "",
  // A playlist to embed above the artist wall: the id from open.spotify.com/playlist/<id>.
  playlistId: "",
  // Live "now playing": connect Spotify to a free Last.fm account (Last.fm → Settings →
  // Applications → Spotify), then create an API key at last.fm/api/account/create.
  // Both values are safe to publish. Leave empty to show `onRepeat` instead.
  lastfm: { user: "", apiKey: "" },
  // Shown when Last.fm isn't set up (or can't be reached).
  onRepeat: { title: "Song title", artist: "Artist", href: "" },
};

export type Artist = {
  name: string;
  src: string;
  /** The artist's Spotify page (open.spotify.com/artist/…). Makes the card a link. */
  spotify?: string;
  /** The one song of theirs you'd recommend, shown on hover. */
  song?: string;
};

// About — a draft in your voice; rewrite freely. Each word lights up as you scroll.
export const about = {
  statement:
    "If you want to know me, listen to what I'm listening to. Music is what defines me — it's on before I start anything and it's still playing when I'm done. It shapes how I think, how I work, and the rhythm I try to put into everything I build.",
  // Your favourite artists for the parallax wall — replace with real photos.
  artists: Array.from({ length: 12 }, (_, i): Artist => {
    const n = String(i + 1).padStart(2, "0");
    return { name: `Artist ${n}`, src: asset(`/images/artists/${n}.svg`), song: "Their best song" };
  }),
};
