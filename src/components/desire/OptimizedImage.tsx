import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Show skeleton placeholder while loading */
  skeleton?: boolean;
  /** Skip fade-in (for above-fold eager images) */
  instant?: boolean;
}

/**
 * Image wrapper with skeleton placeholder and 300ms fade-in on load.
 * Set `instant` for above-fold images that should appear immediately.
 */
export function OptimizedImage({
  skeleton = true,
  instant = false,
  className = "",
  style,
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle already-cached images (complete before onLoad fires)
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(e);
  };

  return (
    <span
      className={`desire-img-wrap${skeleton && !loaded ? " desire-img-skeleton" : ""}`}
      style={{ display: "inline-block", position: "relative", ...(style || {}) }}
    >
      <img
        ref={imgRef}
        className={`${className} ${instant || loaded ? "desire-img-loaded" : "desire-img-loading"}`}
        onLoad={handleLoad}
        {...props}
      />
    </span>
  );
}
