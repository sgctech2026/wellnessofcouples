const MARQUEE_ITEMS = [
  "★ YOU TAKE THE 30-DAY CHALLENGE",
  "★ AND IN 2 WEEKS, YOU FEEL THE SPARK COMING BACK",
];

export function PdpMarquee() {
  return (
    <div className="pdp-marquee" role="region" aria-label="Promotion">
      <div className="pdp-marquee-track">
        {[0, 1, 2].map((rep) => (
          <div key={rep} className="pdp-marquee-group">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={`${rep}-${i}`} className="pdp-marquee-item">{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
