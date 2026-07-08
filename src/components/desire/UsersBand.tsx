import { Play } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { FadeUp } from "./FadeUp";
import { getOptimizedImageUrl } from "@/utils/imageUrl";
import { LazyVideo } from "./LazyVideo";

const COUPLE_IMAGES = [
  "https://desirephilippines.b-cdn.net/HomePage%20V2/2nd%20-%20The%20Question%20Section/1.webp",
  "https://desirephilippines.b-cdn.net/HomePage%20V2/2nd%20-%20The%20Question%20Section/2.webp",
  "https://desirephilippines.b-cdn.net/HomePage%20V2/2nd%20-%20The%20Question%20Section/3.webp",
  "https://desirephilippines.b-cdn.net/HomePage%20V2/2nd%20-%20The%20Question%20Section/4.webp",
];

function CoupleSlideshow() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % COUPLE_IMAGES.length),
      3500,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {COUPLE_IMAGES.map((src, i) => (
        <img
          key={src}
          src={getOptimizedImageUrl(src, { width: 600 })}
          alt=""
          aria-hidden={i !== idx}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === idx ? 1 : 0 }}
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
        />
      ))}
    </>
  );
}

type CardData = {
  name: string;
  role: string;
  badge: "LIVE" | "DOCTOR";
  bg: string;
  video?: string;
};

const WARM = [
  "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(220, 175, 150, 0.9), transparent 55%)",
  "radial-gradient(ellipse 80% 70% at 50% 85%, rgba(120, 70, 50, 0.8), transparent 70%)",
  "linear-gradient(180deg, #C49878, #7A5440, #3A2515)",
].join(", ");

const COOL = [
  "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(210, 190, 180, 0.9), transparent 55%)",
  "linear-gradient(180deg, #B8A090, #6A4E44, #2F1F1A)",
].join(", ");

const DEEP = [
  "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(195, 160, 135, 0.9), transparent 55%)",
  "linear-gradient(180deg, #A07860, #553828, #200F08)",
].join(", ");

const CARDS: CardData[] = [
  {
    name: "Dr. Maria Santos",
    role: "OB-GYN · Makati Medical Center",
    badge: "DOCTOR",
    bg: COOL,
    video:
      "https://qmfzkvfxjheyhrweyshl.supabase.co/storage/v1/object/public/Desire%20Website%20Assets/AQP8CYeLXX-6ARiJHQeQpEJTVmUtSt7N-c_2watx0ydfpuLxZG4dVDoWPWSWcNXoxcsZOw1pUUmkXK9HcshGEstP8bYTqrWqTewYnvyeMw.mp4",
  },
  {
    name: "Charles & Claire",
    role: "Married 6 years · Couple Testimonial",
    badge: "LIVE",
    bg: WARM,
    video:
      "https://qmfzkvfxjheyhrweyshl.supabase.co/storage/v1/object/public/Desire%20Website%20Assets/AQMpopq6oMn2nFt04PAHBElE0vPLr-xODDesOFYEw_dI8Kl9MKar_T6M2pvnpKtKySiZtqj2pLx8zgyTjUX--Tm26MnBsV4uS4t6ja9ztQ.mp4",
  },
  {
    name: "Dennis Murillo",
    role: "Actor · Age 48",
    badge: "LIVE",
    bg: DEEP,
    video:
      "https://qmfzkvfxjheyhrweyshl.supabase.co/storage/v1/object/public/Desire%20Website%20Assets/AQP7v0ZPsn7iNEWOJ0lC-dSsaV7LidABc54osPwZK7TXJsapcLcbKg7DZ1sZAKyegoPRvJ2DjhlmQz61kcj5NfvDAmBpY9R9PdM7W2Ipxw.mp4",
  },
];

function Badge({ kind }: { kind: "LIVE" | "DOCTOR" }) {
  if (kind === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-white">
        <span className="desire-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-ink backdrop-blur-md">
      Doctor
    </span>
  );
}

function VideoCard({ data, delay }: { data: CardData; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <button
        type="button"
        className="group relative block w-full overflow-hidden rounded-xl shadow-2xl transition-transform duration-500"
        style={{ aspectRatio: "3 / 4", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        aria-label={`${data.name}, ${data.role}`}
      >
        {/* Portrait bg with hover scale */}
        {data.video ? (
          <LazyVideo
            src={data.video}
            className="absolute inset-0 h-full w-full"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            style={{ backgroundImage: data.bg }}
          />
        )}
        {/* Bottom darken */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Top-right badge */}
        <div className="absolute top-4 right-4">
          <Badge kind={data.badge} />
        </div>

        {/* Bottom-right play */}
        <div className="absolute bottom-4 right-4 z-[3]">
          <span className="desire-play-btn desire-play-btn--sm relative inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md">
            <span className="absolute inset-0 rounded-full border border-white/40 desire-pulse-ring" aria-hidden />
            <Play className="h-3.5 w-3.5 fill-cream" />
          </span>
        </div>

        {/* Bottom-left info */}
        <div className="absolute bottom-4 left-4 right-16 text-left text-cream">
          <p className="text-gold-light" style={{ letterSpacing: "2px" }}>
            ★★★★★
          </p>
          <p className="mt-1 font-serif text-lg leading-tight">{data.name}</p>
          <p className="text-[11px] tracking-wide text-cream/70">{data.role}</p>
        </div>
      </button>
    </FadeUp>
  );
}

type Pillar = { title: string; bodyHtml: string };

const PILLARS: Pillar[] = [
  {
    title: "Feel More Present",
    bodyHtml:
      "Support your body's natural response to stress. Be <strong>fully here</strong>, in the moment, with your partner.",
  },
  {
    title: "Deepen Your Bond",
    bodyHtml:
      "When you feel good in your body, <strong>connection flows naturally.</strong> DESIRE creates the conditions for closeness.",
  },
];

function PillarCard({ pillar, delay }: { pillar: Pillar; delay: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    // Only auto-trigger on touch/coarse pointer devices (mobile)
    const mq = window.matchMedia("(max-width: 640px)");
    if (!mq.matches) return;

    const check = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const center = vh / 2;
      const tolerance = vh * 0.35;
      const cardCenter = rect.top + rect.height / 2;
      setActive(
        rect.top < vh && rect.bottom > 0 &&
        Math.abs(cardCenter - center) < tolerance
      );
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <FadeUp delay={delay}>
      <div
        ref={cardRef}
        className={`desire-pillar-card group relative h-full${active ? " is-active" : ""}`}
        onMouseMove={handleMouseMove}
      >
        <span className="desire-pillar-dot" aria-hidden />
        <h4
          className="font-sans text-ink"
          style={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          {pillar.title}
        </h4>
        <p
          className="font-sans text-mute"
          style={{ fontSize: "13px", lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: pillar.bodyHtml }}
        />
      </div>
    </FadeUp>
  );
}

export function UsersBand() {
  return (
    <section
      className="relative overflow-hidden bg-white px-8 pt-12 pb-12 md:pt-16 md:pb-16 text-ink"
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* Couple story + The Question */}
        <div className="desire-question-grid mb-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* LEFT, couple portrait (UNCHANGED) */}
          <FadeUp delay={0.15}>
            <div
              className="relative w-full overflow-hidden rounded-xl shadow-2xl"
              style={{ aspectRatio: "1 / 1" }}
            >
              <CoupleSlideshow />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase text-ink backdrop-blur-md">
                DESIRE STORY
              </div>
            </div>
          </FadeUp>

          {/* RIGHT, rebuilt premium column */}
          <div className="flex flex-col justify-center font-sans">
            <FadeUp delay={0}>
              <span className="desire-eyebrow-pill">
                <span className="desire-eyebrow-dot" aria-hidden />
                The Question
              </span>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h3
                className="font-sans text-ink"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  marginBottom: "1.25rem",
                }}
              >
                When was the last time you felt{" "}
                <span className="desire-italic-glow">truly connected?</span>
              </h3>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p
                className="font-sans text-ink"
                style={{
                  fontSize: "clamp(15px, 1.4vw, 18px)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  marginBottom: "1.25rem",
                  maxWidth: "540px",
                }}
              >
                It happens quietly. Life, stress, and time slowly pull you further
                from the closeness you once had.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p
                className="font-sans text-ink-2"
                style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                  maxWidth: "540px",
                }}
              >
                <span className="desire-product-name">DESIRE</span> is a premium
                wellness blend crafted with{" "}
                <span className="desire-highlight">clinically studied botanicals</span>,
                designed to help couples{" "}
                <strong style={{ fontWeight: 700, color: "var(--ink)" }}>
                  rediscover what life slowly took away.
                </strong>
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <p
                className="font-sans text-ink"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "1.75rem",
                }}
              >
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 700,
                    color: "var(--red)",
                  }}
                >
                  Natural. Effective.
                </em>{" "}
                For both of you.
              </p>
            </FadeUp>

            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              style={{ maxWidth: "580px" }}
            >
              {PILLARS.map((p, i) => (
                <PillarCard key={p.title} pillar={p} delay={0.5 + i * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
