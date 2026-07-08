import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

interface SlideInXProps {
  children: ReactNode;
  /** "left" = slides in from the left, "right" = slides in from the right */
  from?: "left" | "right";
  /** Distance in px to translate from. Default 120 */
  x?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Optional rotation to keep on the element when settled (degrees) */
  rotate?: number;
}

/**
 * IntersectionObserver-based horizontal slide-in reveal.
 */
export function SlideInX({
  children,
  from = "left",
  x = 120,
  delay = 0,
  className = "",
  style,
  rotate = 0,
}: SlideInXProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Re-trigger every time: play when entering, reset when leaving
          setShown(e.isIntersecting);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const offset = from === "left" ? -x : x;
  const settled = `translateX(0) rotate(${rotate}deg)`;
  const initial = `translateX(${offset}px) rotate(${rotate}deg)`;

  const composed: CSSProperties = {
    ...style,
    opacity: shown ? 1 : 0,
    transform: shown ? settled : initial,
    transition: `opacity 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={composed}>
      {children}
    </div>
  );
}
