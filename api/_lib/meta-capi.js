// Shared Meta Conversions API (CAPI) logic for Purchase events.
// Used by every host so behaviour is identical everywhere:
//   - api/meta-capi.js                 (Vercel)
//   - netlify/functions/meta-capi.mjs  (Netlify)
//   - src/routes/api/meta-capi.ts      (local dev / SSR)
//
// The access token is NEVER committed (the repo is public). It is read from the
// META_CAPI_ACCESS_TOKEN environment variable on the host.

export const DEFAULT_META_PIXEL_ID = "1403921721710503";
const GRAPH_VERSION = "v21.0";

async function sha256Hex(input) {
  const buf = new TextEncoder().encode(String(input).trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashed(value) {
  return value ? [await sha256Hex(value)] : undefined;
}

// PH mobile numbers: 09XXXXXXXXX -> 639XXXXXXXXX (Meta wants country code, digits only).
function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("0") && digits.length === 11) return "63" + digits.slice(1);
  if (digits.startsWith("9") && digits.length === 10) return "63" + digits;
  return digits;
}

// Meta expects ISO 3166-1 alpha-2 lowercase country codes.
function normalizeCountry(country) {
  if (!country) return undefined;
  const c = String(country).trim().toLowerCase();
  if (c === "philippines" || c === "ph") return "ph";
  return c.length === 2 ? c : undefined;
}

function str(value, max = 500) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;
}

/**
 * @param {{ body: any, ip?: string, userAgent?: string, env: Record<string, string | undefined> }} args
 * @returns {Promise<{ status: number, json: Record<string, unknown> }>}
 */
export async function sendPurchaseEvent({ body, ip, userAgent, env }) {
  const token = env.META_CAPI_ACCESS_TOKEN;
  const pixelId = env.META_PIXEL_ID || DEFAULT_META_PIXEL_ID;
  if (!token) {
    console.error("[meta-capi] META_CAPI_ACCESS_TOKEN is not set");
    return { status: 500, json: { ok: false, error: "missing_token" } };
  }

  const { eventId, eventSourceUrl, value, currency = "PHP", contents, user = {} } = body ?? {};
  if (!str(eventId, 200) || typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return { status: 400, json: { ok: false, error: "invalid_payload" } };
  }

  const cleanContents = Array.isArray(contents)
    ? contents.slice(0, 50).map((c) => ({
        id: String(c?.id ?? ""),
        quantity: Number(c?.quantity) || 1,
        item_price: Number(c?.item_price) || 0,
      }))
    : undefined;

  const user_data = {
    em: await hashed(str(user.email)),
    ph: await hashed(normalizePhone(user.phone)),
    fn: await hashed(str(user.firstName)),
    ln: await hashed(str(user.lastName)),
    ct: await hashed(str(user.city)?.replace(/\s+/g, "")),
    country: await hashed(normalizeCountry(user.country)),
    client_ip_address: ip || undefined,
    client_user_agent: userAgent || undefined,
    fbp: str(user.fbp),
    fbc: str(user.fbc),
  };
  Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: str(eventId, 200),
        event_source_url: str(eventSourceUrl, 2000),
        action_source: "website",
        user_data,
        custom_data: {
          currency: str(currency, 3) || "PHP",
          value,
          contents: cleanContents,
          content_type: cleanContents ? "product" : undefined,
          num_items: cleanContents?.reduce((s, c) => s + c.quantity, 0),
        },
      },
    ],
    // Optional: set META_TEST_EVENT_CODE to see events in Events Manager > Test Events.
    ...(env.META_TEST_EVENT_CODE ? { test_event_code: env.META_TEST_EVENT_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[meta-capi] Meta API error", res.status, json);
      return { status: 502, json: { ok: false, error: json?.error?.message || "capi_failed" } };
    }
    return { status: 200, json: { ok: true, events_received: json?.events_received } };
  } catch (err) {
    console.error("[meta-capi] request failed", err);
    return { status: 502, json: { ok: false, error: "capi_unreachable" } };
  }
}

export function clientIpFrom(headers) {
  const get = (name) => (typeof headers.get === "function" ? headers.get(name) : headers[name]);
  const forwarded = get("x-forwarded-for");
  return (
    get("x-nf-client-connection-ip") ||
    get("cf-connecting-ip") ||
    get("x-real-ip") ||
    (forwarded ? String(forwarded).split(",")[0].trim() : undefined) ||
    undefined
  );
}
