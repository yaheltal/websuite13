import { useEffect, useRef } from "react";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  sensitivity?: number;
}

export function MouseTrackingElement({ children, className = "", sensitivity = 0.02 }: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * sensitivity;
      const dy = (e.clientY - centerY) * sensitivity;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sensitivity]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 0.3s ease-out", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

export function FloatingShape({
  className = "",
  variant = "circle",
  size = "md",
  animation = "float",
}: {
  className?: string;
  variant?: "circle" | "square" | "diamond" | "ring";
  size?: "sm" | "md" | "lg";
  animation?: "float" | "float-slow" | "float-reverse";
}) {
  const sizeMap = {
    sm: "w-12 h-12 md:w-16 md:h-16",
    md: "w-20 h-20 md:w-28 md:h-28",
    lg: "w-28 h-28 md:w-40 md:h-40",
  };

  const variantClasses = {
    circle: "rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10",
    square: "rounded-xl bg-gradient-to-br from-purple-500/8 to-blue-500/5 rotate-12",
    diamond: "rounded-lg bg-gradient-to-br from-blue-500/8 to-cyan-500/10 rotate-45",
    ring: "rounded-full border-2 border-blue-500/15",
  };

  const animationClasses = {
    float: "animate-float",
    "float-slow": "animate-float-slow",
    "float-reverse": "animate-float-reverse",
  };

  return (
    <div
      className={`absolute pointer-events-none ${animationClasses[animation]} ${sizeMap[size]} ${variantClasses[variant]} ${className}`}
    />
  );
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const container = ref.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const distance = elementCenter - viewportCenter;
        inner.style.transform = `translate3d(0, ${distance * speed}px, 0)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
