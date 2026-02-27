import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const logoImg = logoImgRef.current;
    const textEl = textRef.current;
    const container = logoContainerRef.current;
    if (!logoImg || !textEl || !container) return;

    const originalText = textEl.textContent || "";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(container, { opacity: 1, duration: 0.01 }, 0);

      tl.fromTo(
        logoImg,
        { scale: 0.6, opacity: 0, rotation: -15 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
        0.2
      );

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
      }, 0.6);
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
            <img
              ref={logoImgRef}
              src="/logo-w13.png"
              alt="WEB13"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              style={{ opacity: 0 }}
              draggable={false}
            />
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
      </div>
    </header>
  );
}
