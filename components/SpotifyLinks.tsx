import { music } from "@/lib/content";

/** "Follow me on Spotify" and, if set, your playlist embedded right here. */
export default function SpotifyLinks({ className }: { className?: string }) {
  if (!music.spotifyProfile && !music.playlistId) return null;
  return (
    <div className={className}>
      {music.spotifyProfile && (
        <a
          href={music.spotifyProfile}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-line hover:text-line"
        >
          <span className="size-2 rounded-full bg-[#1ed760]" /> Follow my Spotify ↗
        </a>
      )}
      {music.playlistId && (
        <iframe
          title="My playlist on Spotify"
          src={`https://open.spotify.com/embed/playlist/${music.playlistId}?theme=0`}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="mt-6 h-[152px] w-full max-w-xl rounded-xl border-0"
        />
      )}
    </div>
  );
}
