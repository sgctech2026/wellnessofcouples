import { Play } from "lucide-react";
import { FadeUp } from "./FadeUp";

const PORTRAITS = {
  warm: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(220, 175, 150, 0.9), transparent 55%)",
    "linear-gradient(180deg, #C49878, #7A5440, #3A2515)",
  ].join(", "),
  cool: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(210, 190, 180, 0.9), transparent 55%)",
    "linear-gradient(180deg, #B8A090, #6A4E44, #2F1F1A)",
  ].join(", "),
  deep: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(195, 160, 135, 0.9), transparent 55%)",
    "linear-gradient(180deg, #A07860, #553828, #200F08)",
  ].join(", "),
  default: [
    "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(225, 195, 170, 0.85), transparent 55%)",
    "linear-gradient(180deg, #B89478, #6F4A38, #2C170E)",
  ].join(", "),
} as const;

type Expert = {
  name: string;
  creds: string;
  duration: string;
  bg: keyof typeof PORTRAITS;
};

const EXPERTS: Expert[] = [
  { name: "Prof. Suzanne Deckers", creds: "Clinical Endocrinologist · Harvard MD", duration: "2:15", bg: "warm" },
  { name: "Dr. James Green", creds: "Integrative Medicine · Stanford MD", duration: "3:20", bg: "cool" },
  { name: "Dr. Clara Mounakher", creds: "OB-GYN · Women's Hormonal Health", duration: "1:55", bg: "deep" },
  { name: "Dr. James DiSantonio", creds: "Urologist · Men's Health Specialist", duration: "2:40", bg: "default" },
  { name: "Dr. Jeremy London", creds: "Cardiothoracic Surgeon", duration: "2:05", bg: "warm" },
  { name: "Dr. Amy Shah", creds: "Board-Certified Immunologist", duration: "3:10", bg: "cool" },
];

const DOT_PATTERN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.5)'/></svg>`,
  );

function ExpertCard({ expert, delay }: { expert: Expert; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <button
        type="button"
        className="group block w-full overflow-hidden rounded-2xl bg-cream text-left text-ink shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-2xl"
        aria-label={`View bio for ${expert.name}`}
      >
        {/* Photo */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            style={{ backgroundImage: PORTRAITS[expert.bg] }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)" }}
          />
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-ink backdrop-blur-md">
              Bio · {expert.duration}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="desire-play-btn desire-play-btn--sm relative inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md">
              <span className="desire-pulse-ring absolute inset-0 rounded-full border border-white/40" aria-hidden />
              <Play className="h-4 w-4 fill-cream" />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="font-serif text-base font-medium text-ink">{expert.name}</p>
          <p className="mt-1 text-xs text-mute">{expert.creds}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-red">
            View Bio
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            >
              →
            </span>
          </p>
        </div>
      </button>
    </FadeUp>
  );
}

export function ExpertsGrid() {
  return (
    <section
      className="relative overflow-hidden px-8 py-28 text-cream"
      style={{
        background:
          "linear-gradient(180deg, var(--red-ink) 0%, var(--red-dark) 100%)",
      }}
    >
      {/* Grain dot overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${DOT_PATTERN}")`,
          opacity: 0.03,
        }}
      />

      <div className="relative mx-auto max-w-[1100px]">
        {/* Header */}
        <div className="mb-16 text-center">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-light">
             , Backed by World-Class Expertise ,
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2
              className="mt-5 font-serif text-cream"
              style={{
                fontSize: "clamp(2.25rem, 4.5vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Meet the Experts Behind
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p
              className="mt-3 font-serif italic text-gold-light"
              style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)" }}
            >
              DESIRE&rsquo;s revolutionary formula
            </p>
          </FadeUp>
        </div>

        {/* Grid */}
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTS.map((e, i) => (
            <ExpertCard key={e.name} expert={e} delay={0.05 + i * 0.06} />
          ))}
        </div>

        {/* Pull quote */}
        <FadeUp delay={0.3}>
          <div
            className="mx-auto max-w-[800px] rounded-2xl p-10 text-center backdrop-blur-md"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(251, 247, 240, 0.08)",
            }}
          >
            <p className="font-serif text-lg italic leading-relaxed text-cream/90">
              &ldquo;The DESIRE formulation isn&rsquo;t just an update, it&rsquo;s an
              evolution. By upgrading to bioactive forms like Ashwagandha KSM-66 and
              significantly increasing key doses, we&rsquo;re delivering cellular
              support that&rsquo;s rarely seen in a single product.&rdquo;
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <span
                aria-hidden
                className="h-8 w-8 rounded-full"
                style={{ background: PORTRAITS.default }}
              />
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-light">
               , Dr. Steven Muscakher, Chief Formulator
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
