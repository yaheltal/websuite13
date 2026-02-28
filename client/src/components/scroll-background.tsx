import { useEffect, useRef, useMemo, useState } from "react";

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

function generateThumbnails(count: number, pageHeight: number, isMobile = false): Thumbnail[] {
  const rand = seededRandom(42);
  const thumbnails: Thumbnail[] = [];
  const cols = isMobile ? 3 : 4;
  const rows = Math.ceil(count / cols);
  const cellW = 100 / cols;
  const cellH = pageHeight > 0 ? (100 / rows) : (25);
  const widthMin = isMobile ? 70 : 140;
  const widthRange = isMobile ? 40 : 100;

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
      width: widthMin + rand() * widthRange,
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
  const [pageHeight, setPageHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ticking = useRef(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 12 : 40;
  const thumbnails = useMemo(() => generateThumbnails(count, pageHeight, isMobile), [pageHeight, count, isMobile]);

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
    const wrapper = wrapperRef.current;
    const els = thumbElsRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        wrapper.style.transform = `translateY(${-sy * 0.85}px)`;
        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          if (!el) continue;
          const thumb = thumbnails[i];
          if (!thumb) continue;
          el.style.transform = `translate(-50%, -50%) rotate(${thumb.rotation}deg) translateY(${sy * thumb.parallaxSpeed}px)`;
        }
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [thumbnails]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        ref={wrapperRef}
        className="absolute left-0 w-full"
        style={{
          top: 0,
          height: `${pageHeight}px`,
          willChange: "transform",
        }}
      >
        {thumbnails.map((thumb, i) => (
          <div
            key={i}
            ref={(el) => { thumbElsRef.current[i] = el; }}
            className="absolute rounded-lg overflow-hidden shadow-lg border border-border/10"
            style={{
              left: `${thumb.x}%`,
              top: `${thumb.y}%`,
              width: `${thumb.width}px`,
              transform: `translate(-50%, -50%) rotate(${thumb.rotation}deg)`,
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
              fetchPriority="low"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-background/60 scroll-bg-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
    </div>
  );
}
