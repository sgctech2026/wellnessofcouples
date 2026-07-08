import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp } from "./FadeUp";
import { getOptimizedImageUrl } from "@/utils/imageUrl";

type Ingredient = {
  number: string;
  amount: string;
  name: string;
  nameItalic?: string;
  desc: string;
  image?: string;
};

const INGREDIENTS: { women: Ingredient[]; men: Ingredient[] } = {
  women: [
    { number: "01", amount: "300mg per serving", name: "Ashwagandha", desc: "Supports stress control, mood balance, and hormonal wellness. Helps regulate cortisol, promoting calmer energy and emotional stability.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Women/12%20(1).webp" },
    { number: "02", amount: "300mg per serving", name: "Red Maca Root", desc: "Supports libido, stamina, and natural hormonal balance. Promotes sustained energy without overstimulation.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Women/13%20(1).webp" },
    { number: "03", amount: "200mg per serving", name: "Dong Quai", desc: "Supports menstrual balance, circulation, and reproductive wellness.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Women/14%20(1).webp" },
    { number: "04", amount: "150mg per serving", name: "Chaste Berry", desc: "Supports hormonal regulation and cycle stability.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Women/15%20(1).webp" },
    { number: "05", amount: "5mg per serving", name: "Zinc", desc: "Supports immune function and healthy hormone production.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Women/22%20(1).webp" },
    { number: "06", amount: "1 Billion CFU", name: "Lactobacillus rhamnosus", desc: "Supports gut balance, immune function, and nutrient absorption.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Women/21%20(1).webp" },
  ],
  men: [
    { number: "01", amount: "250mg per serving", name: "Tongkat Ali Extract", desc: "Boosts testosterone naturally. Supports energy, stamina, and male performance, without overstimulation.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Men/18.webp" },
    { number: "02", amount: "300mg per serving", name: "Maca Root Extract", desc: "Enhances stamina, libido, and overall vitality. A time-tested adaptogen for sustained drive.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Men/19.webp" },
    { number: "03", amount: "200mg per serving", name: "Panax Ginseng Extract", desc: "Improves circulation, mental focus, and sexual performance. Supports cardiovascular health.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Men/20.webp" },
    { number: "04", amount: "300mg per serving", name: "Lactobacillus rhamnosus", desc: "Naturally supports testosterone production, muscle strength, and confidence.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Men/17.webp" },
    { number: "05", amount: "5mg per serving", name: "Zinc", desc: "Critical for testosterone production, immune function, and male reproductive health.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Men/22.webp" },
    { number: "06", amount: "400mg per serving", name: "L-Arginine", desc: "Supports nitric oxide production for healthy blood flow, circulation, and performance.", image: "https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/For%20Men/23.webp" },
  ],
};

const TRUST_BADGES = ["FDA", "GMP", "HALAL", "ISO 9001"];

function TimelineItem({ idx, ing, isAlt }: { idx: number; ing: Ingredient; isAlt: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
      className={`science-ti ${isAlt ? "alt" : ""}`}
    >
      <div className="ti-content">
        <span className="ti-amount">{ing.amount}</span>
        <h3 className="ti-name">{ing.name}</h3>
        <p className="ti-desc">{ing.desc}</p>
      </div>

      <div className="ti-node" aria-hidden>
        {ing.number}
      </div>

      <div className="ti-img">
        {ing.image ? (
          <img src={getOptimizedImageUrl(ing.image, { width: 400 })} alt={ing.name} loading="lazy" decoding="async" width={400} height={400} />
        ) : (
          <div className="ti-img-placeholder" aria-hidden>
            <span className="ti-img-letter">{ing.name.charAt(0)}</span>
          </div>
        )}
        <div className="ti-img-glow" aria-hidden />
      </div>
    </motion.div>
  );
}

export function Ingredients() {
  const [isMen, setIsMen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (men: boolean) => {
    if (men === isMen || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsMen(men);
      setIsAnimating(false);
    }, 300);
  };

  const current = isMen ? INGREDIENTS.men : INGREDIENTS.women;

  return (
    <>
      <div className="science-glow-divider" aria-hidden />
      <section className="science-section">
        <div className="science-bg" aria-hidden />
        <div className="science-inner">
          <div className="science-header">
            <FadeUp>
              <span className="science-eyebrow">
                <span className="science-eyebrow-dot" aria-hidden />
                The Science Behind
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="science-headline">
                Six ingredients. <span className="science-italic-red">One purpose.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="science-sub">
                Each one carefully chosen, dosed, and tested for one purpose, to bring back the spark.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="science-toggle" role="tablist" aria-label="Choose formula">
                <span
                  className="science-toggle-pill"
                  aria-hidden
                  style={{ transform: isMen ? "translateX(0)" : "translateX(100%)" }}
                />
                <button
                  type="button"
                  role="tab"
                  aria-selected={isMen}
                  className={`science-toggle-btn ${isMen ? "active" : ""}`}
                  onClick={() => handleToggle(true)}
                >
                  For Him
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isMen}
                  className={`science-toggle-btn ${!isMen ? "active" : ""}`}
                  onClick={() => handleToggle(false)}
                >
                  For Her
                </button>
              </div>
            </FadeUp>
          </div>

          <div className="science-timeline">
            <div className="science-center-line" aria-hidden />
            <div
              className="science-timeline-inner"
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? "translateY(10px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
              key={isMen ? "men" : "women"}
            >
              {current.map((ing, i) => (
                <TimelineItem key={`${isMen ? "m" : "w"}-${ing.number}`} idx={i} ing={ing} isAlt={i % 2 === 1} />
              ))}
            </div>
          </div>

          <div className="science-trust">
            <FadeUp>
              <p className="science-trust-tag">Every Ingredient Chosen For A Reason</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="science-trust-quote">
                Science based. <em>Verified.</em> Approved.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="science-trust-badges-img">
                <img
                  src={getOptimizedImageUrl("https://desirephilippines.b-cdn.net/HomePage%20V2/6th%20-%20The%20Science%20Behind/24.webp", { width: 800 })}
                  alt="FDA, GMP, HALAL, ISO 9001 certifications"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={200}
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p className="science-trust-meta">
                Manufactured in Compliant &amp; Approved Facilities Abroad
              </p>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
