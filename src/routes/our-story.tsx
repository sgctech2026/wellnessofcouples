import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductNav } from "@/components/desire/ProductNav";
import { PdpMarquee } from "@/components/desire/PdpMarquee";
import { Footer } from "@/components/desire/Footer";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story, DESIRE" },
      {
        name: "description",
        content:
          "We're on a mission to restore the spark between you and the one you love. Read the story behind DESIRE.",
      },
      { property: "og:title", content: "Our Story, DESIRE" },
      {
        property: "og:description",
        content:
          "We're on a mission to restore the spark between you and the one you love.",
      },
    ],
  }),
  component: OurStoryPage,
});

const PHOTO_WHITE_JAR =
  "https://desirephilippines.b-cdn.net/Our%20Story/Her.webp";
const PHOTO_BLACK_JAR =
  "https://desirephilippines.b-cdn.net/Our%20Story/Him.webp";
const PHOTO_TWO_JARS =
  "https://desirephilippines.b-cdn.net/Our%20Story/Couple.webp";
const PHOTO_HANDS =
  "https://desirephilippines.b-cdn.net/Our%20Story/2a2ce068-9f83-4c5e-90ab-ed6d5a0c4ec2.webp";

function OurStoryPage() {
  return (
    <>
      <PdpMarquee />
      <ProductNav />
      <main>
        {/* SECTION 1, CINEMATIC HERO */}
        <section className="story-hero">
          <div className="hero-content">
            <span className="hero-eyebrow">
              <span className="dot" aria-hidden />
              Our Mission
            </span>
            <h1 className="hero-headline">
              We're on a mission to restore <em>the spark</em> between you and
              the one you love.
            </h1>
          </div>
        </section>

        {/* SECTION 2, ORIGIN (text left, white jar right) */}
        <section className="origin-section">
          <div className="origin-wrap">
            <div className="origin-text">
              <span className="origin-eyebrow">
                <span className="dot" aria-hidden />
                It all started with
              </span>
              <h2 className="origin-title">
                A simple wish to bring back <em>real desire.</em>
              </h2>
              <p className="origin-body">
                We did not start Desire to sell gummies. We started it because
                we saw a pattern. Stress. Hormonal imbalance. Distance between
                couples who still loved each other.
              </p>
              <p className="origin-body">
                Modern life drains intimacy. Long work hours. Digital
                distractions. Performance pressure. Over time, the spark fades.
                Not because love disappears. Because energy, confidence, and
                connection slowly weaken.
              </p>
              <p className="origin-body">
                We asked a simple question. What if there was a better way to
                support intimacy daily? So we studied circulation, hormones,
                stress response, and gut health. We looked at time-tested
                botanicals and clinically studied ingredients. We focused on
                balance, not quick fixes. Support, not shortcuts.
              </p>
              <p className="origin-quote">That is how Desire was built.</p>
            </div>
            <div className="origin-image">
              <img src={PHOTO_WHITE_JAR} alt="Desire For Her jar" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* SECTION 3, FORMULA (black jar left, text right) cream */}
        <section className="origin-section cream-bg reverse">
          <div className="origin-wrap">
            <div className="origin-text">
              <span className="origin-eyebrow">
                <span className="dot" aria-hidden />
                Our Story
              </span>
              <h2 className="origin-title">
                Our formula that <em>reignited desire.</em>
              </h2>
              <p className="origin-body">
                We did not rush this. We studied circulation, hormones, stress
                response, and mood. We reviewed research. We tested ingredient
                combinations. We refined dosages. We removed what did not serve
                the formula.
              </p>
              <p className="origin-body">
                What remained was focused and intentional. Not random
                ingredients. Not hype. A structured blend designed to support
                confidence, sensitivity, mood, and connection.
              </p>
              <p className="origin-quote">
                This was not built as a quick fix. It was built as a daily
                ritual.
              </p>
            </div>
            <div className="origin-image">
              <img src={PHOTO_BLACK_JAR} alt="Desire For Him jar" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* SECTION 4, MOVEMENT (text left, two-jar right) cream */}
        <section className="question-section">
          <div className="question-wrap">
            <div>
              <span className="question-eyebrow">
                <span className="dot" aria-hidden />
                The Movement
              </span>
              <h2 className="question-title">
                What started as a question, became <em>a movement.</em>
              </h2>
              <p className="question-body">
                When we first launched Desire, the goal was simple. Help
                couples feel closer again.
              </p>
              <p className="question-body">
                But as more people shared their stories, something shifted.
                They were not only talking about performance. They were talking
                about confidence, mood, connection.
              </p>
              <p className="question-body">
                They asked for more. Support for him. Support for her. A
                formula built for both sides of intimacy.
              </p>
              <p className="origin-quote">So we listened.</p>
            </div>
            <div className="question-images">
              <img src={PHOTO_TWO_JARS} alt="Desire For Him and For Her jars" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* SECTION 5, EXPERT (image left, text + CTA right) */}
        <section className="expert-section">
          <div className="expert-wrap">
            <div className="expert-image">
              <img src={PHOTO_HANDS} alt="Hands holding both Desire jars" loading="lazy" decoding="async" />
              <div className="expert-image-badge">
                <span className="expert-image-badge-text">
                  Lab-tested
                  <br />
                  &amp; Verified
                </span>
              </div>
            </div>
            <div>
              <span className="expert-eyebrow">
                <span className="dot" aria-hidden />
                Developed With
              </span>
              <h2 className="expert-title">
                Developed with <em>expert insight.</em>
              </h2>
              <p className="expert-body">
                Doctors, nutritionists, and wellness consultants reviewed our
                formulas. Manufacturing partners operate in certified
                facilities with strict quality controls. Every batch goes
                through third-party testing for safety, dosage accuracy, and
                purity.
              </p>
              <p className="expert-body">
                We built Desire around research on circulation, hormonal
                balance, stress response, and gut health. Not shortcuts. Not
                extreme claims. Structured formulations designed for daily
                support.
              </p>
              <p className="expert-body">
                Thousands of couples trust it. Health professionals respect
                the standards behind it.
              </p>
              <Link
                to="/products"
                preload="intent"
                className="expert-cta"
              >
                Join Our Community
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6, FINAL CTA */}
        <section className="final-cta-section">
          <div className="final-cta-wrap">
            <div className="final-cta-content">
              <span className="final-cta-eyebrow">
                <span className="dot" aria-hidden />
                You've Read This Far
              </span>
              <h2 className="final-cta-title">
                You've read this far for <em>a reason.</em>
              </h2>
              <p className="final-cta-sub">
                Maybe it's the memory of how things used to feel. Maybe it's
                the hope that they can feel that way again. You can. And it
                starts with one small step.
              </p>
              <Link
                to="/products"
                preload="intent"
                className="final-cta-primary"
              >
                Try Desire Today
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
