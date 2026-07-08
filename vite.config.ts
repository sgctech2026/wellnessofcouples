import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const isNetlify = process.env.NETLIFY === "1" || process.env.NETLIFY === "true";
const isLovableSandbox = process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

const isStaticHost = (isVercel || isNetlify) && !isLovableSandbox;

export default defineConfig({
  // Disable Nitro for static SPA hosts so it doesn't collide with the
  // TanStack Start SPA shell prerender (which expects dist/server/server.js).
  ...(isStaticHost ? { nitro: false } : {}),
  tanstackStart: {
    // SPA/static shell mode is required for static hosting deployments.
    // Keep SSR enabled inside the Lovable sandbox so the live preview works.
    spa: {
      enabled: isStaticHost,
      // Emit the shell as index.html (default is /_shell) so static hosts
      // like Netlify serve it as the app entry point.
      ...(isStaticHost ? { prerender: { outputPath: "/index" } } : {}),
    },
  },
});
