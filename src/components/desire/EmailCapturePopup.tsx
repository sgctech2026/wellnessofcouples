import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { setLeadEmail } from "@/lib/cartStore";

// ── Config (tweak freely) ─────────────────────────────────────────
const SHOW_AFTER_MS = 12000; // delay before the popup appears
const SEEN_KEY = "desire_emailpopup_seen"; // localStorage flag, shows once
const SHOP_PATH = "/products"; // where to send them after signup

// Full-bleed promo backgrounds — landscape for desktop, portrait for mobile.
// Set as CSS custom properties so a media query can swap them.
const POPUP_BG_DESKTOP =
  "https://desirephilippines.b-cdn.net/HomePage%20V2/Hero%20Section/Promo%20Background%20Desktop.webp";
const POPUP_BG_MOBILE =
  "https://desirephilippines.b-cdn.net/HomePage%20V2/Hero%20Section/Promo%20Background%20%20Mobile.webp";

// Same public Email Router endpoint used at checkout.
const EMAIL_ROUTER =
  "https://zaigkluzridnzefclser.supabase.co/functions/v1/subscribe?brand=desire-philippines";

export function EmailCapturePopup() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Show once, a few seconds after the visitor lands.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(SEEN_KEY) === "1") return;
    const t = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const markSeen = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const dismiss = () => {
    markSeen();
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    markSeen();

    // Remember the email so every later cart change is attributed to them.
    setLeadEmail(email.trim());

    // Fire-and-forget into the Email Router — never block the redirect.
    fetch(EMAIL_ROUTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => {});

    // Off to the shop, offer applied.
    setOpen(false);
    navigate({ to: SHOP_PATH });
  };

  if (!open) return null;

  return (
    <div
      className="ecp-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Special offer"
      onClick={dismiss}
    >
      <div
        className="ecp-card"
        style={
          {
            "--ecp-bg-desktop": `url("${POPUP_BG_DESKTOP}")`,
            "--ecp-bg-mobile": `url("${POPUP_BG_MOBILE}")`,
          } as React.CSSProperties
        }
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="ecp-close"
          onClick={dismiss}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Offer + form overlaid on the right side of the background */}
        <div className="ecp-body">
          <div className="ecp-brand">DESIRE</div>

          <h2 className="ecp-headline">
            You've Got <em>Free Shipping</em>
            <span className="ecp-headline-sub">on your first order</span>
          </h2>

          <ul className="ecp-perks">
            <li>✓ Free shipping</li>
            <li>✓ Track your order anytime</li>
            <li>✓ Exclusive offers, straight to your inbox</li>
          </ul>

          <p className="ecp-copy">
            Drop your email to unlock free shipping and reignite the spark.
          </p>

          <form className="ecp-form" onSubmit={handleSubmit}>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className="ecp-input"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              aria-label="Email address"
              autoFocus
            />
            <button type="submit" className="ecp-submit" disabled={submitting}>
              {submitting ? "Unlocking…" : "Unlock Free Shipping"}
            </button>
          </form>

          {error && <p className="ecp-error">{error}</p>}

          <button type="button" className="ecp-decline" onClick={dismiss}>
            No thanks, I don't like savings
          </button>
        </div>
      </div>
    </div>
  );
}
