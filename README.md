# Dhruv — Portfolio

Multilingual greeting intro → black reveal slides up → a **My Work** section with an
expanding image gallery.

Built with Next.js 14, Tailwind CSS and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add your projects

1. Put your images in `public/images/work/`.
2. Edit the `work` array in `components/WorkSection.tsx` (title, category, image path).

## Structure

- `components/Intro.tsx` — the greeting cycle + black reveal (ported from the original `index.html`)
- `components/WorkSection.tsx` — "My Work" heading with masked slide-up text
- `components/HoverExpand.tsx` — hover-to-expand gallery (vertical accordion on phones)

## Credits

Gallery based on Skiper 52 `HoverExpand_001` by [Skiper UI](https://gxuri.me) (@gurvinder-singh02).

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds a static export
and publishes it. One-time setup: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.
