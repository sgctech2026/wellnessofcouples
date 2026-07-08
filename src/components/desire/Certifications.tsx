import { FadeUp } from "./FadeUp";

const CERTS = [
  { top: "FDA", bottom: "Approved" },
  { top: "GMP", bottom: "Certified" },
  { top: "HALAL", bottom: "Certified" },
  { top: "ISO", bottom: "9001" },
];

export function Certifications() {
  return (
    <section className="bg-cream-2 px-8 py-20 text-center">
      <FadeUp>
        <p className="font-serif text-sm italic text-mute">
         , Manufactured in FDA-approved, GMP-certified facilities ,
        </p>
      </FadeUp>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-12">
        {CERTS.map((c, i) => (
          <FadeUp key={c.top} delay={0.05 + i * 0.08}>
            <div
              className="desire-cert-badge group relative flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full bg-white text-red transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.08] hover:bg-red hover:text-cream"
              style={{ border: "2px solid var(--red)" }}
            >
              <span
                className="font-bold leading-none"
                style={{ fontSize: c.top.length > 3 ? "1rem" : "1.25rem", letterSpacing: "0.05em" }}
              >
                {c.top}
              </span>
              <span
                className="mt-1 italic uppercase opacity-80"
                style={{ fontSize: "0.55rem", letterSpacing: "0.2em" }}
              >
                {c.bottom}
              </span>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
