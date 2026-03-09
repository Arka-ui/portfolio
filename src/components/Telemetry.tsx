"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/telemetry";

/** Fire-and-forget page-view beacon on mount. Renders nothing. */
export default function Telemetry() {
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  return null;
}
