import type { WorkItem } from "@/components/HoverExpand";
import { asset } from "@/lib/asset";

// Everything you'll want to edit lives here.

export const profile = {
  name: "Dhruv Patil",
  // Top-left corner, under your name. Clicking it opens the Goa cards
  // (components/Heritage.tsx).
  tagline: "Dev borem karun",
  location: "Newcastle, UK",
  // Bottom-right corner: your city and its live local time.
  city: "Newcastle, UK",
  timeZone: "Europe/London",
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
// Each project is told problem first: `problem` is what you noticed was
// broken, `solution` what you did about it. `track` (optional): the song you
// had on repeat while building it.
export const work: WorkItem[] = [
  {
    src: asset("/images/work/01.svg"),
    alt: "BreakPoint, a live break tracker",
    code: "# 01",
    title: "BreakPoint",
    category: "Product · EE",
    problem:
      "Colleagues were losing track of break time, and team leaders only saw break data days later — too late for fair, timely feedback.",
    solution:
      "Defined the requirements and business rules for a live break tracker with agent and team-leader views, and built it with AI coding tools. Built for me first; now rolling out to our 15-person team.",
  },
  {
    src: asset("/images/work/02.svg"),
    alt: "MSc dissertation on virtual influencers in India",
    code: "# 02",
    title: "Virtual Influencers",
    category: "MSc dissertation",
    problem: "How do audiences in India respond to the emotions virtual influencers show?",
    solution:
      "A mixed-methods study comparing computational emotion modelling with user-perception surveys. Emotional intensity mattered more than the specific emotion.",
  },
  {
    src: asset("/images/work/03.svg"),
    alt: "Digital transformation strategy for Blueline Taxis",
    code: "# 03",
    title: "Blueline Taxis",
    category: "Digital strategy · MSc",
    problem: "A taxi firm needed a digital transformation plan, shaped through discussions with its Finance Director.",
    solution:
      "Proposed a driver app with smart shift scheduling, real-time routing and loyalty rewards, mapped to business outcomes with a Benefits Dependency Network and Strategic Value Matrix, plus a go-to-market plan and KPIs.",
  },
  {
    src: asset("/images/work/04.svg"),
    alt: "EV market strategy for Renault, Nissan and Jeep in India",
    code: "# 04",
    title: "EVs in India",
    category: "Market strategy · MSc",
    problem: "Where is the EV demand in India for Renault, Nissan and Jeep, and what would it take to meet it?",
    solution:
      "Assessed demand, localisation and investment with sales data, sentiment analysis and financial modelling; defined CAPEX, ROI and demand metrics and presented the recommendations.",
  },
  {
    src: asset("/images/work/05.svg"),
    alt: "Last-mile delivery optimisation",
    code: "# 05",
    title: "Last-Mile Delivery",
    category: "Optimisation · MSc",
    problem: "15-minute delivery from dark stores in semi-urban India, within real limits on traffic, riders and location.",
    solution:
      "Modelled the delivery zones as a linear programming problem in Python, with constraints for traffic, rider capacity and location.",
  },
];

export type TimelineItem = {
  period: string;
  title: string;
  place: string;
  detail?: string;
};

export const experience: TimelineItem[] = [
  {
    period: "Jun 2026 — Now",
    title: "Sales Guide",
    place: "EE (BT Group), Newcastle upon Tyne",
    detail: "Built BreakPoint, a live break tracker now rolling out to our team.",
  },
  {
    period: "Dec 2024 — Jun 2026",
    title: "Foods A&A Assistant (Part-time)",
    place: "Marks & Spencer, Newcastle upon Tyne",
  },
  {
    period: "Feb 2025 — Jan 2026",
    title: "Business Analyst (Volunteer)",
    place: "GDP Foundation (NGO), Remote",
    detail: "Unpaid, project-based work alongside my MSc. Started as Data Analyst Intern (Sep 2024 – Feb 2025).",
  },
  {
    period: "Aug 2024 — Jan 2026",
    title: "Freelance Business Analyst",
    place: "Visionize Consultancy, Remote",
    detail: "Project-based freelance work with small businesses, alongside my MSc.",
  },
];

export const education: TimelineItem[] = [
  {
    period: "Sep 2024 — Sep 2025",
    title: "MSc Business Analytics (Distinction)",
    place: "Newcastle University",
    detail:
      "Vice Chancellor's International Scholarship. Stakeholder Management, Project Management, Data-Driven Decision Making, Operational Analytics, Business Modelling, Business Visualisation.",
  },
  {
    period: "Sep 2021 — May 2024",
    title: "BSc Data Science · CGPA 8.5",
    place: "Goa University",
    detail:
      "Business Analytics, Strategic Management, Database Management Systems (SQL), Probability and Statistics, Econometrics.",
  },
];

// Music — the bottom-left "now playing" corner and the Spotify links.
export const music = {
  // Your Spotify profile, linked above the artist wall.
  spotifyProfile: "https://open.spotify.com/user/31k2kqlynlnuql57zvu4pamlt3ty",
  // A playlist to embed above the artist wall: the id from open.spotify.com/playlist/<id>.
  playlistId: "",
  // Live "now playing": connect Spotify to a free Last.fm account (Last.fm → Settings →
  // Applications → Spotify), then create an API key at last.fm/api/account/create.
  // Both values are safe to publish. Leave empty to show `onRepeat` instead.
  lastfm: { user: "drvptl", apiKey: "39383ccd1cb04a73a3aea82913bbf784" },
  // Shown when Last.fm isn't set up (or can't be reached).
  onRepeat: { title: "Song title", artist: "Artist", href: "" },
};

export type Artist = {
  name: string;
  /** Photo. Spotify's own artist image works (served for embedding). */
  src: string;
  /** The artist's Spotify page (open.spotify.com/artist/…). Makes the card a link. */
  spotify?: string;
  /** The one song of theirs you'd recommend, shown on hover. */
  song?: string;
  /** Sits in the wall's middle column, the one you see first. */
  featured?: boolean;
  /** A logo rather than a photo: shown smaller, whole, on black. */
  logo?: boolean;
};

const spotifyArtist = (name: string, id: string, image: string, extra?: Partial<Artist>): Artist => ({
  name,
  spotify: `https://open.spotify.com/artist/${id}`,
  src: image,
  ...extra,
});

// About — a draft in your voice; rewrite freely. Each word lights up as you scroll.
export const about = {
  statement:
    "If you want to know me, listen to what I'm listening to. Music is what defines me — it's on before I start anything and it's still playing when I'm done. It shapes how I think, how I work, and the rhythm I try to put into everything I build.",
  // The artist wall. Photos are each artist's image on Spotify; add a `song`
  // to any of them to show "start with…" on hover. `featured` ones fill the
  // middle column.
  artists: [
    spotifyArtist("The Beatles", "3WrFJ7ztbogyGnTHbHJFl2", "https://i.scdn.co/image/ab6761610000e5eb357fdaf56c64a36a36741538", { featured: true }),
    spotifyArtist("Cigarettes After Sex", "1QAJqy2dA3ihHBFIHRphZj", "https://i.scdn.co/image/ab6761610000e5eb2e08fd554de35c3ef1db7fd9", { featured: true }),
    spotifyArtist("Kishore Kumar", "0GF4shudTAFv8ak9eWdd4Y", "https://i.scdn.co/image/ab6761610000e5ebc9ac92d87de28795c1c49730", { featured: true }),
    spotifyArtist("Frank Sinatra", "1Mxqyy3pSjf8kZZL4QVxS0", "https://i.scdn.co/image/fc4e0f474fb4c4cb83617aa884dc9fd9822d4411"),
    spotifyArtist("Daft Punk", "4tZwfgrHOc3mvqYlEYSvVi", "https://i.scdn.co/image/ab6761610000e5ebd3aa7cc0e419b6c459b08e8e"),
    spotifyArtist("Dire Straits", "0WwSkZ7LtFUFjGjMZBMt6T", "https://i.scdn.co/image/ab6761610000e5eb4bdaa8c5e65b64f50549c393"),
    spotifyArtist("Lana Del Rey", "00FQb4jTyendYWaN8pK0wa", "https://i.scdn.co/image/ab6761610000e5ebb99cacf8acd5378206767261"),
    spotifyArtist("Guns N' Roses", "3qm84nBOXUEQ2vnTfUTTFC", "https://i.scdn.co/image/ab6761610000e5eb50defaf9fc059a1efc541f4c", { logo: true }),
    spotifyArtist("Lata Mangeshkar", "61JrslREXq98hurYL2hYoc", "https://i.scdn.co/image/ab6761610000e5eba0199b159c0c5a9f62333d32", { featured: true }),
    spotifyArtist("The Smiths", "3yY2gUcIsjMr8hjo51PoJ8", "https://i.scdn.co/image/481b980af463122013e4578c08fb8c5cbfaed1e9"),
    spotifyArtist("Queen", "1dfeR4HaWDbWqFHLkxsg1d", "https://i.scdn.co/image/ab6761610000e5eb73e4d22612ac8d944b5789b4"),
    spotifyArtist("Freddie Mercury", "4M1FpEWs2PeYfJe7xxJfhH", "https://i.scdn.co/image/ab6761610000e5eb54d549a70c17edeea6b0947e"),
    spotifyArtist("Shankar–Ehsaan–Loy", "0L5GV6LN8SWWUWIdBbTLTZ", "https://i.scdn.co/image/ab6761610000e5eb3db0499a689aa9b4a47ebba3"),
    spotifyArtist("Led Zeppelin", "36QJpDe2go2KgaRleHCDTp", "https://i.scdn.co/image/207803ce008388d3427a685254f9de6a8f61dc2e"),
    spotifyArtist("Pink Floyd", "0k17h0D3J5VfsdmQ1iZtE9", "https://i.scdn.co/image/ab6761610000e5ebc424aa2c2ffe2c2a1b1f4837"),
  ],
};
