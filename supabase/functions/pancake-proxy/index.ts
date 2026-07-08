import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const PANCAKE_API_KEY = Deno.env.get("PANCAKE_API_KEY");
    const PANCAKE_SHOP_ID = Deno.env.get("PANCAKE_SHOP_ID");
    const BASE = "https://pos.pages.fm/api/v1";

    if (!PANCAKE_API_KEY || !PANCAKE_SHOP_ID) {
      console.error("Missing secrets: PANCAKE_API_KEY or PANCAKE_SHOP_ID");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action, payload } = body;

    console.log("Action received:", action);

    let url = "";
    let options: RequestInit = { method: "GET" };

    if (action === "getVariations") {
      url = `${BASE}/shops/${PANCAKE_SHOP_ID}/products/variations?api_key=${PANCAKE_API_KEY}&page_size=100`;
    } else if (action === "getProvinces") {
      url = `${BASE}/geo/provinces?api_key=${PANCAKE_API_KEY}&country_code=63`;
    } else if (action === "getDistricts") {
      url = `${BASE}/geo/districts?api_key=${PANCAKE_API_KEY}&province_id=${payload.province_id}`;
    } else if (action === "getCommunes") {
      url = `${BASE}/geo/communes?api_key=${PANCAKE_API_KEY}&district_id=${payload.district_id}`;
    } else if (action === "createOrder") {
      // Acknowledge duplicate customers/phones so repeat buyers can place new orders.
      // Pancake documents duplicated_phone / duplicated_customer in the order schema;
      // keep the older query/body flags too for backwards compatibility.
      url = `${BASE}/shops/${PANCAKE_SHOP_ID}/orders?api_key=${PANCAKE_API_KEY}&allow_duplicated_phone=1&allow_duplicate_phone=1&duplicated_phone_number_status=1&is_check_duplicated_phone=0&is_check_duplicated_phone_v2=0&force_create=1&force_save=1&skip_duplicate_check=1`;
      const enrichedPayload = {
        ...payload,
        duplicated_phone: true,
        duplicated_customer: true,
        merge_order: false,
        allow_duplicated_phone: true,
        allow_duplicate_phone: true,
        is_check_duplicated_phone: false,
        is_check_duplicated_phone_v2: false,
        duplicated_phone_number_status: 1,
        force_create: true,
        force_save: true,
        skip_duplicate_check: true,
        customer_id: null,
      };
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedPayload),
      };
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown action: ${action}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Pancake URL:", url.replace(PANCAKE_API_KEY, "***"));

    const res = await fetch(url, options);
    const text = await res.text();

    console.log("Pancake response status:", res.status, "body preview:", text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: `Pancake returned non-JSON: ${text.slice(0, 200)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Always return 200 so supabase.functions.invoke doesn't throw.
    // Include pancake_status so the frontend can detect business errors.
    if (!res.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          pancake_status: res.status,
          message: data?.message || "Pancake API error",
          message_code: data?.message_code || res.status,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
