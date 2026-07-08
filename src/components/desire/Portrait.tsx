/**
 * Shared portrait placeholder helper, generates richer gradient backgrounds
 * with a subtle "face silhouette" suggestion (warm light at top, dark base).
 */

export type PortraitVariant = "warm" | "cool" | "deep" | "default";

const BASES: Record<PortraitVariant, string> = {
  default: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(232, 200, 170, 0.9), rgba(200, 160, 130, 0.6) 30%, transparent 55%)",
    "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(100, 60, 45, 0.8), rgba(60, 30, 20, 0.9) 40%, transparent 70%)",
    "linear-gradient(180deg, #D4A888 0%, #8B6A50 45%, #4A2F20 100%)",
  ].join(", "),
  warm: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(220, 175, 150, 0.9), transparent 55%)",
    "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(120, 70, 50, 0.8), transparent 70%)",
    "linear-gradient(180deg, #C49878 0%, #7A5440 45%, #3A2515 100%)",
  ].join(", "),
  cool: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(210, 190, 180, 0.9), transparent 55%)",
    "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(70, 50, 50, 0.8), transparent 70%)",
    "linear-gradient(180deg, #B8A090 0%, #6A4E44 45%, #2F1F1A 100%)",
  ].join(", "),
  deep: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(195, 160, 135, 0.9), transparent 55%)",
    "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(50, 20, 15, 0.9), transparent 70%)",
    "linear-gradient(180deg, #A07860 0%, #553828 45%, #200F08 100%)",
  ].join(", "),
};

const FACE_GLOW =
  "radial-gradient(ellipse 35% 25% at 50% 22%, rgba(255, 220, 190, 0.5), transparent 60%)";

/** Inline-style background for a portrait variant. */
export function portraitBg(variant: PortraitVariant): string {
  return BASES[variant];
}

/**
 * Renders the gradient + face silhouette glow as absolute fill layers.
 * Wrap inside a `relative overflow-hidden` parent.
 */
export function PortraitFill({
  variant,
  hoverScale = false,
}: {
  variant: PortraitVariant;
  hoverScale?: boolean;
}) {
  const transform = hoverScale
    ? "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
    : "";
  return (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 ${transform}`}
        style={{ backgroundImage: BASES[variant] }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: FACE_GLOW }}
      />
    </>
  );
}

/**
 * Small uppercase corner badge to label what each photo placeholder represents.
 */
export function PhotoTag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "live";
}) {
  if (variant === "live") {
    return (
      <span className="absolute top-4 right-4 z-[3] inline-flex items-center gap-1.5 rounded-full bg-red px-2.5 py-1 text-[9px] font-semibold tracking-[0.2em] uppercase text-white">
        <span className="desire-pulse-dot inline-block h-[5px] w-[5px] rounded-full bg-white" />
        {children}
      </span>
    );
  }
  return (
    <span className="absolute top-4 right-4 z-[3] inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.2em] uppercase text-ink backdrop-blur-md">
      {children}
    </span>
  );
}
