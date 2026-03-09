/**
 * Lightweight client telemetry — collects anonymous device / browser
 * metrics and forwards them to the configured API endpoint.
 */

const API = process.env.NEXT_PUBLIC_API_URL;

/* ─── Collect client-side device data ─────────────────────── */

function clientData(): Record<string, unknown> {
  const nav = navigator as unknown as Record<string, unknown>;
  const conn = (nav.connection ?? nav.mozConnection ?? nav.webkitConnection) as
    | { effectiveType?: string; downlink?: number; rtt?: number }
    | undefined;

  const uaData = (nav.userAgentData) as
    | { platform?: string; mobile?: boolean; brands?: { brand: string; version: string }[] }
    | undefined;

  const data: Record<string, unknown> = {
    screen: `${screen.width}×${screen.height}`,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    dpr: window.devicePixelRatio ?? 1,
    language: navigator.language,
    languages: navigator.languages?.join(", "),
    platform: uaData?.platform || navigator.platform || "Unknown",
    mobile: uaData?.mobile ?? (navigator.maxTouchPoints > 0),
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === "1" ? "Enabled" : navigator.doNotTrack === "0" ? "Disabled" : "Unset",
    touchPoints: navigator.maxTouchPoints,
    online: navigator.onLine,
    colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "Dark"
      : "Light",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webdriver: !!(nav.webdriver),
  };

  if (navigator.hardwareConcurrency)
    data.cores = navigator.hardwareConcurrency;
  if ((nav as { deviceMemory?: number }).deviceMemory)
    data.memory = (nav as { deviceMemory: number }).deviceMemory;
  if (conn?.effectiveType) data.connection = conn.effectiveType;
  if (conn?.downlink) data.downlink = `${conn.downlink} Mbps`;
  if (conn?.rtt) data.rtt = `${conn.rtt} ms`;

  // Performance timing
  try {
    const perf = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (perf) {
      data.loadTime = `${Math.round(perf.loadEventEnd - perf.startTime)} ms`;
      data.domReady = `${Math.round(perf.domContentLoadedEventEnd - perf.startTime)} ms`;
      data.ttfb = `${Math.round(perf.responseStart - perf.requestStart)} ms`;
    }
  } catch { /* unavailable */ }

  // GPU via WebGL (best-effort)
  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl") ?? c.getContext("experimental-webgl");
    if (gl) {
      const dbg = (gl as WebGLRenderingContext).getExtension(
        "WEBGL_debug_renderer_info"
      );
      if (dbg)
        data.gpu = (gl as WebGLRenderingContext).getParameter(
          dbg.UNMASKED_RENDERER_WEBGL
        );
    }
  } catch { /* not available */ }

  // Document referrer
  if (document.referrer) data.docReferrer = document.referrer;

  return data;
}

/** Attach async battery info (Chrome/Edge only). */
async function withBattery(data: Record<string, unknown>) {
  try {
    const bm = await (navigator as unknown as { getBattery?: () => Promise<{ level: number; charging: boolean }> })
      .getBattery?.();
    if (bm)
      data.battery = `${Math.round(bm.level * 100)}%${bm.charging ? " ⚡" : ""}`;
  } catch { /* unavailable */ }
  return data;
}

/* ─── Page view event ─────────────────────────────────────── */

export async function trackPageView(page: string) {
  if (!API) return;
  try {
    const data = await withBattery(clientData());

    await fetch(`${API}/v1/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, ...data }),
    });
  } catch { /* fire-and-forget */ }
}

/* ─── Contact form message ────────────────────────────────── */

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!API) throw new Error("Contact form is not configured.");

  const meta = await withBattery(clientData());

  const res = await fetch(`${API}/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, _meta: meta }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    if (data?.error === "rate_limited")
      throw new Error(`Too many messages — please wait ${data.retry_after ?? "a few"} seconds.`);
    throw new Error("Failed to send message. Please try again later.");
  }
  return res.json();
}
