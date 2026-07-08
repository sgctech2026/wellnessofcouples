import { Play } from "lucide-react";
import { FadeUp } from "./FadeUp";

const FOUNDER_PORTRAIT = [
  "radial-gradient(ellipse 60% 40% at 50% 22%, rgba(225, 195, 170, 0.9), transparent 55%)",
  "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(80, 25, 25, 0.85), transparent 70%)",
  "linear-gradient(180deg, #B89478, #6F4A38, #2C170E)",
].join(", ");

const PARAGRAPHS = [
  "I've been fortunate to work with some of the best wellness scientists and formulators in the world. DESIRE is the ritual I wish we had years ago, when stress, work, and daily life slowly pulled us apart.",
  "What makes DESIRE different is that it's engineered for couples. Not generic. Not hype. Just clinically studied botanicals at full doses, delivered in one daily ritual that fits into real life.",
  "I take it. My wife takes it. And it's why we built this, so other couples wouldn't have to settle for feeling disconnected in their own relationship.",
];

export function FounderNote() {
  return (
    <section
      className="relative overflow-hidden px-8 py-28 text-cream"
      style={{ backgroundColor: "#db2626" }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 220, 220, 0.15), transparent 65%)",
          filter: "blur(20px)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT */}
        <div>
          <FadeUp>
            <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-cream">
              A Note From Our Co-Founder
            </h3>
          </FadeUp>

          <div className="mt-8 space-y-6">
            {PARAGRAPHS.map((p, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.1}>
                <p className="font-serif text-base leading-relaxed text-cream">{p}</p>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.5}>
            <div className="mt-10 border-t border-cream/25 pt-6">
              <p className="font-serif text-2xl italic text-cream">
               , [Co-Founder Name]
              </p>
              <p className="mt-2 text-xs font-medium tracking-[0.25em] uppercase text-cream/70">
                Co-Founder · DESIRE Philippines
              </p>
            </div>
          </FadeUp>
        </div>

        {/* RIGHT, video */}
        <FadeUp delay={0.2}>
          <button
            type="button"
            className="group relative block w-full overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
            style={{ aspectRatio: "3 / 4" }}
            aria-label="Watch the founder story, Why we built DESIRE"
          >
            <div
              aria-hidden
              className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              style={{ backgroundImage: FOUNDER_PORTRAIT }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)",
              }}
            />

            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-ink backdrop-blur-md">
                Founder · 2:45
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="desire-play-btn relative inline-flex items-center justify-center rounded-full backdrop-blur-md"
                style={{ width: 62, height: 62 }}
              >
                <span
                  aria-hidden
                  className="desire-pulse-ring absolute inset-0 rounded-full border border-white/40"
                />
                <Play className="h-6 w-6 fill-cream" style={{ marginLeft: 3 }} />
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-left text-cream">
              <p className="font-serif text-xs italic tracking-widest text-gold-light">
                Watch the story
              </p>
              <p className="mt-1 font-serif text-lg">Why we built DESIRE</p>
            </div>
          </button>
        </FadeUp>
      </div>
    </section>
  );
}
