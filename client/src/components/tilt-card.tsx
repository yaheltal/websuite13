import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function TiltCard({ children, className = "", glowColor = "hsla(220, 75%, 58%, 0.15)" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setHovered(true);
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (e.clientX - rect.left) / rect.width;
    const percentY = (e.clientY - rect.top) / rect.height;
    const rotateX = (centerY - e.clientY) * 0.03;
    const rotateY = (e.clientX - centerX) * 0.03;
    setTransform({ rotateX, rotateY });
    setGlow({ x: percentX * 100, y: percentY * 100 });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setGlow({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative rounded-2xl overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        transition: "transform 0.15s ease-out",
      }}
    >
      {/* Mouse-follow glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 120px at ${glow.x}% ${glow.y}%, ${glowColor}, transparent 70%)`,
          transition: "background 0.1s ease-out",
        }}
        aria-hidden
      />
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
