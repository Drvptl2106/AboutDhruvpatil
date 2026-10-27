# Dhruv — Portfolio

Multilingual greeting intro → black reveal → **My Work** (a project strip you scroll sideways or
hover) → **Experience** → **Education** → **About Me** (music + a parallax wall of favourite artists)
→ a walking crowd. One hand-drawn line threads through all of it as you scroll: it underlines each
heading, plugs into the project strip, becomes the timeline spine, wanders through blank screens
between sections, and ends by circling "your". Smooth scrolling by Lenis.

Light mode is white + orange, dark mode is black + green.

Built with Next.js 14, Tailwind CSS and Framer Motion.

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

Phones (under 768 px wide) are sent to `/mobile/`, a separate page designed for touch: normal
scrolling, one thread down the left gutter, swipeable projects with a bottom sheet, and a bottom
tab bar. Its parts live in `components/mobile/`. Add `?desktop` to the address to see the desktop
page on a phone. Projects can carry a `blurb` and `href` in `lib/content.ts` for the sheet.

## Structure

The page is a series of **scenes**. Each one holds still on screen while its part of the line
plays out with the scroll, then lets go; each line leaves where the next scene's line comes in.

- `components/LineFrame.tsx` — the scene: pinned stage, scroll → line length, timeline dots
- `lib/linePath.ts` — `LineBuilder`: routes built from sweeps, true circles and straight runs
  that always join in the same direction (no kinks)
- `components/Hero.tsx` — "Follow the line" with Skiper 19's knot
- `components/WorkSection.tsx` — title + project strip (`HoverExpand.tsx`)
- `components/TimelineFrame.tsx` — Experience and Education; the line is the spine
- `components/AboutFrame.tsx` — the music statement, lit word by word
- `components/ArtistWall.tsx` — parallax wall of favourite artists
- `components/CrowdFrame.tsx` / `CrowdCanvas.tsx` — the finale, circling "your"
- `components/Intro.tsx` — greeting cycle + black reveal
- `components/SmoothScroll.tsx` — Lenis smooth scrolling

## Credits

Built with components from [Skiper UI](https://gxuri.me) (@gurvinder-singh02):
Skiper 52 `HoverExpand_001` (gallery), Skiper 19 (scroll stroke), Skiper 26 (theme toggle,
originally by rudrodip), Skiper 30 `Parallax_002` (artist wall), Skiper 39 `Canvas_Landing_004`
(crowd, after zadvorsky's CodePen). Crowd illustrations: [Open Peeps](https://www.openpeeps.com/)
by Pablo Stanley (CC0).

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds a static export
and publishes it. One-time setup: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.
