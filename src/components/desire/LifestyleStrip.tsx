import { Play } from "lucide-react";
import { FadeUp } from "./FadeUp";

const PORTRAITS = {
  warm: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(220, 175, 150, 0.9), transparent 55%)",
    "linear-gradient(180deg, #C49878, #7A5440, #3A2515)",
  ].join(", "),
  default: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(225, 195, 170, 0.85), transparent 55%)",
    "linear-gradient(180deg, #B89478, #6F4A38, #2C170E)",
  ].join(", "),
  deep: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(195, 160, 135, 0.9), transparent 55%)",
    "linear-gradient(180deg, #A07860, #553828, #200F08)",
  ].join(", "),
  cool: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(210, 190, 180, 0.9), transparent 55%)",
    "linear-gradient(180deg, #B8A090, #6A4E44, #2F1F1A)",
  ].join(", "),
} as const;

type Cell = { name: string; role: string; bg: keyof typeof PORTRAITS };

const CELLS: Cell[] = [
  { name: "Mona Sharma", role: "Celebrity Nutritionist", bg: "warm" },
  { name: "TJ DeFalco", role: "Professional Volleyball Player", bg: "default" },
  { name: "Tim Biohacker", role: "Wellness Creator", bg: "deep" },
  { name: "Dr. Amy Shah", role: "Board-Certified Physician", bg: "cool" },
];

const STATS = [
  { num: "16,255", label: "Customer Purchases" },
  { num: "22M+", label: "Servings Delivered" },
  { num: "4.8/5", label: "Avg. Rating" },
];

function LifestyleCell({ cell, delay }: { cell: Cell; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <button
        type="button"
        className="desire-lifestyle-cell group relative block w-full overflow-hidden"
        style={{ aspectRatio: "3 / 4" }}
        aria-label={`${cell.name}, ${cell.role}`}
      >
        {/* Bg with hover scale */}
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          style={{ backgroundImage: PORTRAITS[cell.bg] }}
        />
        {/* Default dark overlay */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* Hover red-tinted overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(219, 38, 38, 0.15) 0%, transparent 40%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Top-right play */}
        <div className="absolute top-4 right-4 z-[3]">
          <span className="desire-play-btn desire-play-btn--sm relative inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md">
            <span className="desire-pulse-ring absolute inset-0 rounded-full border border-white/40" aria-hidden />
            <Play className="h-3.5 w-3.5 fill-cream" />
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-6 left-6 right-6 text-left text-cream">
          <h5 className="font-serif text-base font-medium leading-tight">{cell.name}</h5>
          <p className="mt-1 text-[11px] text-cream/65">{cell.role}</p>
        </div>
      </button>
    </FadeUp>
  );
}

export function LifestyleStrip() {
  return (
    <section
      className="text-cream"
      style={{
        background:
          "linear-gradient(180deg, var(--red-dark) 0%, var(--ink) 100%)",
      }}
    >
      <div className="px-8 pt-24 pb-16 text-center">
        <FadeUp>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-light">
           , Trusted By Real People ,
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2
            className="mx-auto mt-5 max-w-[900px] font-serif text-cream"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Couples, physicians, and{" "}
            <span className="italic text-red">16,255 customer purchases</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-4 text-xs text-cream/55">
            100% real customers. Zero paid endorsements.
          </p>
        </FadeUp>
      </div>

      {/* Full-bleed grid */}
      <div className="grid grid-cols-2 gap-[2px] lg:grid-cols-4">
        {CELLS.map((c, i) => (
          <LifestyleCell key={c.name} cell={c} delay={0.05 + i * 0.05} />
        ))}
      </div>

      {/* Big stats */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-20 gap-y-10 px-8 py-12"
        style={{ borderTop: "1px solid rgba(251, 247, 240, 0.08)" }}
      >
        {STATS.map((s, i) => (
          <FadeUp key={s.label} delay={0.05 + i * 0.08}>
            <div className="text-center">
              <p className="font-serif text-5xl text-gold-light">{s.num}</p>
              <p className="mt-2 text-[10px] tracking-[0.25em] uppercase text-cream/55">
                {s.label}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
