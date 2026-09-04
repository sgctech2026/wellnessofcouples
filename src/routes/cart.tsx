import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductNav } from "@/components/desire/ProductNav";
import { Footer } from "@/components/desire/Footer";
import { useCart, updateQty, removeItem, dissolveBundle, type CartItem, type CartVariant } from "@/lib/cartStore";

const VARIANT_IMAGE: Record<CartVariant, string> = {
  him: "https://desirephilippines.b-cdn.net/HomePage/(NEW)%20MAIN%201%20(1)%20(1).webp",
  her: "https://desirephilippines.b-cdn.net/HomePage/(NEW)%20MAIN%201%20(2).webp",
  couple: "https://desirephilippines.b-cdn.net/HomePage/3.webp",
};

const fallbackImage = (variant: CartVariant) => VARIANT_IMAGE[variant] ?? VARIANT_IMAGE.him;

const resolveCartImage = (item: CartItem) => {
  const src = item.image?.trim();
  if (!src) return fallbackImage(item.variant);
  // Migrate legacy Supabase asset URLs that no longer resolve
  if (src.includes("qmfzkvfxjheyhrweyshl.supabase.co")) return fallbackImage(item.variant);
  return src;
};

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart - DESIRE" },
      { name: "description", content: "Review your DESIRE order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const items = useCart();
  const [pendingChange, setPendingChange] = useState<{ item: CartItem; delta: number } | null>(null);

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const totalBottles = items.reduce((s, i) => s + i.bundleSize * i.qty, 0);
  // Savings = sum of (originalPrice - unitPrice) * qty for active bundles
  const savings = items.reduce(
    (s, i) => s + Math.max(0, (i.originalPrice - i.unitPrice)) * i.qty,
    0,
  );
  const total = subtotal;
  const fmt = (n: number) => n.toLocaleString("en-PH");

  const handleStep = (item: CartItem, delta: number) => {
    if (item.isBundle) {
      // Warn before dissolving the bundle
      setPendingChange({ item, delta });
      return;
    }
    updateQty(item.id, item.qty + delta);
  };

  const confirmDissolve = () => {
    if (!pendingChange) return;
    dissolveBundle(pendingChange.item.id, pendingChange.delta);
    setPendingChange(null);
  };

  return (
    <>
      <ProductNav />
      <main className="cart-page">
        <div className="cart-title-block">
          <div className="cart-title-eyebrow">
            <span className="dot" />
            Your Order
          </div>
          <h1 className="cart-title">
            Shopping <em>Cart</em>
          </h1>
        </div>

        <section className="cart-card">
          <div className="cart-card-header">
            <h2 className="cart-card-title">
              Your <em>Items</em>
            </h2>
            <span className="cart-count-pill">
              {totalBottles} {totalBottles === 1 ? "Bottle" : "Bottles"}
            </span>
          </div>

          <div className="cart-items">
            {items.length === 0 && (
              <p style={{ padding: "2rem 0", textAlign: "center", color: "var(--mute)", fontSize: 13 }}>
                Your cart is empty.
              </p>
            )}
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={resolveCartImage(item)}
                    alt={item.name.replace(/<[^>]+>/g, "")}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const img = e.currentTarget;
                      const fb = fallbackImage(item.variant);
                      if (img.src !== fb) img.src = fb;
                    }}
                  />
                </div>
                <div className="cart-item-info">
                  {item.tag && <span className="cart-item-tag">{item.tag}</span>}
                  <div
                    className="cart-item-name"
                    dangerouslySetInnerHTML={{ __html: item.name }}
                  />
                  <p className="cart-item-meta">{item.meta}</p>
                  {item.isBundle && (
                    <div className="cart-bundle-warning" role="status">
                      <span className="cart-bundle-warning-icon" aria-hidden="true">⚠</span>
                      <span>
                        You're on the <strong>{item.bundleLabel}</strong> bundle.
                        {item.variant === "couple" ? (
                          <> Changing the quantity will leave the bundle and price each set (1 Men + 1 Women) at <strong>₱{fmt(item.basePrice)}</strong>, removing the 2+2 bundle discount.</>
                        ) : (
                          <> Changing the quantity will switch to single bottles at <strong>₱{fmt(item.basePrice)}</strong> each and remove the bundle discount.</>
                        )}
                      </span>
                    </div>
                  )}
                  <div className="cart-item-controls">
                    <span className="cart-item-qty-badge">Qty: {item.qty}</span>
                    <Link to="/products/desire-for-men" className="cart-item-addmore">
                      + Add more
                    </Link>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-pricing">
                  <p className="cart-item-total">₱{fmt(item.unitPrice * item.qty)}</p>
                  <p className="cart-item-unit">
                    {item.isBundle
                      ? `₱${fmt(item.unitPrice)} / bundle`
                      : `₱${fmt(item.unitPrice)} each`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₱{fmt(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="cart-summary-row green">
                <span>Bundle Savings</span>
                <span>− ₱{fmt(savings)}</span>
              </div>
            )}
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="free-tag">FREE</span>
            </div>

            {savings > 0 && (
              <div className="cart-savings-tag">
                You're saving <em>₱{fmt(savings)}</em> on this order!
              </div>
            )}

            <div className="cart-summary-total">
              <p className="cart-summary-total-label">Total</p>
              <p className="cart-summary-total-amount">₱{fmt(total)}</p>
            </div>
          </div>

          <div className="cart-cta-row">
            <Link to="/products/desire-for-men" className="cart-back-btn">
              ← Back to Shop
            </Link>
            <button
              type="button"
              className="cart-checkout-btn"
              disabled={items.length === 0}
              onClick={() => navigate({ to: "/checkout" })}
            >
              <span className="cart-checkout-text">Proceed to Checkout</span>
            </button>
          </div>
        </section>

        <div className="cart-trust-strip">
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <span className="trust-text">Secure SSL Checkout</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">📦</span>
            <span className="trust-text">Discreet Shipping</span>
          </div>
        </div>
      </main>

      {pendingChange && (
        <div
          className="cart-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-modal-title"
          onClick={() => setPendingChange(null)}
        >
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="cart-modal-title" className="cart-modal-title">
              Leave the <em>{pendingChange.item.variant === "couple" ? "couple bundle?" : "bundle deal?"}</em>
            </h3>
            <p className="cart-modal-body">
              You're currently on the <strong>{pendingChange.item.bundleLabel}</strong> bundle at{" "}
              <strong>₱{fmt(pendingChange.item.unitPrice)}</strong>.{" "}
              {pendingChange.item.variant === "couple" ? (
                <>Changing the quantity will leave the bundle and price each set (1 Men + 1 Women) at{" "}
                <strong>₱{fmt(pendingChange.item.basePrice)}</strong>, removing the 2+2 bundle discount.</>
              ) : (
                <>Changing the quantity will switch this line to single bottles at{" "}
                <strong>₱{fmt(pendingChange.item.basePrice)}</strong> each and remove the bundle discount.</>
              )}
            </p>
            <div className="cart-modal-actions">
              <button
                type="button"
                className="cart-modal-cancel"
                onClick={() => setPendingChange(null)}
              >
                Keep bundle
              </button>
              <button
                type="button"
                className="cart-modal-confirm"
                onClick={confirmDissolve}
              >
                {pendingChange.item.variant === "couple"
                  ? "Continue & leave bundle"
                  : "Continue & switch to single bottles"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
