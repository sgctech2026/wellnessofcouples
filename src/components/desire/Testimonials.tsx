import { useEffect, useState } from "react";
import { FadeUp } from "./FadeUp";
import { getOptimizedImageUrl } from "@/utils/imageUrl";

const charlesImg = "https://desirephilippines.b-cdn.net/HomePage%20V2/5th%20-%20Real%20Stories%20Section/53.webp";
const chloeImg = "https://desirephilippines.b-cdn.net/HomePage%20V2/5th%20-%20Real%20Stories%20Section/50.webp";
const dennisImg = "https://desirephilippines.b-cdn.net/HomePage%20V2/5th%20-%20Real%20Stories%20Section/52.webp";

type Testimonial = {
  name: string;
  age: number;
  location: string;
  duration: string;
  quote: string;
  image: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Charles Claridad",
    age: 24,
    location: "Quezon City",
    duration: "30 days using",
    quote:
      "Mas confident ako ngayon, mas relaxed, at mas present sa partner ko. Ramdam ko yung difference sa energy. Solid talaga Desire!",
    image: charlesImg,
  },
  {
    name: "Chloe Del Rosario",
    age: 33,
    location: "Makati",
    duration: "60 days using",
    quote:
      "Dati wala akong gana or confidence. After trying Desire Gummies, mas naging in the mood ako and it made a huge difference sa partner ko.",
    image: chloeImg,
  },
  {
    name: "Dennis Murillo",
    age: 48,
    location: "Pasig",
    duration: "90 days using",
    quote:
      "Grabe, bumalik 'yung init namin ng asawa ko! Mas ganado ako sa gabi, at mas masaya asawa ko. Age doesn't matter, ika nga!",
    image: dennisImg,
  },
];

const ROTATE_MS = 4000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function Testimonials() {
  const reducedMotion = usePrefersReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tick, setTick] = useState(0); // forces progress bar restart on manual change

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [isPaused, reducedMotion, currentIndex]);

  const goTo = (idx: number) => {
    setCurrentIndex(((idx % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length);
    setTick((t) => t + 1);
  };

  const otherIndices = [0, 1, 2].filter((i) => i !== currentIndex);

  // Reduced-motion fallback: simple static grid
  if (reducedMotion) {
    return (
      <section className="relative bg-white" style={{ padding: "6rem 3rem" }}>
        <div className="mx-auto max-w-[1200px]">
          <Header />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                className="rounded-2xl bg-white p-6"
                style={{
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.04), 0 10px 30px rgba(74, 12, 12, 0.06)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <img
                  src={getOptimizedImageUrl(t.image, { width: 400 })}
                  alt={t.name}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={300}
                />
                <p
                  className="italic text-ink-2"
                  style={{ fontSize: 14, lineHeight: 1.6 }}
                >
                  {t.quote}
                </p>
                <p className="mt-4 text-sm font-bold text-ink">{t.name}</p>
                <p className="text-xs text-mute">
                  Age {t.age} · {t.location}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden bg-white testimonials-section"
    >
      {/* Subtle atmospheric overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 300px at 50% 0%, rgba(219, 38, 38, 0.04), transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[1200px]">
        <Header />

        {/* MOBILE - auto-scrolling + swipeable */}
        <MobileTestimonialsMarquee />

        <div className="testimonials-desktop-only">

        {/* FEATURED HERO */}
        <div
          className="relative overflow-hidden testimonials-featured-card"
          style={{
            background: "#F8F8F8",
            borderRadius: 24,
            boxShadow: "0 30px 60px rgba(74, 12, 12, 0.08)",
            marginBottom: "2rem",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {TESTIMONIALS.map((t, i) => {
            const active = i === currentIndex;
            return (
              <div
                key={t.name}
                className="absolute inset-0 grid items-center testimonials-featured-grid"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "translateY(0)" : "translateY(20px)",
                  transition:
                    "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  pointerEvents: active ? "auto" : "none",
                }}
                aria-hidden={!active}
              >
                {/* Left image */}
                <div
                  className="relative overflow-hidden testimonials-featured-image"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <img
                    src={getOptimizedImageUrl(t.image, { width: 600 })}
                    alt={`${t.name} portrait`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={600}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)",
                    }}
                  />
                </div>

                {/* Right content */}
                <div className="testimonials-featured-content" style={{ padding: "3rem" }}>
                  <span
                    aria-hidden
                    className="inline-block font-serif font-bold"
                    style={{
                      color: "var(--red)",
                      fontSize: "4rem",
                      opacity: 0.4,
                      lineHeight: 0.5,
                      marginBottom: "1rem",
                    }}
                  >
                    “
                  </span>
                  <p
                    className="italic text-ink"
                    style={{
                      fontSize: "clamp(1.3rem, 1.9vw, 1.7rem)",
                      lineHeight: 1.4,
                      letterSpacing: "-0.01em",
                      marginBottom: "2rem",
                      fontWeight: 400,
                    }}
                  >
                    {t.quote}
                  </p>
                  <div
                    className="flex items-center justify-between"
                    style={{
                      paddingTop: "1.5rem",
                      borderTop: "1px solid var(--line)",
                    }}
                  >
                    <div>
                      <p
                        className="text-ink"
                        style={{ fontSize: 14, fontWeight: 700 }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="italic text-mute"
                        style={{ fontSize: 12, fontWeight: 400 }}
                      >
                        Age {t.age} · {t.location} · {t.duration}
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 font-bold uppercase"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: "var(--green)",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Progress indicators */}
          <div
            className="absolute z-[4] flex items-center testimonials-progress"
            style={{
              bottom: "1.5rem",
              right: "1.5rem",
              gap: 8,
              background: "rgba(13, 8, 6, 0.6)",
              backdropFilter: "blur(10px)",
              padding: "8px 12px",
              borderRadius: 100,
            }}
          >
            {TESTIMONIALS.map((t, i) => {
              const active = i === currentIndex;
              return (
                <button
                  key={`${t.name}-${active ? tick : "idle"}`}
                  type="button"
                  aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
                  onClick={() => goTo(i)}
                  className="relative cursor-pointer overflow-hidden"
                  style={{
                    width: 28,
                    height: 4,
                    borderRadius: 100,
                    background: active
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(255, 255, 255, 0.3)",
                    border: "none",
                    padding: 0,
                    transition: "background 0.4s",
                  }}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 h-full"
                      style={{
                        background: "var(--red)",
                        animation: isPaused
                          ? "none"
                          : `progressFill ${ROTATE_MS}ms linear forwards`,
                        width: isPaused ? "100%" : 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECONDARY CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {otherIndices.map((idx) => {
            const t = TESTIMONIALS[idx];
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => goTo(idx)}
                className="group flex cursor-pointer items-stretch text-left"
                style={{
                  gap: "1.5rem",
                  background: "var(--white)",
                  borderRadius: 16,
                  padding: "1.75rem",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.04), 0 10px 30px rgba(74, 12, 12, 0.06)",
                  border: "1px solid rgba(0, 0, 0, 0.04)",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.04), 0 20px 50px rgba(74, 12, 12, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.04), 0 10px 30px rgba(74, 12, 12, 0.06)";
                }}
              >
                <div
                  className="shrink-0 overflow-hidden"
                  style={{ width: 100, height: 100, borderRadius: 12 }}
                >
                  <img
                    src={getOptimizedImageUrl(t.image, { width: 200 })}
                    alt={t.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <p
                    className="italic"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "var(--ink-2)",
                      fontWeight: 400,
                    }}
                  >
                    {t.quote}
                  </p>
                  <div className="mt-3">
                    <p
                      className="text-ink"
                      style={{ fontSize: 12, fontWeight: 700 }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-mute"
                      style={{ fontSize: 11, fontWeight: 400 }}
                    >
                      Age {t.age} · {t.location}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CONTROLS */}
        <div
          className="flex items-center justify-between"
          style={{ marginTop: "2rem", padding: "0 1rem" }}
        >
          <p
            className="font-sans uppercase text-mute"
            style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em" }}
          >
            <strong
              style={{
                color: "var(--red)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {String(currentIndex + 1).padStart(2, "0")}
            </strong>{" "}
            / {String(TESTIMONIALS.length).padStart(2, "0")}
          </p>
          <div className="flex items-center" style={{ gap: 8 }}>
            <NavBtn
              label="Previous testimonial"
              onClick={() => goTo(currentIndex - 1)}
            >
              ←
            </NavBtn>
            <NavBtn
              label="Next testimonial"
              onClick={() => goTo(currentIndex + 1)}
            >
              →
            </NavBtn>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="mb-16 text-center">
      <FadeUp>
        <span
          className="inline-flex items-center font-sans font-bold uppercase"
          style={{
            gap: 8,
            padding: "6px 14px",
            background: "rgba(219, 38, 38, 0.08)",
            border: "1px solid rgba(219, 38, 38, 0.15)",
            borderRadius: 100,
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "var(--red)",
          }}
        >
          <span
            aria-hidden
            className="inline-block rounded-full"
            style={{
              width: 5,
              height: 5,
              background: "var(--red)",
              animation: "pulseDot 1.5s ease-in-out infinite",
            }}
          />
          Real Stories
        </span>
      </FadeUp>
      <FadeUp delay={0.1}>
        <h2
          className="font-sans text-ink"
          style={{
            marginTop: "1rem",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
        >
          Real stories from{" "}
          <em
            style={{
              fontStyle: "italic",
              fontWeight: 700,
              color: "var(--red)",
            }}
          >
            real people
          </em>
        </h2>
      </FadeUp>
    </div>
  );
}

function NavBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center"
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "var(--white)",
        border: "1px solid var(--line)",
        color: "var(--ink)",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--red)";
        e.currentTarget.style.color = "var(--white)";
        e.currentTarget.style.borderColor = "var(--red)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--white)";
        e.currentTarget.style.color = "var(--ink)";
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

function MobileTestimonialsMarquee() {
  return (
    <div className="testimonials-mobile-marquee" aria-label="Testimonials carousel">
      <div className="testimonials-mobile-track">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <article key={`${t.name}-${i}`} className="testimonials-mobile-card" aria-hidden={i >= TESTIMONIALS.length}>
            <div className="testimonials-mobile-image">
              <img
                src={getOptimizedImageUrl(t.image, { width: 400 })}
                alt={t.name}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
            <div className="testimonials-mobile-body">
              <span aria-hidden className="testimonials-mobile-quote-mark">“</span>
              <p className="testimonials-mobile-quote">{t.quote}</p>
              <div className="testimonials-mobile-meta">
                <p className="testimonials-mobile-name">{t.name}</p>
                <p className="testimonials-mobile-sub">Age {t.age} · {t.location} · {t.duration}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
