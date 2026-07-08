import { useEffect, useRef, useState, type ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "p" | "section";
  /** Distance in px to translate up from. Default 40 */
  y?: number;
  /** Trigger immediately on mount instead of on intersection */
  immediate?: boolean;
}

/**
 * IntersectionObserver-based scroll reveal.
 * Fades + translates up over 0.9s using the DESIRE easing curve.
 * Honors prefers-reduced-motion automatically via global CSS rule.
 */
export function FadeUp({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  y = 40,
  immediate = false,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [immediate]);

  const style: React.CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    willChange: "opacity, transform",
  };

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
