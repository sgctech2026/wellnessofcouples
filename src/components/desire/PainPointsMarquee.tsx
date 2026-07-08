import { FadeUp } from "./FadeUp";
import { useIsMobile } from "@/hooks/use-mobile";

const PAIN_POINTS_IMAGE =
  "https://desirephilippines.b-cdn.net/HomePage%20V2/3rd%20-%20Real%20Pain%20Points/5.webp";
const PAIN_POINTS_IMAGE_MOBILE =
  "https://desirephilippines.b-cdn.net/HomePage%20V2/3rd%20-%20Real%20Pain%20Points/6.webp";

export function PainPointsMarquee() {
  const isMobile = useIsMobile();
  return (
    <>
      <div className="pain-curved-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,0 L0,40 Q720,120 1440,40 L1440,0 L1440,80 L0,80 Z"
            fill="#000000"
          />
        </svg>
      </div>

      <section className="pain-dark-section">
        <div className="pain-dark-header">
          <FadeUp>
            <div className="pain-eyebrow-pill">
              <span className="pain-eyebrow-dot" />
              Real Pain Points
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="pain-dark-headline">
              Created for the people who experience{" "}
              <span className="pain-headline-italic">this</span>
            </h2>
          </FadeUp>
        </div>

        <div className="pain-pill-grid">
          <FadeUp>
            <div className="pain-points-image-wrap">
              <img
                src={isMobile ? PAIN_POINTS_IMAGE_MOBILE : PAIN_POINTS_IMAGE}
                alt="Real pain points: bedroom confidence, dryness, difficulty achieving climax, lost desires, menopausal symptoms, stress & anxiety, not in the mood, and stamina"
                className="pain-points-image"
                loading="lazy"
              />
            </div>
          </FadeUp>
        </div>

        <div className="pain-stat-split">
          <FadeUp className="pain-stat-split-left">
            <p className="pain-stat-split-number">
              3,500<span className="plus">+</span>
            </p>
            <p className="pain-stat-split-sublabel">Couples</p>
          </FadeUp>
          <div className="pain-stat-split-right">
            <FadeUp delay={0.1}>
              <p className="pain-stat-split-eyebrow">, And Growing</p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h3 className="pain-stat-split-headline">
                Have <em>rebuilt their love life</em>
              </h3>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p className="pain-stat-split-body">
                Trust. Intimacy. Passion. <strong>It&rsquo;s not gone.</strong> It just needs the right support, and you&rsquo;re not alone in this journey.
              </p>
            </FadeUp>
          </div>
        </div>

        <div className="pain-dark-curve" aria-hidden="true" />
      </section>
    </>
  );
}
