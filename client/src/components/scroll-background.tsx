import { useEffect, useRef, useMemo, useState } from "react";

const siteImages = Array.from({ length: 10 }, (_, i) => `/images/site-${i + 1}.webp`);

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── 3 depth layers — far / mid / near ─── */
const LAYERS = [
  { speed: 0.2,  blur: 0, opMin: 0.08, opMax: 0.14, wMin: 90,  wMax: 140 },
  { speed: 0.5,  blur: 0, opMin: 0.14, opMax: 0.24, wMin: 150, wMax: 220 },
  { speed: 0.88, blur: 0, opMin: 0.22, opMax: 0.38, wMin: 220, wMax: 340 },
];
const LAYERS_M = [
  { speed: 0.25, blur: 0, opMin: 0.06, opMax: 0.11, wMin: 50,  wMax: 75 },
  { speed: 0.5,  blur: 0, opMin: 0.10, opMax: 0.18, wMin: 70,  wMax: 105 },
  { speed: 0.82, blur: 0, opMin: 0.16, opMax: 0.28, wMin: 100, wMax: 160 },
];

interface Thumb {
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
}

function genLayerThumbs(
  count: number,
  pageHeight: number,
  layer: (typeof LAYERS)[0],
  seed: number,
  colCount: number
): Thumb[] {
  const rand = seededRandom(seed);
  const rows = Math.ceil(count / colCount);
  const cellW = 100 / colCount;
  const cellH = pageHeight > 0 ? 100 / rows : 25;
  const thumbs: Thumb[] = [];

  for (let i = 0; i < count; i++) {
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    thumbs.push({
      src: siteImages[Math.floor(rand() * siteImages.length)],
      x: col * cellW + cellW / 2 + (rand() - 0.5) * cellW * 0.7,
      y: row * cellH + cellH / 2 + (rand() - 0.5) * cellH * 0.4,
      width: layer.wMin + rand() * (layer.wMax - layer.wMin),
      rotation: (rand() - 0.5) * 16,
      opacity: layer.opMin + rand() * (layer.opMax - layer.opMin),
    });
  }
  return thumbs;
}

/* ─── Fixed edge thumbnails (always visible, float at viewport edges) ─── */
interface EdgeThumb {
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
  animDuration: number;
  animDelay: number;
  blur: number;
}

function generateEdgeThumbs(count: number, isMobile: boolean): EdgeThumb[] {
  const rand = seededRandom(555);
  const thumbs: EdgeThumb[] = [];
  const wMin = isMobile ? 60 : 120;
  const wMax = isMobile ? 100 : 220;

  for (let i = 0; i < count; i++) {
    const isLeft = i % 2 === 0;
    thumbs.push({
      src: siteImages[Math.floor(rand() * siteImages.length)],
      // Position at edges: left side -5%..12%, right side 88%..105%
      x: isLeft ? -5 + rand() * 17 : 88 + rand() * 17,
      y: (i / count) * 85 + 5 + (rand() - 0.5) * 12,
      width: wMin + rand() * (wMax - wMin),
      rotation: (rand() - 0.5) * 20,
      opacity: isMobile ? 0.10 + rand() * 0.12 : 0.14 + rand() * 0.18,
      animDuration: 14 + rand() * 16,
      animDelay: rand() * 8,
      blur: 0,
    });
  }
  return thumbs;
}

/* ─── Soft gradient blobs ─── */
interface SoftBlob {
  x: number;
  y: number;
  size: number;
  color: string;
  animDuration: number;
  animDelay: number;
}

function generateBlobs(count: number, isMobile: boolean): SoftBlob[] {
  const rand = seededRandom(99);
  const colors = [
    "hsla(220, 60%, 75%, 0.08)",
    "hsla(260, 50%, 75%, 0.06)",
    "hsla(175, 50%, 70%, 0.05)",
    "hsla(200, 60%, 75%, 0.07)",
    "hsla(280, 45%, 75%, 0.05)",
  ];
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: isMobile ? 200 + rand() * 250 : 350 + rand() * 450,
    color: colors[Math.floor(rand() * colors.length)],
    animDuration: 18 + rand() * 22,
    animDelay: rand() * 10,
  }));
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT — routes to mobile/desktop
   ═══════════════════════════════════════════ */
const IS_MOBILE_BG = typeof window !== "undefined" && window.innerWidth < 768;

export function ScrollBackground() {
  if (IS_MOBILE_BG) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-background/35" />
      </div>
    );
  }
  return <DesktopScrollBackground />;
}

function DesktopScrollBackground() {
  const [pageHeight, setPageHeight] = useState(0);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const rafRef = useRef<number>(0);
  const scrollYRef = useRef(0);
  const smoothY = useRef([0, 0, 0]);

  const lc = LAYERS;
  const thumbCounts = [8, 6, 5];
  const colCount = 4;

  const blobs = useMemo(() => generateBlobs(3, false), []);
  const edgeThumbs = useMemo(() => generateEdgeThumbs(4, false), []);
  const layerThumbs = useMemo(
    () => lc.map((c, i) => genLayerThumbs(thumbCounts[i], pageHeight, c, 42 + i * 17, colCount)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageHeight]
  );

  useEffect(() => {
    const update = () => setPageHeight(document.documentElement.scrollHeight);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(document.body);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let scrollDirty = true;
    const onScroll = () => { scrollYRef.current = window.scrollY; scrollDirty = true; };
    const frameInterval = 1000 / 30;
    let lastFrame = 0;
    let settled = 0;

    const animate = (ts: number) => {
      rafRef.current = requestAnimationFrame(animate);
      if (ts - lastFrame < frameInterval) return;
      lastFrame = ts;

      if (!scrollDirty && settled >= 3) return;
      scrollDirty = false;
      settled = 0;

      for (let i = 0; i < 3; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;
        const target = scrollYRef.current * lc[i].speed;
        const diff = target - smoothY.current[i];
        if (Math.abs(diff) < 0.5) { settled++; continue; }
        smoothY.current[i] += diff * 0.07;
        el.style.transform = `translate3d(0, ${-smoothY.current[i]}px, 0)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {blobs.map((blob, i) => (
        <div
          key={`blob-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
            animation: `heroFloat ${blob.animDuration}s ease-in-out infinite ${blob.animDelay}s`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {edgeThumbs.map((t, i) => (
        <div
          key={`edge-${i}`}
          className="absolute rounded-xl overflow-hidden"
          style={{
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: `${t.width}px`,
            opacity: t.opacity,
            filter: t.blur > 0 ? `blur(${t.blur}px)` : undefined,
            transform: `translate(-50%, -50%) rotate(${t.rotation}deg)`,
            animation: `heroFloat ${t.animDuration}s ease-in-out infinite ${t.animDelay}s`,
            boxShadow: "0 6px 24px rgba(0,0,0,0.06), 0 1px 6px rgba(0,0,0,0.03)",
            border: "1px solid rgba(0,0,0,0.04)",
            backfaceVisibility: "hidden",
          }}
        >
          <img
            src={t.src}
            alt=""
            width={t.width}
            height={t.width}
            className="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}

      {lc.map((config, li) => (
        <div
          key={`layer-${li}`}
          ref={(el) => { layerRefs.current[li] = el; }}
          className="absolute left-0 w-full"
          style={{
            top: 0,
            height: `${pageHeight}px`,
            backfaceVisibility: "hidden",
            contain: "layout style",
            willChange: "transform",
          }}
        >
          {layerThumbs[li]?.map((thumb, i) => (
            <div
              key={i}
              className="absolute rounded-xl overflow-hidden"
              style={{
                left: `${thumb.x}%`,
                top: `${thumb.y}%`,
                width: `${thumb.width}px`,
                transform: `translate3d(-50%, -50%, 0) rotate(${thumb.rotation}deg)`,
                opacity: thumb.opacity,
                filter: config.blur > 0 ? `blur(${config.blur}px)` : undefined,
                backfaceVisibility: "hidden",
                boxShadow:
                  li === 2
                    ? "0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)"
                    : li === 1
                    ? "0 6px 24px rgba(0,0,0,0.06), 0 1px 6px rgba(0,0,0,0.03)"
                    : "0 4px 16px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.04)",
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
      ))}

      <div className="absolute inset-0 bg-background/35 scroll-bg-overlay" />
    </div>
  );
}
