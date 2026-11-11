import { cn } from "@/lib/utils";

/**
 * Dock app icons, in the site's own colours (orange, cream, black) plus the
 * real colours of the outside apps they open.
 */
export type AppId = "work" | "journey" | "about" | "contact" | "spotify" | "github" | "linkedin";

const tiles: Record<AppId, string> = {
  work: "bg-gradient-to-b from-[#ff7a3d] to-[#e8470c] text-[#fbf1e1]",
  journey: "bg-gradient-to-b from-[#fdf6ea] to-[#efe2c9] text-[#141414]",
  about: "bg-gradient-to-b from-[#2a2a2a] to-[#0b0b0b] text-[#fbf1e1]",
  contact: "bg-gradient-to-b from-[#ffffff] to-[#e9e9ec] text-[#e8470c]",
  spotify: "bg-gradient-to-b from-[#1ed760] to-[#169c46] text-[#0b0b0b]",
  github: "bg-gradient-to-b from-[#3a3f45] to-[#1b1f23] text-white",
  linkedin: "bg-gradient-to-b from-[#1c7ed6] to-[#0a5cb0] text-white",
};

function Glyph({ id }: { id: AppId }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (id) {
    case "work":
      return (
        <g {...s}>
          <rect x="4" y="5" width="7" height="6" rx="1.5" />
          <rect x="13" y="5" width="7" height="14" rx="1.5" />
          <rect x="4" y="13" width="7" height="6" rx="1.5" />
        </g>
      );
    case "journey":
      return (
        <g {...s}>
          <path d="M5 4v5a3 3 0 0 0 3 3h8a3 3 0 0 1 3 3v5" />
          <circle cx="5" cy="4" r="1.6" fill="#e8470c" stroke="none" />
          <circle cx="19" cy="20" r="1.6" fill="#e8470c" stroke="none" />
        </g>
      );
    case "about":
      return (
        <g {...s}>
          <path d="M9 17V6l10-2v11" />
          <circle cx="7" cy="17" r="2.2" />
          <circle cx="17" cy="15" r="2.2" />
        </g>
      );
    case "contact":
      return (
        <g {...s}>
          <rect x="3.5" y="6" width="17" height="12" rx="2" />
          <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
        </g>
      );
    case "spotify":
      return (
        <g {...s} strokeWidth={2}>
          <path d="M6 9.5c4-1.3 8.5-1 12 1" />
          <path d="M7 13c3.3-1 6.8-.7 9.7.9" />
          <path d="M8 16.2c2.5-.7 5-.5 7.2.7" />
        </g>
      );
    case "github":
      return (
        <g {...s}>
          <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 6l-3 12" />
        </g>
      );
    case "linkedin":
      return (
        <g {...s} strokeWidth={2.2}>
          <path d="M7 10v7M7 7v.01M11 17v-7M11 13.2c0-2 1.3-3.2 2.9-3.2S17 11 17 13.2V17" />
        </g>
      );
  }
}

/** A rounded-square app tile; `size` in px (the glyph scales with it). */
export default function AppIcon({ id, size, className }: { id: AppId; size?: number; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-full items-center justify-center rounded-[23%] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_14px_-6px_rgba(0,0,0,0.5)] ring-1 ring-black/10",
        tiles[id],
        className,
      )}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg viewBox="0 0 24 24" className="size-[58%]" aria-hidden>
        <Glyph id={id} />
      </svg>
    </span>
  );
}
