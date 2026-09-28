// Vercel serverless function: Meta Conversions API (server-side Purchase).
// Token comes from the META_CAPI_ACCESS_TOKEN env var (Vercel project settings).
import { sendPurchaseEvent, clientIpFrom } from "./_lib/meta-capi.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const body = typeof req.body === "string" ? safeJson(req.body) : req.body;
  const { status, json } = await sendPurchaseEvent({
    body,
    ip: clientIpFrom(req.headers),
    userAgent: req.headers["user-agent"],
    env: process.env,
  });
  return res.status(status).json(json);
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
