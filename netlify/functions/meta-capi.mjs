// Netlify serverless function: Meta Conversions API (server-side Purchase).
// Token comes from the META_CAPI_ACCESS_TOKEN env var (Netlify site settings).
//
// Wired up in netlify.toml:
//   [[redirects]] from = "/api/meta-capi" to = "/.netlify/functions/meta-capi" 200

import { sendPurchaseEvent, clientIpFrom } from "../../api/_lib/meta-capi.js";

export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
  }

  const body = await request.json().catch(() => null);
  const { status, json } = await sendPurchaseEvent({
    body,
    ip: clientIpFrom(request.headers),
    userAgent: request.headers.get("user-agent") || undefined,
    env: process.env,
  });
  return Response.json(json, { status });
};
