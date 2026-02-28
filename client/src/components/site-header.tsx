import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WebSuiteLogo } from "./websuite-logo";
import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

const BRAND_NAME = "WebSuite";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shimmerTimerRef = useRef<gsap.core.Tween | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { lang, setLang } = useI18n();

  useEffect(() => {
    const container = logoContainerRef.current;
    const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || chars.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(container, { opacity: 1, duration: 0.01 }, 0);

      tl.fromTo(chars,
        { opacity: 0, y: 30, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "back.out(1.8)",
        },
        0.9
      );

      const runShimmer = () => {
        const stl = gsap.timeline({
          onComplete: () => {
            shimmerTimerRef.current = gsap.delayedCall(5, runShimmer);
          },
        });

        chars.forEach((char, i) => {
          stl.to(char, {
            backgroundImage: "linear-gradient(135deg, hsl(175 90% 68%), hsl(220 90% 82%), hsl(260 80% 78%))",
            textShadow: "0 0 20px hsla(175, 80%, 55%, 0.3)",
            duration: 0.12,
            ease: "power1.in",
          }, i * 0.04);
          stl.to(char, {
            backgroundImage: "linear-gradient(135deg, hsl(220 80% 72%), hsl(260 72% 72%), hsl(175 80% 58%))",
            textShadow: "0 0 0px hsla(175, 80%, 55%, 0)",
            duration: 0.2,
            ease: "power1.out",
          }, i * 0.04 + 0.12);
        });
      };

      tl.call(() => {
        shimmerTimerRef.current = gsap.delayedCall(2.5, runShimmer);
      });
    });

    return () => {
      ctx.revert();
      if (shimmerTimerRef.current) shimmerTimerRef.current.kill();
    };
  }, []);

  useEffect(() => {
    const container = logoContainerRef.current;
    if (!container) return;

    if (isHovered) {
      gsap.to(container, {
        scale: 1.04,
        rotateY: 6,
        rotateX: -2,
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

  useEffect(() => {
    const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (chars.length === 0) return;
    const mid = (chars.length - 1) / 2;

    if (isHovered) {
      chars.forEach((char, i) => {
        const offset = (i - mid) * 1.5;
        gsap.to(char, {
          x: offset,
          duration: 0.4,
          ease: "power2.out",
        });
        char.style.backgroundImage = "linear-gradient(135deg, hsl(175 85% 62%), hsl(220 85% 78%), hsl(260 80% 75%), hsl(175 85% 62%))";
      });
    } else {
      chars.forEach((char) => {
        gsap.to(char, {
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        });
        char.style.backgroundImage = "linear-gradient(135deg, hsl(220 80% 72%), hsl(260 72% 72%), hsl(175 80% 58%))";
      });
    }
  }, [isHovered]);

  const toggleLang = () => setLang(lang === "he" ? "en" : "he");

  return (
    <header
      ref={headerRef}
      dir="ltr"
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{ zIndex: 999 }}
      data-testid="site-header"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-transparent pointer-events-none site-header-bg" />
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
            <WebSuiteLogo size={48} animate={true} gradientId="hdr" className="w-10 h-10 sm:w-12 sm:h-12" />
            <span
              className="font-extrabold tracking-tight inline-flex"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)" }}
              data-testid="text-brand-name"
              aria-label="WebSuite"
            >
              {BRAND_NAME.split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el) => { charRefs.current[i] = el; }}
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, hsl(220 80% 72%), hsl(260 72% 72%), hsl(175 80% 58%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    willChange: "transform, opacity",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
        </div>

        <button
          onClick={toggleLang}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold glass-luxury text-foreground/95"
          data-cursor-hover
          data-testid="button-lang-toggle"
          aria-label={lang === "he" ? "Switch to English" : "Switch to Hebrew"}
        >
          <Globe className="w-4 h-4" />
          <span>{lang === "he" ? "English" : "עברית"}</span>
        </button>
      </div>
    </header>
  );
}
