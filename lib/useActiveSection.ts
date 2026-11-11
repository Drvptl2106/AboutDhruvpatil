import { useEffect, useState } from "react";

/** The id of whichever of `ids` is crossing the middle of the screen. */
export function useActiveSection(ids: string[]) {
  const [current, setCurrent] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(e.target.id);
          // Leaving into a part with no app (the hero, the gaps): clear it.
          else setCurrent((c) => (c === e.target.id ? null : c));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    key.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key]);

  return current;
}
