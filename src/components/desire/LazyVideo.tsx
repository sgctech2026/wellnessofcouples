import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  /** rootMargin for IntersectionObserver. Default "200px" */
  rootMargin?: string;
  onRef?: (el: HTMLVideoElement | null) => void;
}

/**
 * Lazy-loads a video using IntersectionObserver.
 * The <video> element is only mounted when the wrapper scrolls near the viewport.
 */
export function LazyVideo({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  playsInline = true,
  controls = false,
  rootMargin = "200px",
  onRef,
}: LazyVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative" }}>
      {shouldLoad ? (
        <video
          ref={(el) => onRef?.(el)}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : poster ? (
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-full w-full bg-black/10" />
      )}
    </div>
  );
}
