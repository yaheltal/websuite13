import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BRAND_TEXT = "WebSuite";

/**
 * A scroll-triggered animation that "builds" the WebSuite brand name
 * as the user scrolls past the hero section. Letters assemble from particles,
 * scale in with rotation, and glow with energy.
 */
export function ScrollBrandReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const line = lineRef.current;
    const glow = glowRef.current;

    const ctx = gsap.context(() => {
      // Main scroll-driven timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "top 20%",
          scrub: 0.8,
        },
      });

      // Each letter assembles: scattered → centered with stagger
      letters.forEach((letter, i) => {
        const isLeft = i < BRAND_TEXT.length / 2;
        const randomAngle = (Math.random() - 0.5) * 120;
        const randomY = (Math.random() - 0.5) * 200;
        const randomX = isLeft ? -200 - Math.random() * 150 : 200 + Math.random() * 150;

        gsap.set(letter, {
          x: randomX,
          y: randomY,
          rotateZ: randomAngle,
          rotateX: -60 + Math.random() * 40,
          rotateY: (Math.random() - 0.5) * 90,
          scale: 0,
          opacity: 0,
          filter: "blur(20px)",
        });

        tl.to(
          letter,
          {
            x: 0,
            y: 0,
            rotateZ: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "back.out(1.2)",
          },
          i * 0.06
        );
      });

      // Underline swoosh
      if (line) {
        tl.fromTo(
          line,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.4, ease: "power3.out" },
          0.35
        );
      }

      // Glow pulse
      if (glow) {
        tl.fromTo(
          glow,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
          0.2
        );
      }

      // After assembly: idle shimmer animation
      ScrollTrigger.create({
        trigger: container,
        start: "top 20%",
        onEnter: () => {
          const shimmerTl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
          letters.forEach((letter, i) => {
            shimmerTl.to(
              letter,
              {
                textShadow:
                  "0 0 40px hsla(220, 85%, 65%, 0.6), 0 0 80px hsla(260, 75%, 60%, 0.3), 0 0 120px hsla(175, 80%, 55%, 0.15)",
                duration: 0.15,
                ease: "power1.in",
              },
              i * 0.04
            );
            shimmerTl.to(
              letter,
              {
                textShadow:
                  "0 0 20px hsla(220, 80%, 60%, 0.15), 0 0 0px hsla(260, 70%, 55%, 0)",
                duration: 0.25,
                ease: "power1.out",
              },
              i * 0.04 + 0.15
            );
          });
        },
        once: true,
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center py-16 md:py-24"
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      {/* Background glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsla(220, 80%, 60%, 0.08) 0%, hsla(260, 70%, 55%, 0.04) 40%, transparent 70%)",
          opacity: 0,
        }}
      />

      {/* Brand letters */}
      <div
        dir="ltr"
        className="relative flex items-center justify-center select-none"
        style={{
          transformStyle: "preserve-3d",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {BRAND_TEXT.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              lettersRef.current[i] = el;
            }}
            className="inline-block font-black"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 9rem)",
              lineHeight: 1,
              background:
                "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              willChange: "transform, opacity, filter",
              transformStyle: "preserve-3d",
              textShadow:
                "0 0 20px hsla(220, 80%, 60%, 0.15)",
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Animated underline */}
      <div
        ref={lineRef}
        className="mt-3"
        style={{
          width: "clamp(120px, 30vw, 300px)",
          height: "3px",
          background:
            "linear-gradient(90deg, transparent, hsl(220 80% 60%), hsl(260 70% 58%), hsl(175 80% 50%), transparent)",
          borderRadius: "2px",
          transformOrigin: "center",
          opacity: 0,
        }}
      />
    </div>
  );
}
