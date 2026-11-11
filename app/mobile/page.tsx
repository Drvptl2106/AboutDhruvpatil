"use client";

import { useEffect } from "react";

/** The phone layout used to live here; old links are sent to the main page. */
export default function MobileRedirect() {
  useEffect(() => {
    location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${location.hash}`);
  }, []);
  return null;
}
