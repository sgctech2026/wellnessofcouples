import { Play } from "lucide-react";
import { FadeUp } from "./FadeUp";

const WARM = [
  "radial-gradient(ellipse 60% 40% at 50% 22%, rgba(232, 200, 170, 0.95), rgba(200, 155, 125, 0.7) 30%, transparent 55%)",
  "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(100, 40, 40, 0.85), rgba(60, 15, 15, 0.95) 40%, transparent 70%)",
  "linear-gradient(180deg, #D4A88B 0%, #8B5A48 40%, #3A1818 100%)",
].join(", ");

const DEEP = [
  "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(195, 160, 135, 0.9), transparent 55%)",
  "linear-gradient(180deg, #A07860, #553828, #200F08)",
].join(", ");

const COOL = [
  "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(210, 190, 180, 0.9), transparent 55%)",
  "linear-gradient(180deg, #B8A090, #6A4E44, #2F1F1A)",
].join(", ");

const SECTION_BG =
  "linear-gradient(180deg, #0a0505 0%, #1a0808 40%, #2d0d0d 100%)";

const BOTTOM_OVERLAY =
  "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.85) 100%)";

function Badge({
  children,
  variant = "glass",
}: {
  children: React.ReactNode;
  variant?: "glass" | "red";
}) {
  if (variant === "red") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-white">
        <span className="desire-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-ink shadow-sm backdrop-blur-md">
      {children}
    </span>
  );
}

function Stars() {
  return (
    <span className="flex items-center gap-0.5 text-gold-light">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-xs">
          ★
        </span>
      ))}
    </span>
  );
}

function PlayCircle({ size = 36 }: { size?: number }) {
  const isSm = size <= 40;
  return (
    <span
      className={`desire-play-btn ${isSm ? "desire-play-btn--sm" : ""} relative inline-flex items-center justify-center rounded-full backdrop-blur-md`}
      style={{ width: size, height: size }}
    >
      <span
        className="desire-pulse-ring absolute inset-0 rounded-full border border-white/40"
        aria-hidden
      />
      <Play
        className="fill-cream"
        style={{ width: size * 0.4, height: size * 0.4, marginLeft: 2 }}
      />
    </span>
  );
}

export function Intro() {
  return (
    <section
      className="px-8 py-28"
      style={{ background: SECTION_BG }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-14 text-center">
          <FadeUp>
            <h2
              className="font-serif text-cream"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Couples. Doctors. 20M+ Servings Delivered.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p
              className="mt-4 font-serif italic text-gold-light"
              style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.4rem)" }}
            >
              They all drink DESIRE.
            </p>
          </FadeUp>
        </div>

        {/* Grid, staggered: side cards smaller, center bigger and lifted */}
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[1fr_1.3fr_1fr]">
          {/* LEFT, Dr. Maria (smaller, slightly lower) */}
          <FadeUp delay={0.1}>
            <button
              type="button"
              className="group relative block w-full overflow-hidden rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 lg:mt-12"
              style={{ aspectRatio: "3 / 4" }}
              aria-label="Dr. Maria Santos"
            >
              <div
                aria-hidden
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                style={{ backgroundImage: COOL }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: BOTTOM_OVERLAY }}
              />

              <div className="absolute top-4 right-4">
                <Badge>Doctor</Badge>
              </div>

              <div className="absolute bottom-4 right-4">
                <PlayCircle size={32} />
              </div>

              <div className="absolute bottom-4 left-4 right-14 text-left text-cream">
                <Stars />
                <p className="mt-2 font-serif text-base leading-tight">
                  Dr. Maria Santos
                </p>
                <p className="mt-0.5 text-[10px] tracking-wide text-cream/70">
                  OB-GYN · Makati Medical Center
                </p>
              </div>
            </button>
          </FadeUp>

          {/* CENTER, Charles & Claire (BIG, lifted) */}
          <FadeUp delay={0.2}>
            <button
              type="button"
              className="group relative block w-full overflow-hidden rounded-2xl shadow-[0_40px_70px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
              style={{ aspectRatio: "3 / 4" }}
              aria-label="Charles & Claire, featured"
            >
              <div
                aria-hidden
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                style={{ backgroundImage: WARM }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: BOTTOM_OVERLAY }}
              />

              <div className="absolute top-4 right-4">
                <Badge variant="red">Live</Badge>
              </div>

              <div className="absolute bottom-5 right-5">
                <PlayCircle size={44} />
              </div>

              <div className="absolute bottom-5 left-5 right-20 text-left text-cream">
                <Stars />
                <p className="mt-2 font-serif text-xl leading-snug">
                  Charles &amp; Claire
                </p>
                <p className="mt-1 text-[11px] tracking-wide text-cream/70">
                  Married 6 years · Couple Testimonial
                </p>
              </div>
            </button>
          </FadeUp>

          {/* RIGHT, Dennis Murillo (smaller, slightly lower) */}
          <FadeUp delay={0.3}>
            <button
              type="button"
              className="group relative block w-full overflow-hidden rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 lg:mt-12"
              style={{ aspectRatio: "3 / 4" }}
              aria-label="Dennis Murillo"
            >
              <div
                aria-hidden
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                style={{ backgroundImage: DEEP }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: BOTTOM_OVERLAY }}
              />

              <div className="absolute top-4 right-4">
                <Badge variant="red">Live</Badge>
              </div>

              <div className="absolute bottom-4 right-4">
                <PlayCircle size={32} />
              </div>

              <div className="absolute bottom-4 left-4 right-14 text-left text-cream">
                <Stars />
                <p className="mt-2 font-serif text-base leading-tight">
                  Dennis Murillo
                </p>
                <p className="mt-0.5 text-[10px] tracking-wide text-cream/70">
                  Actor · Age 48
                </p>
              </div>
            </button>
          </FadeUp>
        </div>

        {/* Stats row */}
        <FadeUp delay={0.4}>
          <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-20">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl text-gold-light">★</span>
                <span className="font-serif text-3xl font-medium text-cream">
                  4.8
                </span>
              </div>
              <span className="mt-1 text-[10px] tracking-[0.25em] uppercase text-cream/60">
                14,225 Verified Reviews
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl font-medium text-gold-light">
                16,255
              </span>
              <span className="mt-1 text-[10px] tracking-[0.25em] uppercase text-cream/60">
                Customer Purchases
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
