import { useEffect, useState } from "react";

const SPLINE_PARTICLES_URL = "https://my.spline.design/particlesforwebsite-4JYgB1WXPkQibNKltQ9HykDN/";

/**
 * Spline 3D particles as a full-page background.
 * Fixed behind all content. Hidden on mobile for performance.
 */
export function SplineMacbook() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [isMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  // Delay load slightly so the main content renders first
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(() => setShouldLoad(true), 1500);
    return () => clearTimeout(timer);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity: isLoaded ? 0.5 : 0,
        transition: "opacity 2s ease-out",
      }}
      aria-hidden="true"
    >
      {shouldLoad && (
        <iframe
          src={SPLINE_PARTICLES_URL}
          frameBorder="0"
          width="100%"
          height="100%"
          style={{
            border: "none",
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
          }}
          title="3D Particles Background"
          loading="lazy"
          allow="autoplay"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
