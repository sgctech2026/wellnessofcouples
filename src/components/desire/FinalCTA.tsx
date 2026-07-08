import { Link } from "@tanstack/react-router";
import { FadeUp } from "./FadeUp";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden px-8 py-28 text-center text-cream"
      style={{ backgroundColor: "var(--red-ink)" }}
    >
      {/* Top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(219, 38, 38, 0.3), transparent 60%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[800px]">
        <FadeUp>
          <h2
            className="font-serif text-cream"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
            }}
          >
            Ready to <span className="italic text-gold-light">reconnect?</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="mx-auto mt-6 max-w-[500px] text-base leading-relaxed text-cream/75">
            Join 3,500+ Filipino couples who rediscovered their spark with DESIRE.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <Link
            to="/products/desire-for-men"
            preload="intent"
            className="desire-shimmer-btn mt-10 inline-flex items-center gap-2 rounded-full bg-red px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white shadow-[0_15px_40px_-15px_rgba(219,38,38,0.65)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Shop Desire <span aria-hidden>→</span>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
