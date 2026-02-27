import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    const textEl = textRef.current;
    const container = logoContainerRef.current;
    if (!svg || !textEl || !container) return;

    const paths: SVGGeometryElement[] = [];
    svg.querySelectorAll("[data-logo-path]").forEach((el) => {
      if ("getTotalLength" in el && typeof (el as SVGGeometryElement).getTotalLength === "function") {
        const p = el as SVGGeometryElement;
        const length = p.getTotalLength();
        p.style.strokeDasharray = `${length}`;
        p.style.strokeDashoffset = `${length}`;
        paths.push(p);
      }
    });

    const fills = svg.querySelectorAll("[data-logo-fill]");
    fills.forEach((el) => {
      (el as SVGElement).style.opacity = "0";
    });

    const originalText = textEl.textContent || "";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(container, {
        opacity: 1,
        duration: 0.01,
      }, 0);

      if (paths.length > 0) {
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 1.4,
          stagger: 0.15,
          ease: "power3.inOut",
        }, 0.2);
      }

      tl.to(fills, {
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }, 0.9);

      const textChars: HTMLSpanElement[] = [];
      textEl.textContent = "";
      originalText.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(12px)";
        textEl.appendChild(span);
        textChars.push(span);
      });

      tl.to(textChars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.out",
      }, 0.8);
    });

    return () => {
      ctx.revert();
      textEl.textContent = originalText;
    };
  }, []);

  useEffect(() => {
    const container = logoContainerRef.current;
    if (!container) return;

    if (isHovered) {
      gsap.to(container, {
        scale: 1.05,
        rotateY: 8,
        rotateX: -3,
        duration: 0.5,
        ease: "power2.out",
        force3D: true,
      });
    } else {
      gsap.to(container, {
        scale: 1,
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
      });
    }
  }, [isHovered]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{ zIndex: 999 }}
      data-testid="site-header"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* =====================================================
            LOGO PLACEHOLDER — Replace with your own logo
            To swap in your logo:
            1. Replace the <svg> below with your own SVG or <img> tag
            2. For an <img>, use: <img src="/your-logo.png" alt="WEB13" className="h-8 sm:h-10" />
            3. Keep the container div and its hover/animation wrappers
            ===================================================== */}
        <div
          ref={logoContainerRef}
          className="pointer-events-auto cursor-pointer"
          style={{ opacity: 0, perspective: "600px", transformStyle: "preserve-3d" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            const hero = document.querySelector("#hero");
            if (hero) hero.scrollIntoView({ behavior: "smooth" });
          }}
          data-testid="header-logo"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 select-none">
            {/* SVG Logo Mark — Replace this SVG with your own */}
            <svg
              ref={svgRef}
              viewBox="0 0 48 48"
              className="w-10 h-10 sm:w-12 sm:h-12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="WEB13 Logo"
            >
              <rect
                data-logo-path
                x="2"
                y="2"
                width="44"
                height="44"
                rx="12"
                stroke="url(#logo-gradient)"
                strokeWidth="2.5"
                fill="none"
              />

              <path
                data-logo-path
                d="M14 18 L18 30 L22 22 L26 30 L30 18"
                stroke="url(#logo-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              <text
                data-logo-fill
                x="34"
                y="31"
                fontSize="14"
                fontWeight="800"
                fill="url(#logo-gradient)"
                textAnchor="middle"
                fontFamily="Assistant, sans-serif"
              >
                13
              </text>

              <circle
                data-logo-fill
                cx="38"
                cy="12"
                r="3"
                fill="hsl(170 80% 50%)"
                opacity="0"
              />

              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="hsl(220 80% 65%)" />
                  <stop offset="50%" stopColor="hsl(260 70% 65%)" />
                  <stop offset="100%" stopColor="hsl(170 80% 50%)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Logo Text — Replace or remove if using a full image logo */}
            <span
              ref={textRef}
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{
                background: "linear-gradient(135deg, hsl(220 80% 70%), hsl(260 70% 70%), hsl(170 80% 55%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              WEB13
            </span>
          </div>
        </div>
        {/* =====================================================
            END LOGO PLACEHOLDER
            ===================================================== */}
      </div>
    </header>
  );
}
