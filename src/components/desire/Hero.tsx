import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FadeUp } from "./FadeUp";
import { getOptimizedImageUrl } from "@/utils/imageUrl";
const newBottleDesignBadge = "https://desirephilippines.b-cdn.net/HomePage%20V2/Hero%20Section/new-bottle-design-9imb28-g.webp";

const desireBottleHim = "https://desirephilippines.b-cdn.net/HomePage%20V2/Hero%20Section/26.webp";
const desireBottle = "https://desirephilippines.b-cdn.net/HomePage%20V2/Hero%20Section/27.webp";
const heroVideo = "https://desirephilippines.b-cdn.net/HomePage%20V2/Hero%20Section/Background%20For%20Main%20Page%20(Looping)%20(2).mp4";

const EASE = [0.16, 1, 0.3, 1] as const;

function Bottle({
  variant,
  delay = 0,
}: {
  variant: "him" | "her";
  delay?: number;
}) {
  const isHim = variant === "him";
  const src = isHim ? desireBottleHim : desireBottle;

  return (
    <div
      className="desire-bottle-float relative flex items-center justify-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="hero-bottle-shine">
        <img
          src={getOptimizedImageUrl(src, { width: 400 })}
          alt={`DESIRE Mood Enhancer ${isHim ? "For Him" : "For Her"}`}
          className="h-auto w-[200px] md:w-[240px] xl:w-[270px]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={270}
          height={540}
          style={{
            filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.45))",
          }}
        />
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 400]);
  // Mobile bottles slide out as user scrolls down, slide back on scroll up
  const mobileBottleLeftX = useTransform(scrollY, [0, 500], ["0%", "-130%"]);
  const mobileBottleRightX = useTransform(scrollY, [0, 500], ["0%", "130%"]);
  const [videoReady, setVideoReady] = useState(false);

  // Delay video load until after page is interactive
  useEffect(() => {
    const timer = setTimeout(() => setVideoReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={ref}
      data-hero-section
      className="relative flex min-h-[82vh] items-center overflow-hidden px-5 pt-20 pb-16 md:px-12 md:pt-24 md:pb-20"
      style={{ backgroundColor: "#f5efe4" }}
    >
      {/* BG video with parallax - delayed load */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ y: bgY }}
      >
        {videoReady && (
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
            style={{ animation: "fadeIn 0.5s ease-out" }}
            ref={(el) => {
              if (el) el.playbackRate = 1.0;
            }}
          />
        )}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT */}
        <div className="hero-text-overlay flex flex-col pt-20 md:pt-0 lg:pl-24 xl:pl-36">
          <h1 className="hero-headline">
            <span className="line-1">Feel That</span>
            <span className="line-2"><em>Spark</em> Again.</span>
          </h1>

          <FadeUp delay={1.0} immediate>
            <div className="hero-sub-block">
              <span aria-hidden className="hero-sub-divider" />
              <p className="hero-sub">
                A natural wellness blend for couples who want to feel{" "}
                <em>more alive, together.</em>
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={1.2} immediate>
            <div className="hero-action-row">
              <Link to="/products/desire-for-men" preload="intent" className="hero-cta">
                <span className="hero-cta-text">Shop Now</span>
              </Link>

              <div className="hero-reviews">
                <div className="hero-reviews-stars">
                  <span className="tp-label">Great</span>
                  <div className="tp-stars" aria-hidden>
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="tp-star tp-star--full">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.5l7.1-.6L12 2z"/></svg>
                      </span>
                    ))}
                    <span className="tp-star tp-star--half">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.5l7.1-.6L12 2z"/></svg>
                    </span>
                  </div>
                  <span className="num">4.8</span>
                </div>
                <span className="hero-reviews-count">
                  Based on 16,255 verified reviews
                </span>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* RIGHT, Bottles (desktop) */}
        <div className="relative hidden h-[500px] flex-col items-center justify-center gap-6 lg:flex lg:-translate-x-12 xl:-translate-x-16">
          <div className="group/bottles flex items-center gap-7">
            <div className="transition-transform duration-500 ease-out group-hover/bottles:scale-95 hover:!scale-110">
              <Bottle variant="him" delay={0} />
            </div>
            <div className="transition-transform duration-500 ease-out group-hover/bottles:scale-95 hover:!scale-110">
              <Bottle variant="her" delay={0.5} />
            </div>
          </div>
          <img
            src={newBottleDesignBadge}
            alt="New Bottle Design"
            className="h-auto w-[280px] md:w-[320px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Mobile bottles, slide in from sides on load + scroll-driven slide-out */}
      <div className="hero-mobile-bottles lg:hidden" aria-hidden>
        <motion.div className="hero-mobile-bottle-wrap hero-mobile-bottle-wrap--left" style={{ x: mobileBottleLeftX }}>
          <img
            src={getOptimizedImageUrl(desireBottleHim, { width: 320 })}
            alt=""
            className="hero-mobile-bottle hero-mobile-bottle--left"
            loading="eager"
            decoding="async"
          />
        </motion.div>
        <motion.div className="hero-mobile-bottle-wrap hero-mobile-bottle-wrap--right" style={{ x: mobileBottleRightX }}>
          <img
            src={getOptimizedImageUrl(desireBottle, { width: 320 })}
            alt=""
            className="hero-mobile-bottle hero-mobile-bottle--right"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </div>


    </section>
  );
}
