import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FadeUp } from "./FadeUp";

function useCenterActive<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const mq = window.matchMedia("(max-width: 640px)");
    if (!mq.matches) return;
    const check = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const cardCenter = rect.top + rect.height / 2;
      setActive(Math.abs(cardCenter - vh / 2) < vh * 0.25);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return { ref, active };
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setCount(Math.floor(value)),
      onComplete: () => setCount(target),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return <span ref={ref}>{count}</span>;
}

const STATS = [
  {
    num: "92",
    label: "Increased Drive",
    desc: "noticeable boost in drive and desire within 14 days",
  },
  {
    num: "87",
    label: "Deeper Emotions",
    desc: "stronger emotional and physical connection with their partner",
  },
  {
    num: "79",
    label: "Better Sleep",
    desc: "reported waking up refreshed and feeling younger than ever",
  },
  {
    num: "74",
    label: "Better Mood",
    desc: "improved mood during late-night talks with their partner",
  },
];

type Stat = (typeof STATS)[number];

function StatCell({ stat, index, isLast }: { stat: Stat; index: number; isLast: boolean }) {
  const { ref, active } = useCenterActive<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`desire-stat-cell${active ? " is-active" : ""}`}
      style={{
        padding: "2.5rem 1.5rem",
        textAlign: "center",
        borderRight: !isLast ? "1px solid var(--line)" : "none",
        position: "relative",
        transition: "all 0.3s",
        animation: `fadeUp 0.6s ${0.6 + index * 0.1}s both`,
      }}
      data-cell-index={index}
    >
      <div
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(3rem, 5vw, 4.5rem)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "var(--ink)",
          marginBottom: "0.5rem",
          display: "inline-block",
        }}
      >
        <CountUp target={Number(stat.num)} />
        <span
          style={{
            color: "var(--red)",
            fontSize: "0.55em",
            verticalAlign: "top",
            marginLeft: "0.05em",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          %
        </span>
      </div>
      <div
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 14,
          color: "var(--red)",
          marginBottom: "0.75rem",
          letterSpacing: "0.02em",
        }}
      >
        {stat.label}
      </div>
      <p
        className="mx-auto"
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.6,
          color: "var(--mute)",
          maxWidth: 200,
        }}
      >
        {stat.desc}
      </p>
    </div>
  );
}

export function StatsGrid() {
  return (
    <section
      className="relative overflow-hidden bg-white stats-section"
    >
      {/* Atmospheric overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 300px at 50% 0%, rgba(219,38,38,0.04), transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto" style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div className="text-center pt-20 md:pt-0" style={{ marginBottom: "4rem" }}>
          <FadeUp>
            <span
              className="inline-flex items-center uppercase"
              style={{
                gap: 8,
                padding: "6px 14px",
                background: "rgba(219,38,38,0.08)",
                border: "1px solid rgba(219,38,38,0.15)",
                borderRadius: 100,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "var(--red)",
                marginBottom: "1.5rem",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--red)",
                  display: "inline-block",
                  animation: "pulseDot 1.5s infinite",
                }}
              />
              Third-Party Verified
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2
              className="mx-auto"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "var(--ink)",
                maxWidth: 800,
                marginBottom: "1rem",
              }}
            >
              Backed by{" "}
              <span style={{ fontStyle: "italic", fontWeight: 700, color: "var(--red)" }}>
                Science.
              </span>{" "}
              Approved by{" "}
              <span style={{ fontStyle: "italic", fontWeight: 700, color: "var(--red)" }}>
                Experts.
              </span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p
              className="mx-auto"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: 17,
                lineHeight: 1.7,
                color: "var(--ink)",
                maxWidth: 640,
              }}
            >
              Every batch of DESIRE is lab-tested by independent evaluators so you
              know exactly what&rsquo;s going into your body, and what results to expect.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--red-deep, #b91c1c)",
                marginTop: "1rem",
              }}
            >
              &ldquo;We don&rsquo;t guess. We verify.&rdquo;
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div style={{ marginTop: "2rem" }}>
              <Link
                to="/our-science"
                preload="intent"
                className="desire-stats-cta desire-stats-cta-pulse inline-flex items-center uppercase"
                style={{
                  gap: 10,
                  padding: "14px 32px",
                  background:
                    "linear-gradient(135deg, var(--red), var(--red-deep))",
                  color: "var(--white)",
                  borderRadius: 100,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textDecoration: "none",
                  boxShadow: "0 12px 30px rgba(219,38,38,0.3)",
                  transition: "all 0.3s",
                }}
              >
                View Third-Party Results <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* Stats grid */}
        <FadeUp delay={0.5}>
          <div
            className="desire-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
              marginTop: "4rem",
            }}
          >
            {STATS.map((s, i) => (
              <StatCell key={s.label} stat={s} index={i} isLast={i === STATS.length - 1} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
