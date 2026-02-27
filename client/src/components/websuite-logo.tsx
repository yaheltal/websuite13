import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface WebSuiteLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
  gradientId?: string;
}

export function WebSuiteLogo({
  size = 48,
  className = "",
  animate = false,
  gradientId = "wsl",
}: WebSuiteLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animate || !svgRef.current) return;

    const svg = svgRef.current;
    const frame = svg.querySelector("[data-logo-frame]") as SVGRectElement;
    const wPath = svg.querySelector("[data-logo-w]") as SVGPathElement;
    const oneThree = svg.querySelectorAll("[data-logo-digit]");
    const dot = svg.querySelector("[data-logo-dot]") as SVGCircleElement;
    const glow = svg.querySelector("[data-logo-glow]") as SVGRectElement;

    if (!frame || !wPath) return;

    const frameLen = frame.getTotalLength?.() || 600;
    const wLen = wPath.getTotalLength?.() || 200;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      gsap.set(svg, { opacity: 1 });

      gsap.set(frame, {
        strokeDasharray: frameLen,
        strokeDashoffset: frameLen,
        opacity: 1,
      });
      gsap.set(wPath, {
        strokeDasharray: wLen,
        strokeDashoffset: wLen,
        opacity: 1,
      });
      gsap.set(oneThree, { opacity: 0, y: 6 });
      if (dot) gsap.set(dot, { opacity: 0, scale: 0, transformOrigin: "center" });
      if (glow) gsap.set(glow, { opacity: 0 });

      tl.to(frame, {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut",
      }, 0);

      if (glow) {
        tl.to(glow, { opacity: 0.08, duration: 0.5 }, 0.3);
      }

      tl.to(wPath, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 0.35);

      tl.to(oneThree, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.08,
        ease: "back.out(2)",
      }, 0.6);

      if (dot) {
        tl.to(dot, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(3)",
        }, 0.85);
      }
    });

    return () => ctx.revert();
  }, [animate]);

  const g1 = `${gradientId}-main`;
  const g2 = `${gradientId}-fill`;
  const g3 = `${gradientId}-glow`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={animate ? { opacity: 0 } : undefined}
      aria-label="WebSuite Logo"
      role="img"
    >
      <defs>
        <linearGradient id={g1} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(220, 85%, 62%)" />
          <stop offset="45%" stopColor="hsl(265, 75%, 60%)" />
          <stop offset="100%" stopColor="hsl(175, 80%, 50%)" />
        </linearGradient>
        <linearGradient id={g2} x1="20" y1="30" x2="100" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(225, 85%, 65%)" />
          <stop offset="50%" stopColor="hsl(260, 78%, 62%)" />
          <stop offset="100%" stopColor="hsl(180, 75%, 52%)" />
        </linearGradient>
        <radialGradient id={g3} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(260, 80%, 70%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(260, 80%, 70%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        data-logo-glow
        x="8" y="8" width="104" height="104" rx="26"
        fill={`url(#${g3})`}
        opacity="0.08"
      />

      <rect
        data-logo-frame
        x="8" y="8" width="104" height="104" rx="26"
        stroke={`url(#${g1})`}
        strokeWidth="3.5"
        fill="none"
      />

      <path
        data-logo-w
        d="M28 42 L40 82 L52 58 L64 82 L76 42"
        stroke={`url(#${g2})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <text
        data-logo-digit
        x="95" y="58"
        fontSize="16"
        fontWeight="800"
        fill={`url(#${g2})`}
        textAnchor="middle"
        fontFamily="Assistant, system-ui, sans-serif"
        letterSpacing="-0.5"
      >
        1
      </text>
      <text
        data-logo-digit
        x="95" y="82"
        fontSize="22"
        fontWeight="800"
        fill={`url(#${g2})`}
        textAnchor="middle"
        fontFamily="Assistant, system-ui, sans-serif"
        letterSpacing="-0.5"
      >
        3
      </text>

      <circle
        data-logo-dot
        cx="100" cy="24"
        r="5"
        fill="hsl(175, 80%, 50%)"
      />
    </svg>
  );
}
