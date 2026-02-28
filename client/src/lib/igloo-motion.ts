/**
 * Igloo.inc-style motion system: single source of truth for easing, durations,
 * and transition configs. Use everywhere (Framer Motion, GSAP, CSS) for a
 * consistent premium scroll-driven feel.
 */

/** Premium ease-out (smooth deceleration at end) – primary for scroll reveals */
export const EASE_OUT_SMOOTH = [0.22, 1, 0.36, 1] as const;

/** Ease-in-out for symmetric transitions */
export const EASE_IN_OUT_SMOOTH = [0.65, 0, 0.35, 1] as const;

/** Slightly bouncy ease-out for micro-interactions (buttons, icons) */
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;

/** Linear for scrub/scroll-linked animations */
export const EASE_LINEAR = [0, 0, 1, 1] as const;

export const DURATION = {
  /** Fast: hover states, small feedback */
  fast: 0.25,
  /** Default: most reveals and transitions */
  normal: 0.65,
  /** Slow: hero, big blocks */
  slow: 1,
  /** Extra slow: intro / section transitions */
  slower: 1.4,
} as const;

/** Stagger step between items in a row (e.g. 0.1 = 100ms) */
export const STAGGER_STEP = 0.1;

/** Default viewport amount for "in view" (0–1, e.g. 0.12 = 12% visible) */
export const VIEWPORT_AMOUNT = 0.12;

/** Framer Motion transition for scroll reveal (fade + slide up) */
export const revealTransition = {
  duration: DURATION.normal,
  ease: EASE_OUT_SMOOTH,
} as const;

/** Framer Motion transition with optional stagger delay */
export function revealWithStagger(staggerDelaySeconds = 0) {
  return {
    duration: DURATION.normal,
    delay: staggerDelaySeconds,
    ease: EASE_OUT_SMOOTH,
  } as const;
}

/** Spring config for interactive elements (magnetic, drag) */
export const springGentle = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

/** GSAP ease string equivalent to EASE_OUT_SMOOTH (custom curve name in GSAP) */
export const GSAP_EASE_OUT_SMOOTH = "power2.out";
