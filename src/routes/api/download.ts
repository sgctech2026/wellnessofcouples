import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const fileUrl = url.searchParams.get("url");
        const filename = url.searchParams.get("filename") || "download";

        if (!fileUrl) {
          return new Response("Missing url parameter", { status: 400 });
        }

        // Only allow Supabase storage URLs for security
        let target: URL;
        try {
          target = new URL(fileUrl);
        } catch {
          return new Response("Invalid url", { status: 400 });
        }
        const allowedHosts = [".supabase.co", ".b-cdn.net"];
        if (!allowedHosts.some((h) => target.hostname.endsWith(h))) {
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
      },
    },
  },
});
