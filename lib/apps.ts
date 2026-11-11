import type { AppId } from "@/components/frame/AppIcon";
import { music, profile } from "@/lib/content";

export type App = {
  id: AppId;
  label: string;
  /** Section ids this app lights up for. */
  sections?: string[];
  /** A section to scroll to, or an outside link. */
  target: { section: string } | { href: string };
};

const social = (label: string) => profile.socials.find((s) => s.label === label)?.href;
const real = (href?: string) => (href && href !== "#" ? href : undefined);

/** The dock: one app per section, then the outside apps you've filled in. */
export function dockApps(): App[] {
  const github = real(social("GitHub"));
  const linkedin = real(social("LinkedIn"));
  const apps: (App | false)[] = [
    { id: "work", label: "Projects", sections: ["work"], target: { section: "work" } },
    { id: "journey", label: "Experience & Education", sections: ["experience", "education"], target: { section: "experience" } },
    { id: "about", label: "About me", sections: ["about", "artists"], target: { section: "about" } },
    { id: "contact", label: "Contact", sections: ["contact"], target: { section: "contact" } },
    // Until your Spotify profile is set, this opens the artist wall instead.
    {
      id: "spotify",
      label: music.spotifyProfile ? "My Spotify" : "What I listen to",
      target: music.spotifyProfile ? { href: music.spotifyProfile } : { section: "artists" },
    },
    !!github && { id: "github", label: "GitHub", target: { href: github } },
    !!linkedin && { id: "linkedin", label: "LinkedIn", target: { href: linkedin } },
  ];
  return apps.filter((a): a is App => !!a);
}

/** Scroll smoothly to a section (through Lenis when it's running). */
export async function goTo(section: string) {
  const el = document.getElementById(section);
  if (!el) return;
  const { getLenis } = await import("@/lib/smooth");
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
