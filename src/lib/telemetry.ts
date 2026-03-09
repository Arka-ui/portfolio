/**
 * Lightweight client telemetry — collects anonymous device / browser
 * metrics and forwards them to the configured API endpoint.
 */

const API = process.env.NEXT_PUBLIC_API_URL;

/* ─── Collect client-side device data ─────────────────────── */

function clientData(): Record<string, unknown> {
  const nav = navigator as unknown as Record<string, unknown>;
  const conn = (nav.connection ?? nav.mozConnection ?? nav.webkitConnection) as
    | { effectiveType?: string }
    | undefined;

  const data: Record<string, unknown> = {
    screen: `${screen.width}×${screen.height}`,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    language: navigator.language,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack ?? "Unset",
    touchPoints: navigator.maxTouchPoints,
    colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "Dark"
      : "Light",
  };

  if (navigator.hardwareConcurrency)
    data.cores = navigator.hardwareConcurrency;
  if ((nav as { deviceMemory?: number }).deviceMemory)
    data.memory = (nav as { deviceMemory: number }).deviceMemory;
  if (conn?.effectiveType) data.connection = conn.effectiveType;

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

  // Battery (async, best-effort — attached later)
  return data;
}

/* ─── Page view event ─────────────────────────────────────── */

export async function trackPageView(page: string) {
  if (!API) return;
  try {
    const data = clientData();

    // Battery API (Chrome/Edge)
    try {
      const bm = await (navigator as unknown as { getBattery?: () => Promise<{ level: number; charging: boolean }> })
        .getBattery?.();
      if (bm)
        data.battery = `${Math.round(bm.level * 100)}%${bm.charging ? " ⚡" : ""}`;
    } catch { /* unavailable */ }

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

  const meta = clientData();

  const res = await fetch(`${API}/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, _meta: meta }),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
