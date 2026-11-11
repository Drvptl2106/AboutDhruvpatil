import { useEffect, useState } from "react";

/** Below this width the phone layout is shown (matches Tailwind's `md`). */
const QUERY = "(max-width: 767px)";

/**
 * Whether the phone layout applies. `null` until the browser has been asked,
 * so nothing is drawn for the wrong layout first; follows resizes after that.
 */
export function useIsMobile() {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}
