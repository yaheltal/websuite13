import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  EASE_OUT_SMOOTH,
  DURATION,
  VIEWPORT_AMOUNT,
} from "@/lib/igloo-motion";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  amount?: number;
  once?: boolean;
  yOffset?: number;
}

const directionOffset = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { y: 0, x: 24 },
  right: { y: 0, x: -24 },
};

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  amount = VIEWPORT_AMOUNT,
  once = true,
  yOffset = 24,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once });
  const offset = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
            }
          : undefined
      }
      transition={{
        duration: DURATION.normal,
        delay,
        ease: EASE_OUT_SMOOTH,
      }}
    >
      {children}
    </motion.div>
  );
}
