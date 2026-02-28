/**
 * Performance utilities for 60 FPS and Core Web Vitals.
 * @see docs/PERFORMANCE-ANIMATIONS-GUIDE.md
 */

/**
 * Throttle: run at most once per `limitMs` (default 16ms ~ 60fps).
 * Uses requestAnimationFrame so work runs in sync with the display.
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limitMs = 16
): (...args: Parameters<T>) => void {
  let last = 0;
  let rafId: number | null = null;
  return function throttled(this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const elapsed = now - last;
    if (elapsed >= limitMs) {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        last = Date.now();
        fn.apply(this, args);
        rafId = null;
      });
    }
  };
}

/**
 * Debounce: run only after `delayMs` has passed since the last call.
 * Good for resize, search input, or "run when things settle".
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function debounced(this: unknown, ...args: Parameters<T>) {
    if (timeoutId != null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delayMs);
  };
}

/**
 * Run a callback on the next animation frame; cancel previous if called again (e.g. for scroll).
 */
export function rafSchedule(fn: () => void): () => void {
  let rafId: number | null = null;
  return function schedule() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      fn();
      rafId = null;
    });
  };
}
