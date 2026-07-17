import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ShoppingCart, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/lib/cartStore";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products/desire-for-men", label: "Shop" },
  { href: "/our-story", label: "Our Story" },
  { href: "/our-science", label: "Our Science" },
  { href: "/faq", label: "FAQ" },
];

function Logo() {
  return (
    <Link to="/" className="pnav-logo" aria-label="DESIRE, Home">
      <img
        src="https://desirephilippines.b-cdn.net/HomePage/34.png"
        alt="DESIRE"
        style={{ height: 28, width: "auto", display: "block" }}
        loading="eager"
        decoding="async"
        width={120}
        height={28}
      />
    </Link>
  );
}

export function ProductNav() {
  const { pathname } = useLocation();
  const cartItems = useCart();
  const CART_COUNT = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className={`pnav ${scrolled ? "pnav-scrolled" : ""}`} aria-label="Primary">
      <div className="pnav-left">
        <Logo />
      </div>

      <ul className="pnav-center">
        {LINKS.map((l) => {
          const active = isActive(l.href);
          return (
            <li key={l.href}>
              <Link
                to={l.href}
                className={`pnav-link ${active ? "pnav-link-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="pnav-right flex items-center gap-2 justify-end">
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
              className="desire-nav-icon-btn desire-hamburger relative inline-flex items-center justify-center rounded-full text-current transition-colors"
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
              {LINKS.map((l) => (
                <li key={l.href} className="py-6 border-b border-line">
                  <Link
                    to={l.href}
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
  );
}
