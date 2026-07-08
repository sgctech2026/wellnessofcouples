import "@fontsource/montserrat/700.css";
import { Link } from "@tanstack/react-router";
import { FadeUp } from "./FadeUp";

const cards = [
  {
    num: "01",
    headline: (
      <>
        We commit when <em>you commit.</em>
      </>
    ),
    body: (
      <>
        Take DESIRE daily. Follow the guide. Give your body the full 30 days it
        needs.{" "}
        <strong>
          Results don&rsquo;t happen to passive people - they happen to
          consistent ones.
        </strong>
      </>
    ),
  },
  {
    num: "02",
    headline: (
      <>
        Still felt nothing?{" "}
        <a
          href="https://www.facebook.com/DesireGummiesPH"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block italic underline decoration-2 underline-offset-4 transition-opacity hover:opacity-80"
          style={{ color: "#ff5a5f" }}
        >
          Talk to us.
        </a>
      </>
    ),
    body: (
      <>
        If you genuinely showed up - took it daily, stayed consistent - and
        still felt no shift in your mood, energy, or connection with your
        partner, reach out.{" "}
        <strong>We respond within 24 hours. We&rsquo;ll make it right.</strong>
      </>
    ),
  },
];

export function Guarantee() {
  return (
    <section className="desire-guarantee-v2 relative overflow-hidden">
      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-ink"
        style={{
          backgroundImage:
            "url('https://desirephilippines.b-cdn.net/HomePage%20V2/7th%20-%20Our%20Commitment%20Section/25.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Dark overlay for readability */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="relative z-[5] mx-auto max-w-[900px] text-center">
        <FadeUp>
          <span className="desire-guarantee-eyebrow">
            <span className="desire-guarantee-eyebrow-dot" aria-hidden />
            Our Commitment
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2
            className="desire-guarantee-headline"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            We don&rsquo;t offer guarantees.{" "}
            <em>We offer results.</em>
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="desire-guarantee-subtitle">
            DESIRE was built to actually work. Show up for 30 days - and
            we&rsquo;ll show up for you.
          </p>
        </FadeUp>

        <div className="desire-guarantee-cards">
          {cards.map((c, i) => (
            <FadeUp key={c.num} delay={0.3 + i * 0.1}>
              <article className="desire-guarantee-card">
                <span className="desire-guarantee-card-num">{c.num}</span>
                <h3 className="desire-guarantee-card-headline">{c.headline}</h3>
                <p className="desire-guarantee-card-body">{c.body}</p>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5}>
          <div className="flex justify-center">
            <Link to="/products" preload="intent" className="desire-guarantee-cta">
              Try Desire Today <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.6}>
          <div className="desire-guarantee-trust-row">
            <span className="desire-guarantee-trust-item">Committed to Results</span>
            <span className="desire-guarantee-trust-item">Free Shipping</span>
            <span className="desire-guarantee-trust-item">100% Private</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
