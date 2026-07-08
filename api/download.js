const allowedHostPattern = /(^|\.)(supabase\.co|b-cdn\.net)$/;

function safeFilename(value) {
  return String(value || "download")
    .replace(/["\\\r\n]/g, "")
    .replace(/[\/]/g, "-")
    .trim() || "download";
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const rawUrl = req.query?.url;
  const rawFilename = req.query?.filename;
  const fileUrl = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl;
  const filename = safeFilename(Array.isArray(rawFilename) ? rawFilename[0] : rawFilename);

  if (!fileUrl) {
    return res.status(400).send("Missing url parameter");
  }

  let target;
  try {
    target = new URL(fileUrl);
  } catch {
    return res.status(400).send("Invalid url");
  }

  if (target.protocol !== "https:" || !allowedHostPattern.test(target.hostname)) {
    return res.status(403).send("URL not allowed");
  }

  try {
    const upstream = await fetch(target.toString());

    if (!upstream.ok) {
      return res.status(502).send("Failed to fetch file");
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(buffer);
  } catch {
    return res.status(502).send("Failed to fetch file");
  }
}