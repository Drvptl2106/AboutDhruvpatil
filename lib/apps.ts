/** The sections the frame links to, and which page sections each one covers. */
export const sections = [
  { id: "work", label: "Work", covers: ["work"] },
  { id: "experience", label: "Journey", covers: ["experience", "education"] },
  { id: "about", label: "About", covers: ["about", "artists"] },
  { id: "contact", label: "Contact", covers: ["contact"] },
];

export const allSectionIds = sections.flatMap((s) => s.covers);

/** Which link to mark for the section in view. */
export const linkFor = (current: string | null) => sections.find((s) => current && s.covers.includes(current))?.id ?? null;

/** Scroll smoothly to a section (through Lenis when it's running). */
export async function goTo(section: string) {
  const el = document.getElementById(section);
  if (!el) return;
  const { getLenis } = await import("@/lib/smooth");
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
