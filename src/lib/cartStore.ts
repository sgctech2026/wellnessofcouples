import { useEffect, useState } from "react";

export type CartVariant = "him" | "her" | "couple";

export type CartItem = {
  id: string; // unique key
  variant: CartVariant;
  bundleId: number;
  name: string; // may include <em>
  meta: string;
  tag?: string;
  unitPrice: number; // price per "qty" unit (bundle price when isBundle, base bottle price otherwise)
  qty: number;
  image: string;
  // Bundle-aware fields
  isBundle: boolean;        // true when the line represents a multi-bottle bundle deal
  bundleSize: number;       // total bottle count this line represents per qty (1 if not a bundle)
  basePrice: number;        // per-bottle price when bundle is dissolved (e.g. 899)
  originalPrice: number;    // pre-discount bundle price (for "you save" display)
  bundleLabel?: string;     // e.g. "3 Bottles" - used in warning copy
};

const STORAGE_KEY = "desire_cart_v2";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("desire-cart-change"));
  // Report the updated cart to the Email Router (only if an email is known).
  fireAbandonedCart(items);
}

export function getCart(): CartItem[] {
  return read();
}

export function setCart(items: CartItem[]) {
  write(items);
}

export function addToCart(item: Omit<CartItem, "qty"> & { qty?: number }) {
  const items = read();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.qty += item.qty ?? 1;
  } else {
    items.push({ ...item, qty: item.qty ?? 1 });
  }
  write(items);
  // Fire analytics (fire-and-forget)
  import("./analytics")
    .then((m) =>
      m.trackAddToCart({
        product: item.name?.replace(/<[^>]+>/g, "") ?? item.id,
        variant: item.variant,
        qty: item.qty ?? 1,
        price: item.unitPrice,
      }),
    )
    .catch(() => {});
}

export function updateQty(id: string, qty: number) {
  const items = read()
    .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    .filter((i) => i.qty > 0);
  write(items);
}

/**
 * Dissolve a bundle line into its per-unit equivalent and apply a delta to qty.
 * - For "him"/"her": 3-bottle bundle → single bottles @ basePrice (₱899) each.
 * - For "couple": 2+2 bundle → 1+1 couple sets @ basePrice (₱1,598) each.
 */
export function dissolveBundle(id: string, delta: number) {
  const items = read().map((i) => {
    if (i.id !== id) return i;
    if (!i.isBundle) return { ...i, qty: Math.max(1, i.qty + delta) };
    const newQty = Math.max(1, i.bundleSize * i.qty + delta);
    const isCouple = i.variant === "couple";
    return {
      ...i,
      isBundle: false,
      bundleSize: 1,
      unitPrice: i.basePrice,
      originalPrice: i.basePrice,
      qty: newQty,
      meta: isCouple
        ? `${newQty} ${newQty === 1 ? "Set" : "Sets"} (1 Men + 1 Women each) · 30-day supply each`
        : `${newQty} ${newQty === 1 ? "Bottle" : "Bottles"} · 30-day supply each`,
      bundleLabel: undefined,
    };
  });
  write(items);
}

export function removeItem(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function clearCart() {
  write([]);
}

/* ── Stateless SKU-based cart restore ──────────────────────────────
   The cart_url encodes the cart as comma-separated SKU:quantity pairs
   (e.g. "1 M:1,2 WM:2"). No backend, no table — the URL rebuilds the
   cart. SKU ⇆ (variant, bundleSize) mapping lives here so restore is
   self-contained (matches SKU_MAP in pancakeService). */

const VARIANT_IMAGE: Record<CartVariant, string> = {
  him: "https://desirephilippines.b-cdn.net/HomePage/(NEW)%20MAIN%201%20(1)%20(1).webp",
  her: "https://desirephilippines.b-cdn.net/HomePage/(NEW)%20MAIN%201%20(2).webp",
  couple: "https://desirephilippines.b-cdn.net/HomePage/3.webp",
};

// SKU → the two things a cart line is built from + its pricing.
type SkuSpec = {
  variant: CartVariant;
  bundleSize: number;
  price: number;      // bundle price
  original: number;   // pre-discount price
  basePrice: number;  // per-unit price when a bundle is dissolved
  name: string;       // display name (may include <em>)
  meta: string;
  tag: string;
  bundleLabel: string;
};

const SKU_SPECS: Record<string, SkuSpec> = {
  "1 M":  { variant: "him", bundleSize: 1, price: 899,  original: 1798, basePrice: 899, name: "Desire for <em>Men</em>",   meta: "1 Bottle · 30-day supply",  tag: "For Him", bundleLabel: "1 Bottle" },
  "2 M":  { variant: "him", bundleSize: 2, price: 1598, original: 2499, basePrice: 899, name: "Desire for <em>Men</em>",   meta: "2 Bottles · 60-day supply", tag: "For Him", bundleLabel: "2 Bottles" },
  "3 M":  { variant: "him", bundleSize: 3, price: 2097, original: 4599, basePrice: 899, name: "Desire for <em>Men</em>",   meta: "3 Bottles · 90-day supply", tag: "For Him", bundleLabel: "3 Bottles" },
  "1 WM": { variant: "her", bundleSize: 1, price: 899,  original: 1798, basePrice: 899, name: "Desire for <em>Women</em>", meta: "1 Bottle · 30-day supply",  tag: "For Her", bundleLabel: "1 Bottle" },
  "2 WM": { variant: "her", bundleSize: 2, price: 1598, original: 2499, basePrice: 899, name: "Desire for <em>Women</em>", meta: "2 Bottles · 60-day supply", tag: "For Her", bundleLabel: "2 Bottles" },
  "3 WM": { variant: "her", bundleSize: 3, price: 2097, original: 4599, basePrice: 899, name: "Desire for <em>Women</em>", meta: "3 Bottles · 90-day supply", tag: "For Her", bundleLabel: "3 Bottles" },
  "M1 WM1": { variant: "couple", bundleSize: 1, price: 1598, original: 3596, basePrice: 1598, name: "Desire for <em>Couple</em>", meta: "1 Set (1 Men + 1 Women each) · 30-day supply", tag: "For Couple", bundleLabel: "1 Bottle Men + 1 Bottle Women" },
  "M2 WM2": { variant: "couple", bundleSize: 2, price: 2796, original: 7196, basePrice: 1598, name: "Desire for <em>Couple</em>", meta: "2 Sets (1 Men + 1 Women each) · 60-day supply", tag: "For Couple", bundleLabel: "2 Bottles Men + 2 Bottles Women" },
};

/** Resolve a cart line to its Pancake SKU (mirrors resolveSkuEntry). */
export function skuForLine(variant: CartVariant, bundleSize: number): string | null {
  const match = Object.entries(SKU_SPECS).find(
    ([, s]) => s.variant === variant && s.bundleSize === bundleSize,
  );
  return match ? match[0] : null;
}

/** Build a full CartItem from a known SKU + quantity. Returns null if unknown. */
function buildLineFromSku(sku: string, qty: number): CartItem | null {
  const s = SKU_SPECS[sku];
  if (!s) return null;
  return {
    id: `${s.variant}-${s.bundleSize}`,
    variant: s.variant,
    bundleId: s.bundleSize,
    name: s.name,
    meta: s.meta,
    tag: s.tag,
    unitPrice: s.price,
    qty: Math.max(1, qty),
    image: VARIANT_IMAGE[s.variant],
    isBundle: s.bundleSize > 1 || s.variant === "couple" ? s.bundleSize > 1 : false,
    bundleSize: s.bundleSize,
    basePrice: s.basePrice,
    originalPrice: s.original,
    bundleLabel: s.bundleLabel,
  };
}

/** Encode a cart as "SKU:qty,SKU:qty" (URL-encoded by the caller). */
export function encodeCartSkus(items: CartItem[]): string {
  return items
    .map((i) => {
      const sku = skuForLine(i.variant, i.bundleSize);
      return sku ? `${sku}:${i.qty}` : null;
    })
    .filter(Boolean)
    .join(",");
}

/**
 * Parse a "?restore=" value into cart items. Unknown/unresolvable SKUs are
 * skipped so the rest of the cart still restores — never an error page.
 */
export function parseRestoreParam(raw: string): CartItem[] {
  return raw
    .split(",")
    .map((pair) => {
      const idx = pair.lastIndexOf(":");
      if (idx < 0) return null;
      const sku = pair.slice(0, idx).trim();
      const qty = parseInt(pair.slice(idx + 1), 10);
      if (!sku || !Number.isFinite(qty) || qty < 1) return null;
      return buildLineFromSku(sku, qty);
    })
    .filter((x): x is CartItem => x !== null);
}

/** Absolute /checkout URL that restores this exact cart when opened. */
export function buildCartRestoreUrl(items: CartItem[]): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://desirephilippines.com";
  return `${origin}/checkout?restore=${encodeURIComponent(encodeCartSkus(items))}`;
}

/* ── Abandoned-cart capture (Email Router) ─────────────────────────
   Fires on every cart change for as long as we know the shopper's
   email (captured at the popup, the checkout field, or a past visit).
   Debounced, fire-and-forget, idempotent server-side (one open cart
   per email). If no email is known, it does nothing. */

const EMAIL_KEY = "desire_lead_email";
const EMAIL_ROUTER =
  "https://zaigkluzridnzefclser.supabase.co/functions/v1/subscribe?brand=desire-philippines";
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let abandonTimer: ReturnType<typeof setTimeout> | null = null;

/** Remember the shopper's email so later cart changes can be attributed. */
export function setLeadEmail(email: string) {
  if (typeof window === "undefined") return;
  const clean = (email || "").trim();
  if (!EMAIL_RX.test(clean)) return;
  try {
    localStorage.setItem(EMAIL_KEY, clean);
  } catch {
    /* ignore */
  }
}

export function getLeadEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(EMAIL_KEY);
    return v && EMAIL_RX.test(v) ? v : null;
  } catch {
    return null;
  }
}

/** Forget the lead email (e.g. after a completed order). */
export function clearLeadEmail() {
  if (typeof window === "undefined") return;
  if (abandonTimer) {
    clearTimeout(abandonTimer);
    abandonTimer = null;
  }
  try {
    localStorage.removeItem(EMAIL_KEY);
  } catch {
    /* ignore */
  }
}

/** Send the current cart to the Email Router if we have an email. Debounced. */
function fireAbandonedCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  const email = getLeadEmail();
  if (!email) return; // no email known → do nothing

  if (abandonTimer) clearTimeout(abandonTimer);
  abandonTimer = setTimeout(() => {
    const cartItems = items.map((i) => ({
      variation_id: skuForLine(i.variant, i.bundleSize),
      quantity: i.qty,
      name: i.name.replace(/<[^>]+>/g, "").trim(),
      price: i.unitPrice,
    }));
    const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    fetch(EMAIL_ROUTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        cart: {
          items: cartItems, // may be [] — an empty cart is a real signal
          total,
          cart_url: buildCartRestoreUrl(items),
        },
      }),
    }).catch(() => {});
  }, 1000); // debounce: 5 rapid clicks → one call
}

export function useCart(): CartItem[] {
  const [items, setItems] = useState<CartItem[]>(() => read());
  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener("desire-cart-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("desire-cart-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return items;
}
