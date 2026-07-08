/**
 * Guarded PWA service-worker registration.
 *
 * The service worker is only registered in a real production build served at the
 * custom/published domain. It is intentionally disabled in the Lovable editor
 * preview, local dev, and iframe contexts so stale caches never interfere with
 * development.
 */

const SW_PATH = "/sw.js";

function shouldRegister(): boolean {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  if (!import.meta.env.PROD) return false;
  if (window.self !== window.top) return false;

  const hostname = window.location.hostname;
  const search = window.location.search;

  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return false;
  if (hostname === "lovableproject.com" || hostname.endsWith(".lovableproject.com")) return false;
  if (hostname === "lovableproject-dev.com" || hostname.endsWith(".lovableproject-dev.com"))
    return false;
  if (hostname === "beta.lovable.dev" || hostname.endsWith(".beta.lovable.dev")) return false;
  if (search.includes("sw=off")) return false;

  return true;
}

async function unregisterStaleSw(): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.serviceWorker) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((r) => r.scope.endsWith(SW_PATH.replace(/\/?sw\.js$/, "/")) || r.scope.endsWith("/"))
      .map((r) => r.unregister()),
  );
}

export async function registerPWA(): Promise<void> {
  if (!shouldRegister()) {
    await unregisterStaleSw();
    return;
  }

  try {
    const { Workbox } = await import("workbox-window");
    const wb = new Workbox(SW_PATH);
    wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        // Skip waiting so the update activates on the next navigation.
        wb.messageSkipWaiting();
      }
    });
    await wb.register();
  } catch (err) {
    console.warn("Failed to register Pebble service worker:", err);
  }
}
