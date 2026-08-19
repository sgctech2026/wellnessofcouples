import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="desire-footer">
      <div className="footer-overlay" aria-hidden="true" />

      <div className="footer-content">
        <div className="footer-grid">
          {/* LEFT */}
          <div>
            <a href="/" className="desire-logo">
              <img
                src="https://desirephilippines.b-cdn.net/HomePage/30.png"
                alt="DESIRE"
                loading="lazy"
                decoding="async"
                width={120}
                height={28}
              />
            </a>

            <p className="footer-story">
              You've read this far because something resonated. Maybe it's the
              memory of how things used to feel. Maybe it's the hope that they
              can feel that way again.
            </p>
            <p className="footer-story">
              They can. And it starts with one small step.
            </p>

            <p className="footer-follow-label">Follow Us</p>
            <div className="footer-social">
              <a
                href="https://www.facebook.com/DesireGummiesPH"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="footer-social-icon"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/desire.philippines?fbclid=IwY2xjawRxfxNleHRuA2FlbQIxMABicmlkETFoaHF1R2pONXpPYnI0OTYyc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHkLhjznHT7p5FMPPMxp_WflaLOUavKK3fbpT4GGmEJ-iWOzOTu_hRF9u1rW9_aem_c2lGxlmBtMqN3v_U46Yxvw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-social-icon"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="footer-contact-heading">Contact Us</h3>
            <p className="footer-contact-line">
              12th Floor Paragon Plaza Building
            </p>
            <p className="footer-contact-line">
              <a href="tel:09205689440" className="contact-link">
                0920-568-9440
              </a>
            </p>
            <p className="footer-contact-line">
              <a
                href="mailto:commitment.desire@gmail.com"
                className="contact-link"
              >
                commitment.desire@gmail.com
              </a>
            </p>
            <p className="footer-contact-line">Desire Philippines</p>

            <Link to="/products" preload="intent" className="footer-cta">
              Try Desire Today
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © 2026 Desire Philippines.</p>
          <div className="footer-legal">
            <a href="/privacy">Privacy policy</a>
            <a href="/terms-of-sale">Terms of sale</a>
            <a href="/refund-policy">Refund policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
