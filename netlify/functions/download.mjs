// Netlify serverless function: force-download proxy for certificate files.
// The site is a static SPA (no server runtime), so the TanStack /api/download
// route can't run in production. This function replaces it on Netlify.
//
// Wired up in netlify.toml:
//   [[redirects]] from = "/api/download" to = "/.netlify/functions/download" 200

const ALLOWED_HOSTS = [".supabase.co", ".b-cdn.net"];

export default async (request) => {
  const url = new URL(request.url);
  const fileUrl = url.searchParams.get("url");
  const filename = url.searchParams.get("filename") || "download";

  if (!fileUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  let target;
  try {
    target = new URL(fileUrl);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (!ALLOWED_HOSTS.some((h) => target.hostname.endsWith(h))) {
    return new Response("URL not allowed", { status: 403 });
  }

  const upstream = await fetch(target.toString());
  if (!upstream.ok || !upstream.body) {
    return new Response("Failed to fetch file", { status: 502 });
  }

  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
};
