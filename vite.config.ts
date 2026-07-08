import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const isNetlify = process.env.NETLIFY === "1" || process.env.NETLIFY === "true";
const isLovableSandbox = process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

export default defineConfig({
  tanstackStart: {
    // SPA/static shell mode is required for static hosting deployments.
    // Keep SSR enabled inside the Lovable sandbox so the live preview works.
    spa: { enabled: (isVercel || isNetlify) && !isLovableSandbox },
  },
});
