import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductNav } from "@/components/desire/ProductNav";
import { PdpMarquee } from "@/components/desire/PdpMarquee";
import { Footer } from "@/components/desire/Footer";
const labImage = "https://desirephilippines.b-cdn.net/Our%20Science/Doctor.webp";

export const Route = createFileRoute("/our-science")({
  head: () => ({
    meta: [
      { title: "Our Science, Third-Party Testing Results | DESIRE" },
      {
        name: "description",
        content:
          "At DESIRE, trust starts with proof. See our third-party testing results, certifications, and quality standards.",
      },
      { property: "og:title", content: "Our Science, DESIRE" },
      {
        property: "og:description",
        content:
          "Third-party tested for purity, potency, and safety. Verified certifications and lab reports.",
      },
    ],
  }),
  component: OurSciencePage,
});

const testItems = [
  {
    id: 1,
    name: "Dosage accuracy",
    desc: "Confirms active ingredients match the label, including key botanicals, vitamins, minerals, and functional nutrients.",
  },
  {
    id: 2,
    name: "Purity and safety",
    desc: "Screens for heavy metals such as lead, arsenic, cadmium, mercury. Checks for unwanted contaminants and compliance with safety limits.",
  },
  {
    id: 3,
    name: "Microbiology",
    desc: "Tests for microbial risks such as E. coli, Salmonella, yeast, and mold to support product safety.",
  },
  {
    id: 4,
    name: "Allergens and cross-contact",
    desc: "Verifies allergen control for common triggers such as gluten, soy, dairy, and nuts based on manufacturing standards and testing scope.",
  },
  {
    id: 5,
    name: "Probiotic potency",
    desc: "Validates the presence and viable count of probiotics such as Lactobacillus rhamnosus across shelf life targets.",
  },
  {
    id: 6,
    name: "Nutritional Content",
    desc: "Confirms nutrition facts where applicable, including sugar content and sweetener compliance for a stevia-sweetened formula.",
  },
  {
    id: 7,
    name: "Stability and shelf-life checks",
    desc: "Assesses how the formula holds up over time, so what's on the label stays consistent through the product's intended shelf life.",
  },
];

const certGroups = [
  {
    id: 2,
    title: "Batch Testing Form Dosage",
    description:
      "Designed to support your long-term health and vitality, Daily Ultimate Longevity is crafted with carefully selected ingredients that are clinically studied for their effectiveness. To ensure this premium product meets our high standards, every batch undergoes thorough third-party testing." as string | null,
    docs: [
      { name: "Desire Mood Enhancer Vitaquest", meta: "PDF · Batch test report", url: "https://desirephilippines.b-cdn.net/Our%20Science/Vitaquest.pdf" },
      { name: "Desire Mood Enhancer Eurofins", meta: "PDF · Batch test report", url: "https://desirephilippines.b-cdn.net/Our%20Science/Eurofins.pdf" },
    ],
  },
  {
    id: 3,
    title: "Daily Ultimate Longevity Certification",
    description: null,
    docs: [
      { name: "JW International, Desire Female Enhancer", meta: "PNG · Verified report", url: "https://desirephilippines.b-cdn.net/Our%20Science/JW%20Woman.png" },
      { name: "JW International, Desire Male Enhancer", meta: "PNG · Verified report", url: "https://desirephilippines.b-cdn.net/Our%20Science/JW%20Man.png" },
    ],
  },
  {
    id: 4,
    title: "FDA Certification",
    description: null,
    docs: [
      { name: "Desire Mood Enhancer FDA_LTO", meta: "JPG · FDA License to Operate", url: "https://desirephilippines.b-cdn.net/Our%20Science/FDA%20LTO.jpg" },
      { name: "Desire Mood Enhancer FDA_CPR", meta: "JPG · FDA Certificate of Product Registration", url: "https://desirephilippines.b-cdn.net/Our%20Science/FDA%20CPR.jpg" },
    ],
  },
];

const trustBadges = [
  { title: "FDA Registered", desc: "Manufactured in FDA-approved facilities with strict quality controls." },
  { title: "NSF Certified", desc: "Independently verified for purity and label accuracy." },
  { title: "Third-Party Tested", desc: "Every batch undergoes lab testing by independent labs." },
  { title: "Plant-Based Actives", desc: "Time-tested botanicals and clinically studied ingredients." },
];

function OurSciencePage() {
  return (
    <div className="our-science-page">
      <PdpMarquee />
      <ProductNav />

      {/* SECTION 1, HERO */}
      <section className="science-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">
            <span className="dot" aria-hidden />
            Our Science
          </span>
          <h1 className="hero-headline">
            Third-Party <em>Testing Results.</em>
          </h1>
          <p className="hero-sub">
            At DESIRE, trust starts with proof. See how we hold the line on premium quality and clean standards.
          </p>
        </div>
      </section>

      {/* SECTION 2, WHY MATTERS */}
      <section className="why-section">
        <div className="why-wrap">
          <div>
            <span className="why-eyebrow">
              <span className="dot" aria-hidden />
              Why It Matters
            </span>
            <h2 className="why-title">
              Why <em>third-party testing</em> matters.
            </h2>
            <p className="why-intro">
              At DESIRE, trust starts with proof. We run third-party testing to confirm <strong>quality, safety, and label accuracy</strong> for every batch, so you feel confident with what you take daily.
            </p>

            <div className="why-list-label">Here's what we test for</div>
            <ul className="test-list">
              {testItems.map((item) => (
                <li className="test-item" key={item.id}>
                  <span className="test-item-icon" aria-hidden>✓</span>
                  <div className="test-item-content">
                    <div className="test-item-name">{item.name}</div>
                    <div className="test-item-desc">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="why-quote">
              Our goal is simple: to give you confidence in every serving.
            </p>
          </div>

          <div className="why-image">
            <span className="why-image-badge">Lab-Tested</span>
            <img src={labImage} alt="Third-party laboratory testing" loading="lazy" width={1024} height={1024} />
          </div>
        </div>
      </section>

      {/* SECTION 3, CERTIFICATIONS (DARK) */}
      <section className="certs-section">
        <div className="certs-header">
          <span className="certs-eyebrow">
            <span className="dot" aria-hidden />
            Verified Documents
          </span>
          <h2 className="certs-title">
            Desire <em>third-party</em> certifications.
          </h2>
          <p className="certs-sub">
            All certifications are publicly available. Download and verify each report directly.
          </p>
        </div>

        <div className="certs-wrap">
          {certGroups.map((group, idx) => (
            <div className="cert-group" key={group.id}>
              <div className="cert-group-header">
                <span className="cert-group-num">{String(idx + 1).padStart(2, "0")}</span>
                <h3 className="cert-group-title" dangerouslySetInnerHTML={{ __html: group.title }} />
                <span className="cert-group-count">{group.docs.length} Documents</span>
              </div>
              {group.description && (
                <p className="cert-group-desc">{group.description}</p>
              )}
              <div className="cert-cards">
                {group.docs.map((doc) => (
                  <div className="cert-card" key={doc.name}>
                    <span className="cert-card-icon" aria-hidden>📄</span>
                    <div className="cert-card-content">
                      <div className="cert-card-name">{doc.name}</div>
                      <div className="cert-card-meta">{doc.meta}</div>
                    </div>
                    <a
                      className="cert-card-btn"
                      href={`/api/download?url=${encodeURIComponent(doc.url)}&filename=${encodeURIComponent(doc.name + (doc.url.match(/\.[a-zA-Z0-9]+(?:\?|$)/)?.[0]?.replace(/\?.*/, "") || ""))}`}
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4, TRUST BADGES */}
      <section className="trust-section">
        <div className="trust-wrap">
          <div className="trust-header">
            <span className="trust-eyebrow">
              <span className="dot" aria-hidden />
              Why Trust Desire
            </span>
            <h2 className="trust-title">
              Held to <em>premium</em> standards.
            </h2>
            <p className="trust-sub">
              Every step from raw ingredients to finished gummy is tested, verified, and documented.
            </p>
          </div>

          <div className="trust-grid">
            {trustBadges.map((badge) => (
              <div className="trust-card" key={badge.title}>
                <div className="trust-card-icon" aria-hidden>✓</div>
                <div className="trust-card-title">{badge.title}</div>
                <div className="trust-card-desc">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5, FINAL CTA */}
      <section className="final-cta-section">
        <div className="final-cta-wrap">
          <div className="final-cta-content">
            <span className="final-cta-eyebrow">
              <span className="dot" aria-hidden />
              You've Read This Far
            </span>
            <h2 className="final-cta-title">
              You've read this far <em>for a reason.</em>
            </h2>
            <p className="final-cta-sub">
              Maybe it's the memory of how things used to feel. Maybe it's the hope that they can feel that way again. You can. And it starts with one small step.
            </p>
            <Link to="/products" preload="intent" className="final-cta-primary">
              Try Desire Today
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
