import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  /** Max tilt angle in degrees (default 12) */
  tiltMax?: number;
  /** Perspective distance in px (default 800) */
  perspective?: number;
  /** Glare overlay (default true) */
  glare?: boolean;
}

export function TiltCard({
  children,
  className = "",
  glowColor = "hsla(220, 75%, 58%, 0.15)",
  tiltMax = 12,
  perspective = 800,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setHovered(true);
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const percentX = (e.clientX - rect.left) / rect.width; // 0..1
      const percentY = (e.clientY - rect.top) / rect.height; // 0..1

      // Map to tilt angles
      const rotateX = (0.5 - percentY) * tiltMax * 2;
      const rotateY = (percentX - 0.5) * tiltMax * 2;

      targetRef.current = {
        rotateX,
        rotateY,
        glowX: percentX * 100,
        glowY: percentY * 100,
      };

      // Use rAF for smooth interpolation
      if (!rafRef.current) {
        const animate = () => {
          setTransform((prev) => ({
            rotateX: prev.rotateX + (targetRef.current.rotateX - prev.rotateX) * 0.15,
            rotateY: prev.rotateY + (targetRef.current.rotateY - prev.rotateY) * 0.15,
          }));
          setGlow((prev) => ({
            x: prev.x + (targetRef.current.glowX - prev.x) * 0.15,
            y: prev.y + (targetRef.current.glowY - prev.y) * 0.15,
          }));
          rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [tiltMax]
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    targetRef.current = { rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 };

    // Animate back smoothly
    const animateBack = () => {
      setTransform((prev) => {
        const newX = prev.rotateX + (0 - prev.rotateX) * 0.1;
        const newY = prev.rotateY + (0 - prev.rotateY) * 0.1;
        if (Math.abs(newX) < 0.1 && Math.abs(newY) < 0.1) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
          return { rotateX: 0, rotateY: 0 };
        }
        rafRef.current = requestAnimationFrame(animateBack);
        return { rotateX: newX, rotateY: newY };
      });
      setGlow((prev) => ({
        x: prev.x + (50 - prev.x) * 0.1,
        y: prev.y + (50 - prev.y) * 0.1,
      }));
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animateBack);
  }, []);

  // Dynamic shadow based on tilt
  const shadowX = -transform.rotateY * 1.2;
  const shadowY = transform.rotateX * 1.2;
  const shadowBlur = 20 + Math.abs(transform.rotateX + transform.rotateY) * 1.5;
  const shadowSpread = hovered ? 4 : 0;
  const dynamicShadow = hovered
    ? `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0,0,0,0.12), 0 0 30px -5px ${glowColor}`
    : "0 4px 12px rgba(0,0,0,0.06)";

  // Glare angle follows cursor
  const glareAngle = Math.atan2(glow.y - 50, glow.x - 50) * (180 / Math.PI) + 90;
  const glareIntensity = hovered ? 0.15 : 0;

  return (
    <motion.div
      ref={ref}
      className={cn("relative rounded-2xl overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: hovered ? "none" : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: dynamicShadow,
          willChange: "transform",
        }}
      >
        {/* Mouse-follow glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-20"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle 180px at ${glow.x}% ${glow.y}%, ${glowColor}, transparent 70%)`,
          }}
          aria-hidden
        />

        {/* Specular glare overlay */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl z-30 transition-opacity duration-300"
            style={{
              opacity: glareIntensity,
              background: `linear-gradient(${glareAngle}deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)`,
              mixBlendMode: "overlay",
            }}
            aria-hidden
          />
        )}

        {/* Card content with 3D lift */}
        <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
