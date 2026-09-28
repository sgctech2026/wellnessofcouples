import { createFileRoute } from "@tanstack/react-router";
import { sendPurchaseEvent, clientIpFrom } from "../../../api/_lib/meta-capi.js";

// Local dev / SSR version of /api/meta-capi. In production the static hosts
// serve this path from api/meta-capi.js (Vercel) or netlify/functions/meta-capi.mjs.
export const Route = createFileRoute("/api/meta-capi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const { status, json } = await sendPurchaseEvent({
          body,
          ip: clientIpFrom(request.headers),
          userAgent: request.headers.get("user-agent") || undefined,
          env: process.env,
        });
        return Response.json(json, { status });
      },
    },
  },
});
