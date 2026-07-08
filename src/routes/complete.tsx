import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ProductNav } from "@/components/desire/ProductNav";
import { Footer } from "@/components/desire/Footer";
import type { CartItem } from "@/lib/cartStore";
import { trackEvent } from "@/lib/meta-pixel";
import { supabase } from "@/integrations/supabase/client";

type OrderCustomer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  city: string;
  barangay: string;
  country: string;
};

type Order = {
  orderId: string;
  shortId: string;
  createdAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  coupon: number;
  total: number;
  paymentMethod: "cod" | "qr";
};

const searchSchema = z.object({
  order_id: z.string().optional(),
});

export const Route = createFileRoute("/complete")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Order Successful - DESIRE" },
      { name: "description", content: "Thank you for your order from DESIRE." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CompletePage,
});

const DEMO_ORDER: Order = {
  orderId: "demo-preview",
  shortId: "5644",
  createdAt: new Date().toISOString(),
  customer: {
    firstName: "Juan",
    lastName: "Dela Cruz",
    phone: "0920-568-9440",
    email: "juan@example.com",
    address: "12th Floor Paragon Plaza Building, EDSA",
    region: "Metro Manila",
    city: "Mandaluyong",
    barangay: "Highway Hills",
    country: "Philippines",
  },
  items: [
    {
      id: "demo-men",
      name: "Desire for <em>Men</em>",
      meta: "3 Bottles · 90-Day Supply",
      unitPrice: 2097,
      qty: 1,
      image:
        "https://qmfzkvfxjheyhrweyshl.supabase.co/storage/v1/object/public/Desire%206/Man%201.png",
    },
  ] as Order["items"],
  subtotal: 2097,
  discount: 1500,
  shipping: 0,
  coupon: 0,
  total: 2097,
  paymentMethod: "qr",
};

// "Desire for Men" -> { lead: "Desire for", emphasis: "Men" }
function splitProductName(raw: string): { lead: string; emphasis: string } {
  const stripped = raw.replace(/<[^>]+>/g, "").trim();
  const idx = stripped.toLowerCase().lastIndexOf(" for ");
  if (idx === -1) {
    const parts = stripped.split(" ");
    return {
      lead: parts.slice(0, -1).join(" "),
      emphasis: parts[parts.length - 1] ?? stripped,
    };
  }
  return {
    lead: stripped.slice(0, idx + 5).trim(), // include "for"
    emphasis: stripped.slice(idx + 5).trim(),
  };
}

function CompletePage() {
  const { order_id } = Route.useSearch();
  const [order, setOrder] = useState<Order | null>(DEMO_ORDER);
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const key = order_id ? `desire_order_${order_id}` : "desire_order_last";
      const raw = sessionStorage.getItem(key) ?? sessionStorage.getItem("desire_order_last");
      if (raw) {
        setOrder(JSON.parse(raw) as Order);
        return;
      }
      setOrder(DEMO_ORDER);
    } catch {
      setOrder(DEMO_ORDER);
    }
  }, [order_id]);

  // Meta Pixel Purchase + Conversions API (deduped via event_id). Skips demo order.
  useEffect(() => {
    if (!order || order.orderId === "demo-preview") return;
    if (trackedRef.current === order.orderId) return;
    trackedRef.current = order.orderId;

    // Analytics checkout tracking
    import("@/lib/analytics")
      .then((a) => a.trackCheckout(order.orderId, order.total))
      .catch(() => {});

    const eventId = `purchase_${order.orderId}`;
    const contents = order.items.map((it) => ({
      id: it.id,
      quantity: it.qty,
      item_price: it.unitPrice,
    }));

    const getCookie = (name: string) => {
      if (typeof document === "undefined") return undefined;
      const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      return m ? decodeURIComponent(m[1]) : undefined;
    };

    trackEvent(
      "Purchase",
      {
        value: order.total,
        currency: "PHP",
        contents,
        content_type: "product",
        num_items: order.items.reduce((s, i) => s + i.qty, 0),
      },
      { eventID: eventId }
    );

    supabase.functions
      .invoke("meta-capi", {
        body: {
          eventId,
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
          value: order.total,
          currency: "PHP",
          contents,
          user: {
            email: order.customer.email,
            phone: order.customer.phone,
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            city: order.customer.city,
            country: order.customer.country,
            fbp: getCookie("_fbp"),
            fbc: getCookie("_fbc"),
          },
        },
      })
      .catch((e: unknown) => console.error("CAPI purchase failed", e));
  }, [order]);

  const fmt = (n: number) => n.toLocaleString("en-PH");

  return (
    <>
      <ProductNav />
      <main className="osuccess-page">
        <div className="osuccess-container">
          <h1 className="osuccess-title">
            Order <em>Successful</em> !
          </h1>

          {!order ? (
            <div className="osuccess-empty">
              <p>We couldn't find your order details.</p>
              <Link to="/" className="osuccess-home-link">Return home</Link>
            </div>
          ) : (
            <>
              <div className="osuccess-grid">
                {/* LEFT CARD */}
                <section className="osuccess-card">
                  <div className="osuccess-success-block">
                    <div className="osuccess-check-circle" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="osuccess-check-label">Order successful !</p>
                  </div>

                  {order.paymentMethod === "qr" && (
                    <div
                      role="status"
                      style={{
                        marginTop: "1rem",
                        padding: "0.875rem 1rem",
                        border: "1px solid #fca5a5",
                        background: "#fef2f2",
                        borderRadius: "0.5rem",
                        color: "#7f1d1d",
                        fontSize: "0.9rem",
                        lineHeight: 1.45,
                      }}
                    >
                      <strong>📞 Please wait for our call.</strong> Our customer service representative will contact you shortly to confirm your bank transfer payment and finalize your order. Kindly keep your phone available.
                    </div>
                  )}

                  <div className="osuccess-divider" />

                  <div className="osuccess-section-header">
                    <h2 className="osuccess-section-title">
                      Order <em>Summary</em>
                    </h2>
                    <span className="osuccess-pill-tag">#{order.shortId}</span>
                  </div>

                  <div className="osuccess-summary-rows">
                    <div className="osuccess-summary-row">
                      <span className="osuccess-summary-label">Subtotal</span>
                      <span className="osuccess-summary-value">₱ {fmt(order.subtotal)}</span>
                    </div>

                    {order.discount > 0 && (
                      <div className="osuccess-summary-row">
                        <span className="osuccess-summary-label osuccess-savings">Promotional Discounts</span>
                        <span className="osuccess-summary-value osuccess-savings">− ₱ {fmt(order.discount)}</span>
                      </div>
                    )}

                    <div className="osuccess-summary-row">
                      <span className="osuccess-summary-label">Coupon</span>
                      <span className="osuccess-summary-value">₱ {fmt(order.coupon)}</span>
                    </div>

                    <div className="osuccess-summary-row">
                      <span className="osuccess-summary-label">Shipping</span>
                      {order.shipping === 0 ? (
                        <span className="osuccess-summary-value osuccess-free">Free</span>
                      ) : (
                        <span className="osuccess-summary-value">₱ {fmt(order.shipping)}</span>
                      )}
                    </div>
                  </div>

                  {(order.discount + order.coupon) > 0 && (
                    <div className="osuccess-savings-banner">
                      You saved <em>₱ {fmt(order.discount + order.coupon)}</em> on this order!
                    </div>
                  )}

                  <div className="osuccess-total-block">
                    <span className="osuccess-total-label">Total Price</span>
                    <span className="osuccess-total-value">₱ {fmt(order.total)}</span>
                  </div>
                </section>

                {/* RIGHT CARD */}
                <section className="osuccess-card">
                  <div className="osuccess-section-header">
                    <h2 className="osuccess-section-title">
                      Delivery <em>Details</em>
                    </h2>
                  </div>

                  <div className="osuccess-delivery-header">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 21s-7-7.58-7-12a7 7 0 0 1 14 0c0 4.42-7 12-7 12z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span>Delivery address</span>
                  </div>

                  <p className="osuccess-delivery-name">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="osuccess-delivery-line">{order.customer.phone}</p>
                  <p className="osuccess-delivery-line">
                    {order.customer.address}, {order.customer.barangay}, {order.customer.city}, {order.customer.region}
                  </p>

                  <div className="osuccess-divider" />

                  <div className="osuccess-section-header">
                    <h2 className="osuccess-section-title">
                      Your <em>Item{order.items.length > 1 ? "s" : ""}</em>
                    </h2>
                  </div>

                  <div className="osuccess-items">
                    {order.items.map((item) => {
                      const { lead, emphasis } = splitProductName(item.name);
                      const gender = emphasis;
                      return (
                        <div key={item.id} className="osuccess-product-block">
                          <div className="osuccess-product-thumb">
                            {item.image ? (
                              <img src={item.image} alt={`${lead} ${emphasis}`} loading="lazy" decoding="async" />
                            ) : null}
                          </div>
                          <div className="osuccess-product-details">
                            <span className="osuccess-product-gender-tag">For {gender}</span>
                            <p className="osuccess-product-name">
                              {lead} <em>{emphasis}</em>
                            </p>
                            <span className="osuccess-bundle-pill">{item.meta}</span>
                            <p className="osuccess-product-quantity">Quantity: {item.qty}</p>
                          </div>
                          <div className="osuccess-product-price-block">
                            <p className="osuccess-product-price">₱ {fmt(item.unitPrice * item.qty)}</p>
                            <p className="osuccess-product-price-unit">₱ {fmt(item.unitPrice)} / bundle</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="osuccess-divider" />

                  <div className="osuccess-section-header">
                    <h2 className="osuccess-section-title">
                      Payment <em>Method</em>
                    </h2>
                  </div>

                  <div className="osuccess-payment-row">
                    <div className="osuccess-payment-left">
                      <div className="osuccess-payment-icon" aria-hidden>
                        <svg viewBox="0 0 24 24">
                          <rect x="3" y="6" width="18" height="13" rx="2" />
                          <line x1="3" y1="11" x2="21" y2="11" />
                        </svg>
                      </div>
                      <span>Method</span>
                    </div>
                    <span className="osuccess-payment-method">
                      {order.paymentMethod === "cod" ? (
                        <>Cash on Delivery <em>(COD)</em></>
                      ) : (
                        <>Bank Transfer <em>(QR Code)</em></>
                      )}
                    </span>
                  </div>
                </section>
              </div>

              <div className="osuccess-actions-row">
                <Link to="/products" className="osuccess-btn osuccess-btn-secondary">
                  ← Back to Shop
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
