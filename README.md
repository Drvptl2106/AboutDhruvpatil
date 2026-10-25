# Dhruv — Portfolio

Multilingual greeting intro → black reveal slides up → **My Work**, **Experience** and
**Education**, tied together by a line that draws itself as you scroll → contact card.

Built with Next.js 14, Tailwind CSS and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit your content

Everything lives in `lib/content.ts`: name, email, socials, projects, experience and education.
Put project images in `public/images/work/` and point each `src` at them.

## Structure

- `components/Intro.tsx` — the greeting cycle + black reveal (ported from the original `index.html`)
- `components/WorkSection.tsx` — "My Work" heading with masked slide-up text
- `components/HoverExpand.tsx` — hover-to-expand gallery (vertical accordion on phones)
- `components/ScrollLine.tsx` — the stroke that draws itself with scroll, looping beside each section heading
- `components/Timeline.tsx` — Experience and Education sections
- `components/ContactSection.tsx` — closing card the line runs into
- `components/ThemeToggle.tsx` — light/dark switch with a circular reveal

## Credits

Built with components from [Skiper UI](https://gxuri.me) (@gurvinder-singh02):
Skiper 52 `HoverExpand_001` (gallery), Skiper 19 (scroll stroke, contact card),
Skiper 26 (theme toggle, originally by rudrodip).

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds a static export
and publishes it. One-time setup: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.
