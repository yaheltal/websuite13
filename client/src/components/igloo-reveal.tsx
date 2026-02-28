import { motion } from "framer-motion";
import {
  EASE_OUT_SMOOTH,
  EASE_OUT_BACK,
  DURATION,
  VIEWPORT_AMOUNT,
  STAGGER_STEP,
  revealWithStagger,
} from "@/lib/igloo-motion";
import { cn } from "@/lib/utils";

type Variant = "fadeUp" | "fadeScale" | "fadeBlur" | "fadeSlide" | "reveal3d";

const variantInitial: Record<Variant, Record<string, unknown>> = {
  fadeUp: { opacity: 0, y: 20 },
  fadeScale: { opacity: 0, scale: 0.96, y: 12 },
  fadeBlur: { opacity: 0, y: 16, filter: "blur(8px)" },
  fadeSlide: { opacity: 0, x: -24 },
  reveal3d: { opacity: 0, y: 30, rotateX: 10 },
};

const variantAnimate: Record<Variant, Record<string, unknown>> = {
  fadeUp: { opacity: 1, y: 0 },
  fadeScale: { opacity: 1, scale: 1, y: 0 },
  fadeBlur: { opacity: 1, y: 0, filter: "blur(0px)" },
  fadeSlide: { opacity: 1, x: 0 },
  reveal3d: { opacity: 1, y: 0, rotateX: 0 },
};

export interface IglooRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variant */
  variant?: Variant;
  /** Stagger delay in seconds (e.g. index * STAGGER_STEP) */
  staggerDelay?: number;
  /** Viewport amount 0–1 (default from igloo-motion) */
  amount?: number;
  /** Run once (default true) */
  once?: boolean;
  /** Slightly longer duration for big blocks */
  slow?: boolean;
}

/**
 * Igloo-style scroll reveal: one config, multiple variants. Uses shared
 * easing and duration from igloo-motion. Fade + slide up by default.
 */
export function IglooReveal({
  children,
  className = "",
  variant = "fadeUp",
  staggerDelay = 0,
  amount = VIEWPORT_AMOUNT,
  once = true,
  slow = false,
}: IglooRevealProps) {
  const duration = slow ? DURATION.slow : DURATION.normal;
  const ease = variant === "fadeScale" ? EASE_OUT_BACK : EASE_OUT_SMOOTH;

  const needs3D = variant === "reveal3d";

  return (
    <motion.div
      className={cn(className)}
      initial={variantInitial[variant] as React.ComponentProps<typeof motion.div>["initial"]}
      whileInView={variantAnimate[variant] as React.ComponentProps<typeof motion.div>["whileInView"]}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay: staggerDelay,
        ease,
      }}
      style={{
        willChange: "transform",
        ...(needs3D
          ? { transformStyle: "preserve-3d" as const, backfaceVisibility: "hidden" as const }
          : {}),
      }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger step for row items (use index * STAGGER_STEP as staggerDelay) */
export { STAGGER_STEP };
