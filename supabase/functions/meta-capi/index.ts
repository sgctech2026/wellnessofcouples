import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = "1403921721710503";

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("META_CAPI_ACCESS_TOKEN");
    if (!token) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing_token" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { eventId, eventSourceUrl, value, currency = "PHP", contents, user = {} } = body ?? {};

    if (!eventId || typeof value !== "number") {
      return new Response(
        JSON.stringify({ ok: false, error: "invalid_payload" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const phoneDigits: string | undefined = user.phone?.replace(/\D/g, "");

    const user_data: Record<string, unknown> = {
      em: user.email ? [await sha256Hex(user.email)] : undefined,
      ph: phoneDigits ? [await sha256Hex(phoneDigits)] : undefined,
      fn: user.firstName ? [await sha256Hex(user.firstName)] : undefined,
      ln: user.lastName ? [await sha256Hex(user.lastName)] : undefined,
      ct: user.city ? [await sha256Hex(user.city)] : undefined,
      country: user.country ? [await sha256Hex(user.country)] : undefined,
      client_ip_address: ip,
      client_user_agent: userAgent,
      fbp: user.fbp,
      fbc: user.fbc,
    };
    Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: "website",
          user_data,
          custom_data: {
            currency,
            value,
            contents,
            content_type: contents ? "product" : undefined,
          },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Meta CAPI error", res.status, json);
      return new Response(
        JSON.stringify({ ok: false, error: json?.error?.message || "capi_failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: true, response: json }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("meta-capi edge fn error", err);
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
