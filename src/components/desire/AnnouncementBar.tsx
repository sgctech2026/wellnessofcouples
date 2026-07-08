import { useEffect, useState } from "react";

const ITEMS = [
  "FREE SHIPPING ON ORDERS ₱2,000+",
  "30-DAY MONEY BACK GUARANTEE",
  "FDA APPROVED · GMP CERTIFIED",
  "JOIN 3,500+ COUPLES",
];

function MarqueeRow() {
  return (
    <span className="inline-flex items-center">
      {ITEMS.map((item) => (
        <span key={item} className="inline-flex items-center">
          <span className="px-6">{item}</span>
          <span className="text-red" aria-hidden>✦</span>
        </span>
      ))}
    </span>
  );
}

export function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 overflow-hidden py-2 text-white transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      style={{
        background: "linear-gradient(90deg, #7a0a0a 0%, #c41e1e 50%, #7a0a0a 100%)",
      }}
      role="region"
      aria-label="Site announcements"
    >
      <div className="text-center text-[11px] font-medium tracking-[0.18em] uppercase px-4">
        REIGNITE WHAT TIME TRIED TO TAKE. FEEL LIKE YOURSELF AGAIN.
      </div>
    </div>
  );
}
