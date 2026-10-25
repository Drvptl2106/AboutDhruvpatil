import type { WorkItem } from "@/components/HoverExpand";
import { asset } from "@/lib/asset";

// Everything you'll want to edit lives here.

export const profile = {
  name: "Dhruv Patil",
  location: "India — and online",
  email: "hello@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Drvptl2106" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],
};

// Drop images in /public/images/work and point `src` at them.
export const work: WorkItem[] = [
  { src: asset("/images/work/01.svg"), alt: "Project one", code: "# 01", title: "Project One", category: "Brand Identity" },
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
