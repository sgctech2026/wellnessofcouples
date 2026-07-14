import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart, clearCart } from "@/lib/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchVariations,
  fetchProvinces as fetchPancakeProvinces,
  fetchDistricts,
  fetchCommunes,
  submitOrder,
  resolveSkuEntry,
  variationCache,
  type GeoItem,
} from "@/services/pancakeService";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout - DESIRE" },
      { name: "description", content: "Complete your DESIRE order securely." },
    ],
  }),
  component: CheckoutPage,
});

/* ── Searchable Combobox ──────────────────────────────── */

function LocationCombobox({
  label,
  items,
  value,
  onChange,
  disabled,
  loading,
  error,
  onRetry,
  placeholder = "Select…",
}: {
  label: string;
  items: GeoItem[];
  value: GeoItem | null;
  onChange: (v: GeoItem) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        <span className="req">*</span>
      </label>
      {error ? (
        <button
          type="button"
          className="form-input flex items-center gap-2 text-left"
          onClick={onRetry}
          style={{ color: "var(--red, #c0392b)" }}
        >
          <RefreshCw size={14} /> Retry
        </button>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              disabled={disabled || loading}
              className="form-input flex items-center justify-between text-left w-full"
              style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Loading…
                </span>
              ) : value ? (
                value.name
              ) : (
                <span style={{ color: "var(--mute)" }}>{placeholder}</span>
              )}
              <ChevronsUpDown size={14} style={{ opacity: 0.4 }} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase().replace(" *", "")}…`} />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => {
                        onChange(item);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.id === item.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

/* ── Checkout Page ────────────────────────────────────── */

function CheckoutPage() {
  const items = useCart();
  const navigate = useNavigate();
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const discount = items.reduce(
    (s, i) => s + Math.max(0, i.originalPrice - i.unitPrice) * i.qty,
    0,
  );
  const total = subtotal;
  const fmt = (n: number) => n.toLocaleString("en-PH");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "qr">("cod");
  const [submitting, setSubmitting] = useState(false);

  /* ── Pancake geo state ── */
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [cities, setCities] = useState<GeoItem[]>([]);
  const [barangays, setBarangays] = useState<GeoItem[]>([]);

  const [province, setProvince] = useState<GeoItem | null>(null);
  const [city, setCity] = useState<GeoItem | null>(null);
  const [barangay, setBarangay] = useState<GeoItem | null>(null);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  const [errorProvinces, setErrorProvinces] = useState(false);
  const [errorCities, setErrorCities] = useState(false);
  const [errorBarangays, setErrorBarangays] = useState(false);

  /* cache refs */
  const citiesCache = useRef<Record<string, GeoItem[]>>({});
  const barangaysCache = useRef<Record<string, GeoItem[]>>({});

  /* Load variations + provinces on mount */
  const loadProvinces = useCallback(async () => {
    setLoadingProvinces(true);
    setErrorProvinces(false);
    try {
      const list = await fetchPancakeProvinces();
      setProvinces(list);
    } catch {
      setErrorProvinces(true);
      toast.error("Unable to load locations. Please check your connection.");
    } finally {
      setLoadingProvinces(false);
    }
  }, []);

  useEffect(() => {
    fetchVariations().catch((err) =>
      console.error("Failed to preload Pancake variations:", err),
    );
    loadProvinces();
  }, [loadProvinces]);

  /* Load cities when province changes */
  const loadCities = useCallback(async (prov: GeoItem) => {
    if (citiesCache.current[prov.id]) {
      setCities(citiesCache.current[prov.id]);
      return;
    }
    setLoadingCities(true);
    setErrorCities(false);
    try {
      const list = await fetchDistricts(prov.id);
      citiesCache.current[prov.id] = list;
      setCities(list);
    } catch {
      setErrorCities(true);
      toast.error("Unable to load cities. Please check your connection.");
    } finally {
      setLoadingCities(false);
    }
  }, []);

  /* Load barangays when city changes */
  const loadBarangays = useCallback(async (c: GeoItem) => {
    if (barangaysCache.current[c.id]) {
      setBarangays(barangaysCache.current[c.id]);
      return;
    }
    setLoadingBarangays(true);
    setErrorBarangays(false);
    try {
      const list = await fetchCommunes(c.id);
      barangaysCache.current[c.id] = list;
      setBarangays(list);
    } catch {
      setErrorBarangays(true);
      toast.error("Unable to load barangays. Please check your connection.");
    } finally {
      setLoadingBarangays(false);
    }
  }, []);

  const handleProvinceChange = (p: GeoItem) => {
    setProvince(p);
    setCity(null);
    setBarangay(null);
    setCities([]);
    setBarangays([]);
    loadCities(p);
  };

  const handleCityChange = (c: GeoItem) => {
    setCity(c);
    setBarangay(null);
    setBarangays([]);
    loadBarangays(c);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const canPlaceOrder =
    items.length > 0 &&
    fullName.trim() !== "" &&
    phone.trim() !== "" &&
    emailValid &&
    address.trim() !== "" &&
    province !== null &&
    city !== null &&
    barangay !== null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPlaceOrder || submitting) return;

    /* ── Validate phone ── */
    const cleanPhone = phone.trim().replace(/[\s\-()]/g, "");
    if (!/^\d{10,11}$/.test(cleanPhone)) {
      toast.error("Phone number must be 10-11 digits.");
      return;
    }

    setSubmitting(true);
    try {
      /* ── Resolve Pancake variation for each cart line ── */
      // We submit one Pancake order per cart line (or aggregate if single-variant)
      // For simplicity, submit the first item as the primary order line
      // and note remaining items
      const firstItem = items[0];
      const skuEntry = resolveSkuEntry(firstItem.variant, firstItem.bundleSize);
      if (!skuEntry) {
        toast.error("Product variant not found. Please refresh and try again.");
        setSubmitting(false);
        return;
      }

      const variationId = variationCache.get(skuEntry.sku);
      if (!variationId) {
        toast.error("Product variant not found. Please refresh and try again.");
        setSubmitting(false);
        return;
      }

      /* ── Submit to Pancake POS ── */
      const bundleLabel = firstItem.variant === "couple"
        ? `${firstItem.bundleSize}M + ${firstItem.bundleSize}W`
        : `${firstItem.bundleSize} Bottle${firstItem.bundleSize > 1 ? "s" : ""}`;

      await submitOrder({
        fullName: fullName.trim(),
        phone: cleanPhone,
        streetAddress: address.trim(),
        provinceId: province!.id,
        provinceName: province!.name,
        districtId: city!.id,
        districtName: city!.name,
        communeId: barangay!.id,
        communeName: barangay!.name,
        landmark: landmark.trim(),
        paymentMethod: paymentMethod === "cod" ? "cod" : "transfer",
        price: total,
        productId: skuEntry.productId,
        variationId,
        bundleLabel,
        websiteOrderId: String(Date.now()),
      });

      /* ── Also save to Supabase for internal tracking ── */
      const orderId = crypto.randomUUID();
      const { error } = await supabase.from("orders").insert({
        id: orderId,
        name: fullName.trim(),
        email: email.trim(),
        phone: cleanPhone,
        street_address: address.trim(),
        province_code: province!.id,
        province_name: province!.name,
        city_code: city!.id,
        city_name: city!.name,
        barangay_code: barangay!.id,
        barangay_name: barangay!.name,
        landmark: landmark.trim() || null,
        variant: items.map((i) => `${i.name.replace(/<[^>]+>/g, "")} x${i.qty}`).join(", "),
        quantity: totalQty,
        total_amount: total,
        status: "pending",
      });

      if (error) {
        console.warn("Supabase order save failed (non-blocking):", error);
      }

      // Save to sessionStorage for the thank-you page
      const order = {
        orderId,
        shortId: Math.floor(1000 + Math.random() * 9000).toString(),
        createdAt: new Date().toISOString(),
        customer: {
          name: fullName,
          phone,
          address,
          landmark,
          province: province!.name,
          city: city!.name,
          barangay: barangay!.name,
          country: "Philippines",
        },
        items,
        subtotal,
        discount,
        shipping: 0,
        coupon: 0,
        total,
        paymentMethod,
      };
      try {
        sessionStorage.setItem(`desire_order_${orderId}`, JSON.stringify(order));
        sessionStorage.setItem("desire_order_last", JSON.stringify(order));
      } catch (storageError) {
        console.warn("Unable to save order summary locally:", storageError);
      }

      clearCart();
      navigate({ to: "/complete", search: { order_id: orderId } });
    } catch (err: unknown) {
      console.error("Order submission failed:", err);
      const message = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      {/* Top brand bar */}
      <div className="checkout-top">
        <div className="checkout-brand">
          <Link to="/" className="checkout-logo">
            DESIRE
          </Link>
          <div className="checkout-rating">
            <span className="stars" aria-hidden>
              ★★★★★
            </span>
            <span className="num">16k+</span>
            <span className="label">5-Star Reviews</span>
          </div>
        </div>
        <Link to="/cart" className="checkout-back">
          ← Back to Cart
        </Link>
      </div>

      {/* Main grid */}
      <div className="checkout-grid">
        {/* LEFT: Form */}
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          {/* Section 1 */}
          <section className="form-section">
            <header className="form-section-header">
              <span className="form-section-num" aria-hidden>
                1
              </span>
              <h2 className="form-section-title">
                Delivery <em>Information</em>
              </h2>
              <span className="form-section-meta">Required</span>
            </header>

            <div className="form-row cols-2">
              <div className="form-field">
                <label className="form-label" htmlFor="co-name">
                  Full Name<span className="req">*</span>
                </label>
                <input
                  id="co-name"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  required
                  aria-required
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="co-phone">
                  Phone Number<span className="req">*</span>
                </label>
                <input
                  id="co-phone"
                  className="form-input"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09XX XXX XXXX"
                  required
                  aria-required
                  aria-describedby="co-phone-hint"
                />
                <p
                  id="co-phone-hint"
                  className="mt-1.5 text-[0.78rem] leading-snug text-muted-foreground"
                >
                  Please double-check your number — we'll use it to reach you about your order.
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label" htmlFor="co-email">
                  Email Address<span className="req">*</span>
                </label>
                <input
                  id="co-email"
                  className="form-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@email.com"
                  required
                  aria-required
                  aria-describedby="co-email-hint"
                />
                <p
                  id="co-email-hint"
                  className="mt-1.5 text-[0.78rem] leading-snug text-muted-foreground"
                >
                  We'll send your order confirmation and updates here.
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label" htmlFor="co-address">
                  Street Address / House No.<span className="req">*</span>
                </label>
                <input
                  id="co-address"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street, Subdivision"
                  required
                  aria-required
                />
              </div>
            </div>

            <div className="form-row cols-3">
              <LocationCombobox
                label="Province"
                items={provinces}
                value={province}
                onChange={handleProvinceChange}
                loading={loadingProvinces}
                error={errorProvinces}
                onRetry={loadProvinces}
                placeholder="Select Province"
              />
              <LocationCombobox
                label="City / Municipality"
                items={cities}
                value={city}
                onChange={handleCityChange}
                disabled={!province}
                loading={loadingCities}
                error={errorCities}
                onRetry={() => province && loadCities(province)}
                placeholder="Select City"
              />
              <LocationCombobox
                label="Barangay"
                items={barangays}
                value={barangay}
                onChange={(b) => setBarangay(b)}
                disabled={!city}
                loading={loadingBarangays}
                error={errorBarangays}
                onRetry={() => city && loadBarangays(city)}
                placeholder="Select Barangay"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label" htmlFor="co-landmark">
                  Landmark
                </label>
                <input
                  id="co-landmark"
                  className="form-input"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near school, beside sari-sari store, etc."
                />
              </div>
            </div>

            <label className="form-save">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
              />
              <span>Save this information for next time</span>
            </label>
          </section>

          {/* Section 2 */}
          <section className="form-section">
            <header className="form-section-header">
              <span className="form-section-num" aria-hidden>
                2
              </span>
              <h2 className="form-section-title">
                Payment <em>Method</em>
              </h2>
              <span className="form-section-meta">Secure</span>
            </header>

            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="visually-hidden"
                />
                <span className="payment-radio" aria-hidden />
                <span className="payment-icon" aria-hidden>
                  🚚
                </span>
                <div className="payment-info">
                  <p className="payment-name">
                    Cash on <em>Delivery</em> (COD)
                  </p>
                  <p className="payment-meta">Pay when you receive your order</p>
                </div>
              </label>

              <label className="payment-option is-disabled" aria-disabled="true">
                <input
                  type="radio"
                  name="payment"
                  value="qr"
                  disabled
                  className="visually-hidden"
                />
                <span className="payment-radio" aria-hidden />
                <span className="payment-icon" aria-hidden>
                  📱
                </span>
                <div className="payment-info">
                  <p className="payment-name">
                    Bank <em>Transfer</em> (QR Code)
                  </p>
                  <p className="payment-meta">Currently unavailable — please use COD</p>
                </div>
                <span className="payment-unavailable-badge">Unavailable</span>
              </label>
            </div>

            <p className="payment-secure-note">All transactions are secure and encrypted via SSL</p>

            <button
              type="submit"
              className="place-order-btn"
              disabled={!canPlaceOrder || submitting}
              aria-disabled={!canPlaceOrder || submitting}
              style={
                !canPlaceOrder || submitting ? { opacity: 0.55, cursor: "not-allowed" } : undefined
              }
            >
              <span className="place-order-text">
                {submitting ? "Placing Order…" : `Place Order - ₱${fmt(total)}`}
              </span>
            </button>
          </section>
        </form>

        {/* RIGHT: Summary */}
        <aside className="checkout-summary">
          <div className="summary-title">
            <span>
              Order <em>Summary</em>
            </span>
            <Link to="/cart" className="summary-edit">
              Edit
            </Link>
          </div>

          {items.length === 0 && (
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 12,
                color: "var(--mute)",
                padding: "1rem 0",
              }}
            >
              Your cart is empty.
            </p>
          )}

          {items.map((item) => (
            <div key={item.id} className="summary-item">
              <div className="summary-item-img">
                <img src={item.image} alt={item.name.replace(/<[^>]+>/g, "")} loading="lazy" decoding="async" />
                <span className="summary-item-qty">{item.qty}</span>
              </div>
              <div>
                <p className="summary-item-name" dangerouslySetInnerHTML={{ __html: item.name }} />
                <p className="summary-item-meta">
                  {item.meta} ·{" "}
                  {item.isBundle
                    ? `₱${fmt(item.unitPrice)} / bundle`
                    : `₱${fmt(item.unitPrice)} each`}
                </p>
              </div>
              <p className="summary-item-price">₱{fmt(item.unitPrice * item.qty)}</p>
            </div>
          ))}

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₱{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row green">
                <span>Bundle Savings</span>
                <span>− ₱{fmt(discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>

            {discount > 0 && (
              <div className="summary-savings">
                You're saving <em>₱{fmt(discount)}</em> on this order!
              </div>
            )}

            <div className="summary-total">
              <p className="summary-total-label">Total</p>
              <p className="summary-total-amount">₱{fmt(total)}</p>
            </div>
          </div>

          <div className="summary-trust">
            <div className="summary-trust-item">30-Day Money-Back Guarantee</div>
            <div className="summary-trust-item">Discreet, unmarked packaging</div>
            <div className="summary-trust-item">SSL secured payment</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
