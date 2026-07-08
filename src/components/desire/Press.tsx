import { FadeUp } from "./FadeUp";

const PUBS: { name: string; src: string; height: number; href?: string }[] = [
  {
    name: "Cosmopolitan",
    src: "https://desirephilippines.b-cdn.net/HomePage%20V2/4th%20-%20Third%20Party%20Verified/7.webp",
    height: 24,
    href: "https://www.cosmopolitan.com/",
  },
  {
    name: "FHM",
    src: "https://desirephilippines.b-cdn.net/HomePage%20V2/4th%20-%20Third%20Party%20Verified/8.webp",
    height: 34,
    href: "https://fhm.com/",
  },
  {
    name: "Metro.Style",
    src: "https://desirephilippines.b-cdn.net/HomePage%20V2/4th%20-%20Third%20Party%20Verified/9.webp",
    height: 28,
    href: "https://metro.style/",
  },
  {
    name: "Mega",
    src: "https://desirephilippines.b-cdn.net/HomePage%20V2/4th%20-%20Third%20Party%20Verified/10.webp",
    height: 30,
    href: "https://mega-asia.com/",
  },
  {
    name: "Outrage",
    src: "https://desirephilippines.b-cdn.net/HomePage%20V2/4th%20-%20Third%20Party%20Verified/11.webp",
    height: 24,
    href: "https://outragemag.com/",
  },
  {
    name: "Men's Health",
    src: "https://desirephilippines.b-cdn.net/HomePage%20V2/4th%20-%20Third%20Party%20Verified/12.webp",
    height: 28,
    href: "https://www.menshealth.com/",
  },

];

export function Press() {
  return (
    <section className="relative z-20 -mb-16 bg-white px-4 pt-4 md:-mb-24 md:px-8 md:pt-8">
      <div
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 overflow-hidden rounded-2xl border px-6 py-5 md:px-12 md:py-6"
        style={{
          background: "#0a0a0a",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow:
            "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url('https://desirephilippines.b-cdn.net/HomePage/bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.8,
          }}
        />
        <div className="relative z-10 flex w-full flex-col items-center gap-4">
        <FadeUp y={20}>
          <h3
            className="text-center font-sans font-bold"
            style={{
              color: "#ffffff",
              fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            Ingredients are Featured in
          </h3>
        </FadeUp>

        <FadeUp y={30} delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {PUBS.map((p, i) => {
              const img = (
                <img
                  src={p.src}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    height: p.height,
                    width: "auto",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                    opacity: 0.85,
                  }}
                  className="transition-opacity duration-300 hover:opacity-100"
                />
              );
              return (
                <span
                  key={p.name}
                  className="press-logo-shine"
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  {p.href ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.name}
                    >
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </span>
              );
            })}
          </div>
        </FadeUp>
        </div>
      </div>
    </section>
  );
}
