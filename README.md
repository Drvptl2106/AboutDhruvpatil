# Dhruv — Portfolio

Multilingual greeting intro → black reveal → **My Work** (pinned gallery you scroll through) →
**Experience** → **Education** → **About Me** (music + a parallax wall of favourite artists),
all tied together by a line that draws itself as you scroll → a walking-crowd contact card.
Smooth scrolling by Lenis.

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

## Structure

- `components/Intro.tsx` — the greeting cycle + black reveal (ported from the original `index.html`)
- `components/WorkSection.tsx` — "My Work" heading with masked slide-up text
- `components/HoverExpand.tsx` — hover-to-expand gallery (vertical accordion on phones)
- `components/ScrollLine.tsx` — the stroke that draws itself with scroll, looping beside each section heading
- `components/Timeline.tsx` — Experience and Education sections
- `components/AboutSection.tsx` — word-by-word statement + parallax artist wall
- `components/CrowdSection.tsx` / `CrowdCanvas.tsx` — closing card with a walking crowd
- `components/SmoothScroll.tsx` — Lenis smooth scrolling
- `components/ThemeToggle.tsx` — light/dark switch with a circular reveal

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
