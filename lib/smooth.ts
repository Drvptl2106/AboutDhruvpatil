import type Lenis from "lenis";

// The page's single Lenis instance, so other components can pause it or
// scroll to an anchor.
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;
