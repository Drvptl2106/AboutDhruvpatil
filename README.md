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

## Structure

- `components/Intro.tsx` — the greeting cycle + black reveal (ported from the original `index.html`)
- `components/WorkSection.tsx` — "My Work" heading with masked slide-up text
- `components/HoverExpand.tsx` — hover-to-expand project strip (scroll sideways, swipe or drag)
- `components/ScrollLine.tsx` — the stroke that draws itself with scroll; its route is built from
  `data-line-*` markers in the sections (see the comment on `route()`)
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
