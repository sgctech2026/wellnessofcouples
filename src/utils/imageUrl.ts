/**
 * Returns the image URL as-is for now.
 * 
 * Supabase image transforms (render/image) require a Pro plan.
 * When the project upgrades, change `useTransforms` to true to enable
 * automatic WebP conversion and resizing via URL params.
 */
export function getOptimizedImageUrl(
  path: string,
  _options: { width?: number; quality?: number; format?: "webp" | "origin" } = {}
): string {
  // Transforms not available on current plan - return original URL
  return path;
}
