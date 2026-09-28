/**
 * Pancake POS API integration.
 * All calls go through a Supabase Edge Function proxy to keep the API key off the client.
 */

import { supabase } from "@/integrations/supabase/client";

/* ── Types ───────────────────────────────────────────── */

export type GeoItem = { id: string; name: string };

export type OrderPayload = {
  fullName: string;
  phone: string;
  streetAddress: string;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  communeId: string;
  communeName: string;
  landmark: string;
  paymentMethod: "cod" | "transfer";
  price: number;
  productId: string;     // e.g. "For him"
  variationId: string;   // UUID from variationCache
  websiteOrderId?: string;
  bundleLabel: string;   // e.g. "2 Bottles" or "2M + 2W"
};

/* ── Edge Function proxy helper ──────────────────────── */

async function callPancake(action: string, payload?: object) {
  const { data, error } = await supabase.functions.invoke("pancake-proxy", {
    body: { action, payload },
  });
  if (error) throw error;
  return data;
}

/* ── SKU → Variation ID cache ────────────────────────── */

// key = display_id (sku), value = variation UUID
export const variationCache = new Map<string, string>();
let variationsFetched = false;

export async function fetchVariations(): Promise<void> {
  if (variationsFetched) return;
  const json = await callPancake("getVariations");
  const data: Array<{ id: string; display_id: string }> = json.data ?? [];
  for (const v of data) {
    variationCache.set(v.display_id, v.id);
  }
  variationsFetched = true;
}

/* ── Mapping cart items → Pancake SKU / product_id ──── */

type SkuEntry = { sku: string; productId: string; price: number };

// variant + bundleSize → Pancake variation display_id & product display_id
const SKU_MAP: Record<string, Record<number, SkuEntry>> = {
  her: {
    1: { sku: "1 WM", productId: "For her", price: 899 },
    2: { sku: "2 WM", productId: "For her", price: 1598 },
    3: { sku: "3 WM", productId: "For her", price: 2097 },
  },
  him: {
    1: { sku: "1 M", productId: "For him", price: 899 },
    2: { sku: "2 M", productId: "For him", price: 1598 },
    3: { sku: "3 M", productId: "For him", price: 2097 },
  },
  couple: {
    1: { sku: "M1 WM1", productId: "For couple", price: 1598 },
    2: { sku: "M2 WM2", productId: "For couple", price: 2796 },
  },
};

/**
 * Resolve a cart line to its Pancake SKU entry.
 * `variant` is "him" | "her" | "couple", `bundleSize` is the bottle count.
 */
export function resolveSkuEntry(
  variant: string,
  bundleSize: number,
): SkuEntry | null {
  console.log("RESOLVE SKU INPUT:", { variant, bundleSize });
  const entry = SKU_MAP[variant]?.[bundleSize] ?? null;
  console.log("RESOLVE SKU RESULT:", entry);
  return entry;
}

/* ── Geo endpoints ───────────────────────────────────── */

export async function fetchProvinces(): Promise<GeoItem[]> {
  const json = await callPancake("getProvinces");
  console.log("PANCAKE GEO PROVINCES RAW:", JSON.stringify(json).slice(0, 500));
  return ((json.data ?? []) as Array<{ id: string; name: string }>)
    .map((d) => ({ id: d.id, name: d.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchDistricts(provinceId: string): Promise<GeoItem[]> {
  const json = await callPancake("getDistricts", { province_id: provinceId });
  return ((json.data ?? []) as Array<{ id: string; name: string }>)
    .map((d) => ({ id: d.id, name: d.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchCommunes(districtId: string): Promise<GeoItem[]> {
  const json = await callPancake("getCommunes", { district_id: districtId });
  return ((json.data ?? []) as Array<{ id: string; name: string }>)
    .map((d) => ({ id: d.id, name: d.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ── Submit order ────────────────────────────────────── */

export async function submitOrder(orderData: OrderPayload) {
  const fullAddress = [
    orderData.streetAddress,
    orderData.communeName,
    orderData.districtName,
    orderData.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  const SHOP_ID = "1635271122";
  // Two Desire websites share this Pancake shop; tag orders so staff can tell
  // wellnessforcouples.shop orders apart from desirephilippines.com ones.
  const SOURCE_LABEL = "Source: wellnessforcouples.shop";

  const body = {
    shop_id: Number(SHOP_ID),
    bill_full_name: orderData.fullName,
    bill_phone_number: orderData.phone,
    shipping_address: {
      address: orderData.streetAddress,
      full_address: fullAddress,
      full_name: orderData.fullName,
      phone_number: orderData.phone,
      country_code: "63",
      province_id: orderData.provinceId,
      province_name: orderData.provinceName,
      district_id: orderData.districtId,
      district_name: orderData.districtName,
      commune_id: orderData.communeId,
      commnue_name: orderData.communeName,
      commune_name: orderData.communeName,
    },
    province_id: orderData.provinceId,
    district_id: orderData.districtId,
    commune_id: orderData.communeId,
    bill_province: orderData.provinceName,
    bill_district: orderData.districtName,
    bill_commune: orderData.communeName,
    note_print: orderData.landmark
      ? `Landmark: ${orderData.landmark}`
      : "",
    // Pancake shows `note` and `note_internal` together in the internal (Nội bộ)
    // box, so send only `note` to avoid a duplicated block. Landmark is already
    // in note_print ("Để in").
    note: [
      SOURCE_LABEL,
      `Payment: ${orderData.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Bank Transfer / GCash"}`,
      `Amount: ₱${orderData.price.toLocaleString()}`,
      `Website Order ID: ${orderData.websiteOrderId ?? "N/A"}`,
      `Product: ${orderData.productId} - ${orderData.bundleLabel}`,
    ].join("\n"),
    is_free_shipping: true,
    cod: orderData.paymentMethod === "cod" ? Number(orderData.price) : 0,
    cash: orderData.paymentMethod === "transfer" ? Number(orderData.price) : 0,
    items: [
      {
        product_id: orderData.productId,
        variation_id: orderData.variationId,
        quantity: 1,
        retail_price: orderData.price,
      },
    ],
  };

  console.log("PANCAKE ORDER PAYLOAD:", JSON.stringify(body, null, 2));

  const json = await callPancake("createOrder", body);

  // Handle business-level errors returned by the proxy (e.g. duplicate phone)
  if (json && json.success === false && json.message) {
    throw new Error(json.message);
  }

  return json;
}
