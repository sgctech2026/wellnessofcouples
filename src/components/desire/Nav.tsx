import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/lib/cartStore";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products/desire-for-men" },
  { label: "Our Story", to: "/our-story" },
  { label: "Our Science", to: "/our-science" },
  { label: "FAQ", to: "/faq" },
] as const;

export function Nav({ lightBg = false }: { lightBg?: boolean } = {}) {
  const cartItems = useCart();
  const CART_COUNT = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const updateState = (v: number) => {
    setScrolled(v > 20);
    const hero = document.querySelector("[data-hero-section]") as HTMLElement | null;
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    setHidden(v > heroBottom - 80);
  };

  useMotionValueEvent(scrollY, "change", updateState);

  useEffect(() => {
    updateState(window.scrollY);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 z-40 transition-[background-color,backdrop-filter,border-color,top,padding,transform,opacity,color] duration-500"
      style={{
        top: scrolled ? 0 : 35,
        backgroundColor: scrolled || lightBg ? "#ffffff" : "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "none",
        color: lightBg ? "#db2626" : scrolled ? "#000" : "#fff",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
    >
      <nav
        className={`w-full grid grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-12 pl-4 pr-0 md:px-6 transition-[padding] duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
        aria-label="Primary"
      >
        {/* LEFT, Logo wordmark */}
        <Link
          to="/"
          preload="intent"
          className="inline-flex items-center"
          aria-label="DESIRE, Home"
        >
          <img
            src={scrolled || lightBg ? "https://desirephilippines.b-cdn.net/HomePage/Asset%207.webp" : "https://desirephilippines.b-cdn.net/HomePage/white.webp"}
            alt="DESIRE"
            style={{ height: 28, width: "auto", display: "block" }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={120}
            height={28}
          />
        </Link>

        {/* CENTER, Nav links (desktop only) */}
        <ul className="hidden lg:flex items-center justify-center gap-12">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                preload="intent"
                className="desire-nav-link relative inline-block text-current py-2"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT, Icon cluster */}
        <div className="flex items-center gap-2 justify-end -mr-5 md:mr-0">
          <Link
            to="/cart"
            className="desire-nav-icon-btn relative inline-flex items-center justify-center rounded-full text-current transition-colors"
            style={{ width: 42, height: 42 }}
            aria-label="Cart"
          >
            <ShoppingCart size={20} strokeWidth={1.8} />
            {CART_COUNT > 0 && (
              <span
                className="desire-cart-badge absolute flex items-center justify-center font-bold"
                style={{
                  top: 4,
                  right: 4,
                  minWidth: 18,
                  height: 18,
                  padding: "0 5px",
                  background: "var(--red)",
                  color: "var(--cream)",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 700,
                  border: "2px solid var(--cream)",
                }}
              >
                {CART_COUNT}
              </span>
            )}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="desire-nav-icon-btn desire-hamburger relative lg:hidden inline-flex items-center justify-center rounded-full text-current transition-colors"
                style={{ width: 42, height: 42 }}
                aria-label="Menu"
              >
                <span
                  className="flex flex-col justify-between"
                  style={{ width: 20, height: 14 }}
                  aria-hidden
                >
                  <span className="desire-hamburger-line" style={{ width: "100%", height: 1.5, background: "currentColor" }} />
                  <span className="desire-hamburger-line desire-hamburger-mid" style={{ width: "70%", height: 1.5, background: "currentColor", marginLeft: "auto" }} />
                  <span className="desire-hamburger-line" style={{ width: "100%", height: 1.5, background: "currentColor" }} />
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-cream border-line text-ink">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-serif text-xl tracking-[0.3em] text-ink">
                  DESIRE
                </SheetTitle>
                <SheetClose className="rounded-full p-2 text-ink hover:bg-ink/10">
                  <X className="h-5 w-5" />
                </SheetClose>
              </div>
              <ul className="mt-10 flex flex-col">
                {NAV_LINKS.map((l) => (
                  <li key={l.label} className="py-6 border-b border-line">
                    <Link
                      to={l.to}
                      preload="intent"
                      onClick={() => setOpen(false)}
                      className="font-serif text-2xl text-ink transition-colors hover:text-red"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
