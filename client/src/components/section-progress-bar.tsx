import { RefObject } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

interface SectionProgressBarProps {
  /** Ref to the section element whose scroll progress we track */
  sectionRef: RefObject<HTMLElement | null>;
  className?: string;
  barClassName?: string;
  /** Vertical (fills top-to-bottom) or horizontal (left-to-right) */
  orientation?: "vertical" | "horizontal";
}

/**
 * Igloo-style progress bar that fills as the user scrolls through the section.
 * Pass the section's ref so progress 0→1 as the section scrolls through the viewport.
 */
export function SectionProgressBar({
  sectionRef,
  className,
  barClassName,
  orientation = "vertical",
}: SectionProgressBarProps) {
  const progress = useScrollProgress(sectionRef);

  return (
    <div
      className={cn("absolute pointer-events-none", className)}
      aria-hidden
    >
      <div
        className={cn(
          "overflow-hidden rounded-full bg-foreground/10",
          orientation === "vertical" && "h-full w-[3px] min-h-[80px]",
          orientation === "horizontal" && "w-full h-1",
          barClassName
        )}
      >
        <div
          className={cn(
            "rounded-full bg-primary/70 transition-transform duration-[150ms]",
            orientation === "vertical" && "h-full w-full origin-top",
            orientation === "horizontal" && "h-full w-full origin-left"
          )}
          style={{
            ...(orientation === "vertical"
              ? { transform: `scaleY(${progress})` }
              : { transform: `scaleX(${progress})` }),
          }}
        />
      </div>
    </div>
  );
}
