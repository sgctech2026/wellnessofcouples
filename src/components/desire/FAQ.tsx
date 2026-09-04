import { useState } from "react";
import { FadeUp } from "./FadeUp";
import { getOptimizedImageUrl } from "@/utils/imageUrl";

const FAQS = [
  {
    number: "01",
    question: "Will this actually work for me?",
    answer:
      "Yes. Unless you're expecting a magic pill that makes you fall in love again overnight, this will work. What it does is <strong>remove the physical and chemical barriers</strong> preventing you from feeling desire. <em>The rest is up to you and your partner.</em>",
  },
  {
    number: "02",
    question: "What if I'm on other medications?",
    answer:
      "It's safe. Our formula is <strong>100% natural, plant-based ingredients</strong>. No synthetic chemicals. No interactions with standard medications. <em>If you're on something unusual, email us and we'll verify it personally.</em>",
  },
  {
    number: "03",
    question: "How long until I feel something?",
    answer:
      "Most people feel a shift within <strong>10–15 days</strong>. Increased energy, better mood, reduced anxiety. The deeper benefits, increased desire, improved performance, better lubrication, typically show up within <strong>4–6 weeks</strong>. <em>By week 6, most couples report a dramatic transformation in their intimacy.</em>",
  },
  {
    number: "04",
    question: "What if we haven't been intimate in months?",
    answer:
      "That's more common than you think, and there's no shame in it. DESIRE isn't a quick fix. It's a <strong>daily wellness ritual</strong> that gently supports your body's natural energy, mood, and comfort over time. <em>Many of our happiest customers started from exactly where you are now.</em>",
  },
  {
    number: "05",
    question: "Isn't this just another supplement?",
    answer:
      "No. Supplements are generic. DESIRE is <strong>specifically engineered for couples who've lost their intimacy</strong>. Every ingredient was chosen for a specific reason: to restore hormonal balance, boost mood, increase energy, and reignite desire. <em>This is a system, not a vitamin.</em>",
  },
  {
    number: "06",
    question: "What about side effects?",
    answer:
      "None that we've documented. It's all natural ingredients. Some people report feeling <strong>more energized</strong> (which is the point). Some report <strong>better sleep</strong> (also the point). <em>If you have a specific health condition, check with your doctor</em>, but for the vast majority of people, this is completely safe.",
  },
  {
    number: "07",
    question: "Do both partners need to take it?",
    answer:
      "It works better when both partners take it, that's why we have <strong>For Her and For Him formulations</strong>. But you can absolutely start solo and bring your partner in later. <em>Many of our customers ordered for themselves first, felt the difference, then ordered for their partner.</em>",
  },
  {
    number: "08",
    question: "How long before I feel a difference?",
    answer:
      "Give it a real shot. <strong>Take DESIRE daily for a full 30 days</strong> and follow the guide. Most couples start noticing small shifts, more energy, closeness, and drive, within the first few weeks. It was built to actually work when you show up for it consistently.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <FadeUp>
            <span className="faq-eyebrow">
              <span className="faq-eyebrow-dot" aria-hidden />
              DESIRE FAQs
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="faq-headline faq-headline-with-icons">
              <img
                src={getOptimizedImageUrl("https://desirephilippines.b-cdn.net/HomePage%20V2/8th%20-%20Desire%20FAQS%20Section/26.webp", { width: 200 })}
                alt=""
                aria-hidden
                className="faq-headline-icon faq-headline-icon-left"
                loading="lazy"
                decoding="async"
                width={200}
                height={200}
              />
              <span>Things people <em>often ask</em></span>
              <img
                src={getOptimizedImageUrl("https://desirephilippines.b-cdn.net/HomePage%20V2/8th%20-%20Desire%20FAQS%20Section/27.webp", { width: 200 })}
                alt=""
                aria-hidden
                className="faq-headline-icon faq-headline-icon-right"
                loading="lazy"
                decoding="async"
                width={200}
                height={200}
              />
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="faq-subtitle">
              Real questions from real customers. No marketing fluff, just honest answers.
            </p>
          </FadeUp>
        </div>

        {/* Accordion */}
        <div className="faq-list">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <FadeUp key={faq.number} delay={idx * 0.05}>
                <div className={`faq-item${isOpen ? " open" : ""}`}>
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => handleToggle(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${idx}`}
                  >
                    <span className="faq-number">{faq.number}</span>
                    <span className="faq-question">{faq.question}</span>
                    <span className="faq-icon" aria-hidden>
                      +
                    </span>
                  </button>
                  <div
                    id={`faq-content-${idx}`}
                    role="region"
                    className="faq-content"
                  >
                    <div
                      className="faq-body"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
