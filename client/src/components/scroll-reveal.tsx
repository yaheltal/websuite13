import { motion } from "framer-motion";
import {
  EASE_OUT_SMOOTH,
  VIEWPORT_AMOUNT,
  revealWithStagger,
} from "@/lib/igloo-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds (e.g. index * 0.1 for row items) */
  staggerDelay?: number;
  /** Subtle 3D entrance: rotateX 10deg, y 30, opacity 0 → natural (GPU-accelerated) */
  use3D?: boolean;
}

/**
 * Scroll-triggered reveal: fade + slide up (optionally with rotateX for 3D feel).
 * Uses useInView via whileInView; GPU-accelerated (will-change: transform); no layout shift.
 */
export function ScrollReveal({
  children,
  className = "",
  staggerDelay = 0,
  use3D = false,
}: ScrollRevealProps) {
  const initial = use3D
    ? { opacity: 0, y: 30, rotateX: 10 }
    : { opacity: 0, y: 20 };
  const animate = use3D
    ? { opacity: 1, y: 0, rotateX: 0 }
    : { opacity: 1, y: 0 };

  const content = (
    <motion.div
      className={cn(!use3D && className)}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: VIEWPORT_AMOUNT }}
      transition={revealWithStagger(staggerDelay)}
      style={{
        willChange: "transform",
        ...(use3D
          ? {
              transformStyle: "preserve-3d" as const,
              backfaceVisibility: "hidden" as const,
            }
          : {}),
      }}
    >
      {children}
    </motion.div>
  );

  if (use3D) {
    return (
      <div className={cn(className)} style={{ perspective: 800 }}>
        {content}
      </div>
    );
  }
  return content;
}
