export function GiantLogo() {
  return (
    <section className="overflow-hidden bg-ink px-8 py-12 text-center" aria-hidden>
      <p
        className="font-serif text-red"
        style={{
          fontWeight: 300,
          fontSize: "clamp(60px, 13vw, 180px)",
          lineHeight: 0.9,
          letterSpacing: "0.1em",
        }}
      >
        DESIRE
        <sup
          className="text-cream"
          style={{ fontSize: "0.3em", verticalAlign: "super" }}
        >
          ®
        </sup>
      </p>
    </section>
  );
}
