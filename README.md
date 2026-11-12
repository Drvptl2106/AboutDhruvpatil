# Dhruv — Portfolio

Multilingual greeting intro → black reveal → **My Work** (a project strip you hover) → **My
Journey** (experience and education either side of one spine) → **About Me** (music, your week in
music live from Last.fm, and a wall of favourite artists) → a walking crowd. One hand-drawn line threads through all of it as you
scroll: it underlines each heading, plugs into the project strip, becomes the timeline spine, and
ends by circling "your". Smooth scrolling by Lenis. The intro plays once per browser session.

Light mode is white, dark mode is black; the line is orange in both.

Built with Next.js 14, Tailwind CSS and Framer Motion.

## The frame

The four corners stay put for the whole page, as plain type with no boxes: your name and tagline
(top left), the sections and a "Light / Dark" switch (top right), what you're listening to
(bottom left), and your city, local time and status (bottom right). The type is white with a
difference blend, so it inverts against whatever is behind it; orange is left to the line. The
top two corners tuck away once you scroll, like the macOS menu bar in full screen: touch the top
edge to call them back. The bottom corners step aside at Contact. Phones get the sections as a
text tab bar.

## Little things

- Projects are told problem first: give each one a `problem` (what you noticed was broken) and a
  `solution` (what you built), shown on the open card and in the phone's project sheet.
- The bottom-right corner shows your time, how far it is from the visitor's ("5h behind you"),
  and what you're probably doing at that hour — edit the lines in `moodFor` in
  `components/frame/Clock.tsx`.
- "Dev borem karun", under your name (and above the headline on phones), dims the page with a
  circle from the click, like the theme switch, and floats up a small cluster of cards explaining
  the phrase, with Goa as its backdrop: its meaning, Mario Miranda, "say thanks in" Konkani /
  Portuguese / English, the distance home, Mando, and festivals with photos. Edit them in `copy`
  at the top of `components/Heritage.tsx`. Photos are from Wikimedia Commons under free licences,
  credited on the cards.

## Music and Spotify

All in `music` in `lib/content.ts`:

- `spotifyProfile` — your Spotify profile link, opened by a "Follow my Spotify" button on the
  artist wall.
- `playlistId` — embeds one of your playlists above the artist wall.
- `lastfm` — makes the bottom-left corner live. Spotify can't be read from a static site without
  a server holding a secret, so this goes through Last.fm instead: make a free Last.fm account,
  connect Spotify under Settings → Applications, create an API key at last.fm/api/account/create,
  and fill in your username and key (both are safe to publish).
- `onRepeat` — the song shown when Last.fm isn't set up.

Artists marked `featured` fill the wall's middle column; `logo` shows a logo smaller and whole
on black. Each artist on the wall carries its photo and `spotify` (their Spotify page, which makes the
card a link), and can carry `song` (the one to start with, shown on hover). The photos are the
artists' own images on Spotify. Each project can carry `track`, the song on repeat while you
built it.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit your content

Everything lives in `lib/content.ts`: name, email, socials, projects, experience, education,
the About statement and your artists. Put project images in `public/images/work/` and artist
photos in `public/images/artists/`, and point each `src` at them.

## Mobile

There is one address for every screen. Under 768 px wide the page shows the phone layout, designed
for touch: normal scrolling, one thread down the left gutter, swipeable projects with a bottom
sheet, and a bottom tab bar. Its parts live in `components/mobile/`; `app/page.tsx` picks the
layout and switches if the window is resized. The old `/mobile/` address forwards to the main page.
Projects can carry a `blurb` and `href` in `lib/content.ts` for the sheet.

## Structure

The page is a series of **scenes**. Each one holds still on screen while its part of the line
plays out with the scroll, then lets go; each line leaves where the next scene's line comes in.

- `components/LineFrame.tsx` — the scene: pinned stage, scroll → line length, timeline dots
- `lib/linePath.ts` — `LineBuilder`: routes are straight runs joined by true circular corners of
  one radius (`round`), so the line never wobbles. Every scene takes the line in at the top centre
  and hands it on at the bottom centre, and it never passes through text.
- `components/Hero.tsx` — "Follow the line" with Skiper 19's knot
- `components/WorkSection.tsx` — title + project strip (`HoverExpand.tsx`)
- `components/JourneyFrame.tsx` — Experience and Education in one scene; the line is the spine
- `components/AboutFrame.tsx` — the music statement, lit word by word
- `components/ArtistWall.tsx` — five columns of artists drifting at their own pace as you scroll
  (each column's start and speed are worked out so it moves and never shows a gap); each card
  opens the artist on Spotify
- `components/WeekInMusic.tsx` — this week's most-played track and top artists, from Last.fm
- `components/Heritage.tsx` — the card cluster behind "Dev borem karun"
- `components/CrowdFrame.tsx` / `CrowdCanvas.tsx` — the finale: a pen scribble round "your", the
  crowd, and the contact links beneath it
- `components/Intro.tsx` — greeting cycle ending on Konkani + black reveal (once per session)
- `components/frame/` — the four corners: now playing, clock and status
- `components/DesktopView.tsx` / `components/mobile/MobileView.tsx` — the two layouts
- `components/SmoothScroll.tsx` — Lenis smooth scrolling

## Credits

Built with components from [Skiper UI](https://gxuri.me) (@gurvinder-singh02):
Skiper 52 `HoverExpand_001` (gallery), Skiper 19 (scroll stroke), Skiper 26 (theme toggle,
originally by rudrodip), Skiper 39 `Canvas_Landing_004`
(crowd, after zadvorsky's CodePen). Crowd illustrations: [Open Peeps](https://www.openpeeps.com/)
by Pablo Stanley (CC0).

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds a static export
and publishes it. One-time setup: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.
