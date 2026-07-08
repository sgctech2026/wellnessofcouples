import { useEffect, useState } from "react";

/**
 * Full-screen DESIRE-branded loader.
 * Shows for max 1 second on first visit only, then fades out.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setVisible(!sessionStorage.getItem("desire_loaded"));
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Dismiss after max 1s or when page is loaded
    const dismiss = () => {
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("desire_loaded", "1");
      }, 400);
    };

    const timer = setTimeout(dismiss, 1000);

    const onReady = () => {
      clearTimeout(timer);
      dismiss();
    };

    if (document.readyState === "complete") {
      clearTimeout(timer);
      // Still show briefly for brand impression
      setTimeout(dismiss, 300);
    } else {
      window.addEventListener("load", onReady);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", onReady);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="desire-page-loader"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.4s ease-out",
      }}
      aria-hidden
    >
      <p className="desire-page-loader-text">DESIRE<sup>®</sup></p>
    </div>
  );
}
