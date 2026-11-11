import type { Artist } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * One artist: their photo and name; on hover (or focus) the song you'd
 * recommend. With a Spotify link, the whole card opens them there.
 */
export default function ArtistCard({ artist, className, hidden }: { artist: Artist; className?: string; hidden?: boolean }) {
  const body = (
    <>
      <img
        src={artist.src}
        alt={hidden ? "" : artist.name}
        draggable={false}
        className="pointer-events-none size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="absolute inset-x-4 bottom-3 text-white">
        {artist.song && (
          <span className="mb-1 block translate-y-1 text-xs opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            ♪ Start with “{artist.song}”
          </span>
        )}
        <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/85">
          {artist.name}
          {artist.spotify && <span className="opacity-0 transition-opacity group-hover:opacity-100">Spotify ↗</span>}
        </span>
      </span>
    </>
  );
  const base = cn("group relative block overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-line", className);
  return artist.spotify ? (
    <a
      href={artist.spotify}
      target="_blank"
      rel="noreferrer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      aria-label={`${artist.name} on Spotify`}
      className={base}
    >
      {body}
    </a>
  ) : (
    <figure aria-hidden={hidden || undefined} className={base}>
      {body}
    </figure>
  );
}
