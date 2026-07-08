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
