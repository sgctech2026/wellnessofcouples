// Analytics client for external Supabase project.
// All tracking runs client-side. Anon inserts allowed via RLS policies (see SQL).
import { createClient } from "@supabase/supabase-js";

const ANALYTICS_URL = "https://zaigkluzridnzefclser.supabase.co";
const ANALYTICS_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphaWdrbHV6cmlkbnplZmNsc2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5OTczMDMsImV4cCI6MjA5OTU3MzMwM30.KviBbsBPEsrP4mbxHwxm3ywm1QyoczSRgIJqLJBb3h0";

// Brand tag — one shared analytics DB serves many brands. Every row is
// stamped with this so each site's /admin only sees its own data.
// CHANGE THIS PER WEBSITE (e.g. "desire", "brandx").
export const ANALYTICS_BRAND = "desire";

// Password for /admin page. Change this to rotate access.
export const ADMIN_PASSWORD = "SGC12345!";

// Untyped client — external project, no generated Database types
let _client: any = null;
export function analyticsClient(): any {
  if (typeof window === "undefined") return null;
  if (_client) return _client;
  _client = createClient(ANALYTICS_URL, ANALYTICS_ANON, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
  return _client;
}

const DEVICE_KEY = "desire_device_id";
export function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `d_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

const LAST_VISIT_PREFIX = "desire_lastvisit_";
const ENGAGED_PREFIX = "desire_engaged_";
const TWENTY_FOUR_H = 24 * 60 * 60 * 1000;
const TWO_MIN = 2 * 60 * 1000;

/** Insert a visit row if this device has NOT visited this path in the last 24h. */
export async function trackVisit(path: string) {
  const c = analyticsClient();
  if (!c) return;
  const key = LAST_VISIT_PREFIX + path;
  const last = Number(localStorage.getItem(key) || 0);
  if (Date.now() - last < TWENTY_FOUR_H) return;
  localStorage.setItem(key, String(Date.now()));
  try {
    await c.from("analytics_visits").insert({
      brand: ANALYTICS_BRAND,
      device_id: getDeviceId(),
      page_path: path,
    });
  } catch (e) {
    console.warn("[analytics] visit failed", e);
  }
}

let engagedTimer: ReturnType<typeof setTimeout> | null = null;
/** Fire an engaged-visit row after 2 minutes on the page. One row per device+path per 24h. */
export function startEngagementTimer(path: string) {
  if (typeof window === "undefined") return;
  if (engagedTimer) clearTimeout(engagedTimer);
  engagedTimer = setTimeout(async () => {
    const key = ENGAGED_PREFIX + path;
    const last = Number(localStorage.getItem(key) || 0);
    if (Date.now() - last < TWENTY_FOUR_H) return;
    localStorage.setItem(key, String(Date.now()));
    const c = analyticsClient();
    if (!c) return;
    try {
      await c.from("analytics_engaged").insert({
        brand: ANALYTICS_BRAND,
        device_id: getDeviceId(),
        page_path: path,
      });
    } catch (e) {
      console.warn("[analytics] engaged failed", e);
    }
  }, TWO_MIN);
}
export function stopEngagementTimer() {
  if (engagedTimer) {
    clearTimeout(engagedTimer);
    engagedTimer = null;
  }
}

/** Called by cartStore when a user adds a product to cart. */
export async function trackAddToCart(payload: {
  product: string;
  variant?: string;
  qty?: number;
  price?: number;
}) {
  const c = analyticsClient();
  if (!c) return;
  try {
    await c.from("analytics_cart").insert({
      brand: ANALYTICS_BRAND,
      device_id: getDeviceId(),
      product: payload.product,
      variant: payload.variant ?? null,
      qty: payload.qty ?? 1,
      price: payload.price ?? null,
    });
  } catch (e) {
    console.warn("[analytics] cart failed", e);
  }
}

/** Called when checkout completes. Also marks this device's add-to-cart rows as converted. */
export async function trackCheckout(orderId: string, total: number) {
  const c = analyticsClient();
  if (!c) return;
  const device_id = getDeviceId();
  try {
    await c.from("analytics_checkouts").insert({
      brand: ANALYTICS_BRAND,
      device_id,
      order_id: orderId,
      total,
    });
    await c
      .from("analytics_cart")
      .update({ checked_out: true })
      .eq("device_id", device_id)
      .eq("checked_out", false);
  } catch (e) {
    console.warn("[analytics] checkout failed", e);
  }
}

/**
 * Observes elements with `data-track-section="Section Name"` and records how long
 * they are visible (>=50%). Fires one row per section per page-view when the
 * user leaves the section or the page.
 */
export function initSectionTracker(path: string) {
  if (typeof window === "undefined") return () => {};
  const c = analyticsClient();
  const timers = new Map<Element, { start: number; total: number; name: string }>();

  const flush = async (el: Element) => {
    const t = timers.get(el);
    if (!t) return;
    if (t.start) {
      t.total += Date.now() - t.start;
      t.start = 0;
    }
    if (t.total < 800) return; // ignore blips <0.8s
    const duration = t.total;
    t.total = 0;
    if (!c) return;
    try {
      await c.from("analytics_sections").insert({
        brand: ANALYTICS_BRAND,
        device_id: getDeviceId(),
        page_path: path,
        section_id: t.name,
        section_name: t.name,
        duration_ms: duration,
      });
    } catch (e) {
      console.warn("[analytics] section failed", e);
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target;
        const name = (el as HTMLElement).dataset.trackSection || "";
        if (!name) continue;
        let t = timers.get(el);
        if (!t) {
          t = { start: 0, total: 0, name };
          timers.set(el, t);
        }
        if (e.isIntersecting) {
          t.start = Date.now();
        } else if (t.start) {
          t.total += Date.now() - t.start;
          t.start = 0;
        }
      }
    },
    { threshold: [0.5] },
  );

  // Observe existing + future nodes
  const observeAll = () => {
    document.querySelectorAll<HTMLElement>("[data-track-section]").forEach((el) => {
      if (!timers.has(el)) io.observe(el);
    });
  };
  observeAll();
  const mo = new MutationObserver(observeAll);
  mo.observe(document.body, { childList: true, subtree: true });

  const flushAll = () => {
    timers.forEach((_, el) => flush(el));
  };
  const onHide = () => {
    if (document.visibilityState === "hidden") flushAll();
  };
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", flushAll);

  return () => {
    flushAll();
    io.disconnect();
    mo.disconnect();
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", flushAll);
    timers.clear();
  };
}
