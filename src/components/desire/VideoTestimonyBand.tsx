import { FadeUp } from "./FadeUp";

const WARM_PORTRAIT = [
  "radial-gradient(ellipse 60% 40% at 50% 22%, rgba(232, 200, 170, 0.95) 0%, rgba(200, 155, 125, 0.7) 30%, transparent 55%)",
  "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(100, 40, 40, 0.85), rgba(60, 15, 15, 0.95) 40%, transparent 70%)",
  "linear-gradient(180deg, #D4A88B 0%, #8B5A48 40%, #3A1818 100%)",
].join(", ");

const SECTION_BG =
  "linear-gradient(180deg, var(--ink) 0%, var(--red-ink) 100%)";

type Pillar = { num: string; title: string; body: string };

const PILLARS: Pillar[] = [
  {
    num: ", 01",
    title: "Feel More Present",
    body: "Support your body's natural response to stress. Be fully here, in the moment, with your partner.",
  },
  {
    num: ", 02",
    title: "Deepen Your Bond",
    body: "When you feel good in your body, connection flows naturally. DESIRE creates the conditions for closeness.",
  },
];

function PillarCard({ pillar, delay }: { pillar: Pillar; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <div
        className="group relative h-full overflow-hidden rounded-lg p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(212, 184, 135, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        }}
      >
        <p className="font-serif text-xs italic tracking-widest text-gold-light">
          {pillar.num}
        </p>
        <h4 className="mt-3 font-serif text-lg font-medium text-cream">
          {pillar.title}
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-cream/70">
          {pillar.body}
        </p>
      </div>
    </FadeUp>
  );
}

export function VideoTestimonyBand() {
  return (
    <section
      className="px-8 py-28 rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.5)]"
      style={{ background: SECTION_BG }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        {/* LEFT, couple portrait */}
        <FadeUp delay={0.15}>
          <div
            className="relative w-full overflow-hidden rounded-xl shadow-2xl"
            style={{ aspectRatio: "4 / 5" }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundImage: WARM_PORTRAIT }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)",
              }}
            />
            {/* Top-right badge */}
            <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase text-ink backdrop-blur-md">
              Couple Story
            </div>
          </div>
        </FadeUp>

        {/* RIGHT */}
        <div>
          <FadeUp>
            <p className="flex items-center gap-3 font-serif text-sm italic text-gold-light">
              <span
                aria-hidden
                className="inline-block h-px w-[30px] bg-gold-light"
              />
              The Question
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2
              className="mt-5 font-serif text-cream"
              style={{
                fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              When was the last time you felt{" "}
              <span className="italic text-gold-light">truly connected?</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p
              className="mt-7 font-serif text-lg italic leading-relaxed"
              style={{ color: "rgba(251, 247, 240, 0.85)" }}
            >
              It happens quietly. Life, stress, and time slowly pull you further
              from the closeness you once had.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p
              className="mt-5 text-base leading-relaxed"
              style={{ color: "rgba(251, 247, 240, 0.85)" }}
            >
              DESIRE is a premium wellness blend crafted with clinically studied
              botanicals, designed to help couples rediscover what life slowly
              took away. Natural. Effective. For both of you.
            </p>
          </FadeUp>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <PillarCard key={p.num} pillar={p} delay={0.4 + i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
