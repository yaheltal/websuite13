import { useEffect, useState, useRef, RefObject } from "react";

/**
 * Returns scroll progress through a section (0 when section enters from bottom,
 * 1 when it has fully passed the top). Igloo-style scroll-linked effects.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  options?: { offsetStart?: number; offsetEnd?: number }
): number {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  const opts = { offsetStart: 0, offsetEnd: 0, ...options };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * (1 - opts.offsetStart);
      const end = -rect.height * opts.offsetEnd;
      const range = start - end;
      if (range <= 0) {
        setProgress(rect.top <= vh / 2 ? 1 : 0);
        return;
      }
      const raw = (start - rect.top) / range;
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };

    const onScroll = () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        update();
        raf.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [ref, opts.offsetStart, opts.offsetEnd]);

  return progress;
}
