import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT_SMOOTH, DURATION, VIEWPORT_AMOUNT } from "@/lib/igloo-motion";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Width/height to avoid layout shift (e.g. "400" or "100%" for width) */
  width?: number | string;
  height?: number | string;
  /** Viewport amount 0–1 */
  amount?: number;
  once?: boolean;
}

/**
 * Editorial-style image reveal: scale 1.1 → 1.0 while moving into view.
 * GPU-accelerated (will-change: transform), overflow hidden to prevent layout shift.
 */
export function ImageReveal({
  src,
  alt,
  className = "",
  imgClassName = "",
  width,
  height,
  amount = VIEWPORT_AMOUNT,
  once = true,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once });

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden", className)}
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, scale: 1.1, y: 20 }}
        animate={
          inView
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 1.1, y: 20 }
        }
        transition={{
          duration: DURATION.slow,
          ease: EASE_OUT_SMOOTH,
        }}
        style={{ willChange: "transform" }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn("h-full w-full object-cover", imgClassName)}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
