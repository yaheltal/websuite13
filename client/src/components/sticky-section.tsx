import { type ReactNode } from "react";

interface StickySectionProps {
  /** Content that stays fixed (e.g. a headline or visual) */
  stickyContent: ReactNode;
  /** Content that scrolls over it (e.g. cards or steps) */
  children: ReactNode;
  className?: string;
  stickyClassName?: string;
}

/**
 * Creates a "sticky" section where one part stays fixed while inner content scrolls.
 * Similar to Igloo's product showcase: the sticky area stays in view while items scroll past.
 */
export function StickySection({
  stickyContent,
  children,
  className = "",
  stickyClassName = "",
}: StickySectionProps) {
  return (
    <section className={`relative ${className}`}>
      <div className="sticky top-0 min-h-[60vh] flex items-center justify-center py-20 z-0">
        <div className={stickyClassName}>{stickyContent}</div>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
