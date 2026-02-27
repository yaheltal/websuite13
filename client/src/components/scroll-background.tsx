import { useEffect, useState, useRef, useMemo } from "react";

const siteImages = Array.from({ length: 10 }, (_, i) => `/images/site-${i + 1}.webp`);

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Thumbnail {
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
  parallaxSpeed: number;
  floatDuration: number;
  floatDelay: number;
  floatAmplitude: number;
}

function generateThumbnails(count: number, pageHeight: number): Thumbnail[] {
  const rand = seededRandom(42);
  const thumbnails: Thumbnail[] = [];
  const cols = 4;
  const rows = Math.ceil(count / cols);
  const cellW = 100 / cols;
  const cellH = pageHeight > 0 ? (100 / rows) : (25);

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const src = siteImages[i % siteImages.length];
    const jitterX = (rand() - 0.5) * cellW * 0.6;
    const jitterY = (rand() - 0.5) * cellH * 0.5;

    thumbnails.push({
      src,
      x: col * cellW + cellW / 2 + jitterX,
      y: row * cellH + cellH / 2 + jitterY,
      width: 140 + rand() * 100,
      rotation: (rand() - 0.5) * 20,
      opacity: 0.12 + rand() * 0.14,
      parallaxSpeed: 0.03 + rand() * 0.06,
      floatDuration: 8 + rand() * 12,
      floatDelay: rand() * -20,
      floatAmplitude: 10 + rand() * 20,
    });
  }

  return thumbnails;
}

export function ScrollBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const ticking = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const thumbnails = useMemo(() => generateThumbnails(40, pageHeight), [pageHeight]);

  useEffect(() => {
    const updateHeight = () => {
      setPageHeight(document.documentElement.scrollHeight);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true" ref={containerRef}>
      <div
        className="absolute left-0 w-full"
        style={{
          top: 0,
          height: `${pageHeight}px`,
          transform: `translateY(${-scrollY * 0.85}px)`,
          willChange: "transform",
        }}
      >
        {thumbnails.map((thumb, i) => (
          <div
            key={i}
            className="absolute rounded-lg overflow-hidden shadow-lg border border-border/10"
            style={{
              left: `${thumb.x}%`,
              top: `${thumb.y}%`,
              width: `${thumb.width}px`,
              transform: `translate(-50%, -50%) rotate(${thumb.rotation}deg) translateY(${scrollY * thumb.parallaxSpeed}px)`,
              opacity: thumb.opacity,
              willChange: "transform",
              animation: `bgFloat ${thumb.floatDuration}s ease-in-out ${thumb.floatDelay}s infinite`,
            }}
          >
            <img
              src={thumb.src}
              alt=""
              width={thumb.width}
              height={thumb.width}
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-background/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
    </div>
  );
}
