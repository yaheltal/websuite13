import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  sensitivity?: number;
}

export function MouseTrackingElement({ children, className = "", sensitivity = 0.02 }: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * sensitivity;
      const deltaY = (e.clientY - centerY) * sensitivity;
      setOffset({ x: deltaX, y: deltaY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sensitivity]);

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
    >
      {children}
    </motion.div>
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = elementCenter - viewportCenter;
      setScrollY(distance * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ y: scrollY }}
        transition={{ type: "tween", duration: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
