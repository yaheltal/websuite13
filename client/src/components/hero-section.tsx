import { useEffect, useRef, useCallback, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/magnetic-button";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

const Hero3DBackground = lazy(() => import("./hero-3d-background").then((m) => ({ default: m.Hero3DBackground })));

/** Animated counter — starts automatically after page load */
function AnimatedCounter({ target, suffix = "", duration = 2, delay = 0 }: { target: number; suffix?: string; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      delay: 1.8 + delay,
      ease: "power2.out",
      onUpdate: () => setCount(Math.round(obj.val)),
    });
  }, [target, duration, delay]);

  return <span>{count}{suffix}</span>;
}

const BRAND_WEB = "Web";
const BRAND_SUITE = "Suite";

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const brandCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const suitIconRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<gsap.core.Tween | null>(null);
  const { t, lang } = useI18n();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBrandHover = useCallback(() => {
    const brand = brandRef.current;
    if (!brand) return;

    gsap.to(brand, {
      scale: 1.08,
      letterSpacing: "0.15em",
      duration: 0.4,
      ease: "power2.out",
    });

    const chars = brandCharsRef.current.filter(Boolean) as HTMLSpanElement[];
    chars.forEach((char) => {
      char.style.backgroundImage = "linear-gradient(135deg, hsl(175 90% 62%), hsl(220 85% 75%), hsl(260 80% 72%), hsl(175 90% 62%))";
    });

    const suit = suitIconRef.current;
    if (suit) {
      gsap.to(suit, {
        scale: 1.12,
        rotateZ: 5,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const handleBrandLeave = useCallback(() => {
    const brand = brandRef.current;
    if (!brand) return;

    gsap.to(brand, {
      scale: 1,
      letterSpacing: "-0.03em",
      duration: 0.5,
      ease: "power2.out",
    });

    const chars = brandCharsRef.current.filter(Boolean) as HTMLSpanElement[];
    chars.forEach((char) => {
      char.style.backgroundImage = "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))";
    });

    const suit = suitIconRef.current;
    if (suit) {
      gsap.to(suit, {
        scale: 1,
        rotateZ: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const brand = brandRef.current;
    if (!section || !title || !brand) return;

    const bChars = brandCharsRef.current.filter(Boolean) as HTMLSpanElement[];

    const isMobile = window.innerWidth < 768;

    const chars: HTMLSpanElement[] = [];

    const ctx = gsap.context(() => {

      const tl = gsap.timeline({ delay: isMobile ? 0.2 : 0.5 });
      
      gsap.set(brand, { opacity: 1 });

      const suitIcon = suitIconRef.current;
      if (suitIcon) {
        gsap.set(suitIcon, { opacity: 0, scale: 0, rotateZ: -20 });
      }

      tl.fromTo(bChars,
        {
          opacity: 0,
          y: isMobile ? 50 : 80,
          rotateX: isMobile ? -60 : -90,
          rotateZ: () => gsap.utils.random(isMobile ? -8 : -15, isMobile ? 8 : 15),
          scale: isMobile ? 0.5 : 0.3,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
          duration: isMobile ? 0.7 : 0.9,
          stagger: isMobile ? 0.04 : 0.06,
          ease: "back.out(1.4)",
        },
        0
      );
      if (suitIcon) {
        tl.to(suitIcon, { opacity: 1, scale: 1, rotateZ: 0, duration: isMobile ? 0.5 : 0.7, ease: "back.out(2.5)" }, 0.15);
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: isMobile ? 0.6 : 0.9, ease: "expo.out" },
          "-=0.2"
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 25, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: isMobile ? 0.5 : 0.8, ease: "expo.out" },
          "-=0.4"
        );
      }

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: isMobile ? 0.5 : 0.8, ease: "power2.out" },
          "-=0.3"
        );
      }

      const runShimmer = () => {
        const stl = gsap.timeline({
          onComplete: () => {
            shimmerRef.current = gsap.delayedCall(isMobile ? 8 : 6, runShimmer);
          },
        });

        bChars.forEach((c, i) => {
          stl.to(c, {
            backgroundImage: "linear-gradient(135deg, hsl(175 90% 65%), hsl(220 90% 80%), hsl(260 80% 75%))",
            y: -4,
            duration: 0.15,
            ease: "power1.in",
          }, i * 0.05);
          stl.to(c, {
            backgroundImage: "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))",
            y: 0,
            duration: 0.25,
            ease: "power1.out",
          }, i * 0.05 + 0.15);
        });
      };

      tl.call(() => {
        shimmerRef.current = gsap.delayedCall(3, runShimmer);
      });

      gsap.to(brand, {
        y: isMobile ? "4px" : "6px",
        duration: isMobile ? 3.5 : 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    }, section);

    return () => {
      ctx.revert();
      if (shimmerRef.current) shimmerRef.current.kill();
    };
  }, [lang]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-20"
      style={{ minHeight: "min(100dvh, 900px)" }}
      data-testid="section-hero"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ contain: "strict" }}>
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "min(500px, 60vw)",
            height: "min(500px, 60vw)",
            top: "10%",
            right: "-10%",
            background: "radial-gradient(circle, hsla(220, 70%, 55%, 0.06) 0%, hsla(260, 60%, 48%, 0.015) 50%, transparent 70%)",
            filter: "blur(20px)",
            animation: "heroFloat 12s ease-in-out infinite",
            contain: "paint",
          }}
        />
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "min(400px, 50vw)",
            height: "min(400px, 50vw)",
            bottom: "5%",
            left: "-5%",
            background: "radial-gradient(circle, hsla(170, 60%, 50%, 0.05) 0%, hsla(170, 50%, 60%, 0.015) 50%, transparent 70%)",
            filter: "blur(18px)",
            animation: "heroFloat 15s ease-in-out infinite reverse",
            contain: "paint",
          }}
        />
      </div>

      <Suspense fallback={null}>
        <Hero3DBackground />
      </Suspense>

      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(hsl(220 15% 18% / 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <div
          ref={brandRef}
          dir="ltr"
          className="mb-3 sm:mb-4 mt-0 sm:mt-2 inline-flex items-end justify-center select-none cursor-pointer"
          style={{
            opacity: 0,
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
          onMouseEnter={handleBrandHover}
          onMouseLeave={handleBrandLeave}
          data-testid="text-hero-brand"
        >
          {BRAND_WEB.split("").map((char, i) => (
            <span
              key={`w${i}`}
              ref={(el) => { brandCharsRef.current[i] = el; }}
              className="font-black"
              style={{
                display: "inline-block",
                fontSize: "clamp(2rem, 10vw, 7rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                transformStyle: "preserve-3d",
              }}
            >
              {char}
            </span>
          ))}

          <svg
            ref={suitIconRef}
            viewBox="0 0 64 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block"
            style={{
              width: "clamp(2.2rem, 7.5vw, 5.2rem)",
              height: "clamp(2.6rem, 8.5vw, 6rem)",
              marginInline: "clamp(0.1rem, 0.5vw, 0.4rem)",
              marginBottom: "clamp(0.15rem, 0.4vw, 0.35rem)",
              filter: "drop-shadow(0 0 8px hsla(220, 80%, 60%, 0.15))",
            }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="suit-grad" x1="0" y1="0" x2="64" y2="72" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="hsl(220, 85%, 65%)" />
                <stop offset="50%" stopColor="hsl(250, 75%, 62%)" />
                <stop offset="100%" stopColor="hsl(175, 80%, 52%)" />
              </linearGradient>
              <linearGradient id="suit-lapel" x1="20" y1="10" x2="44" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="hsl(225, 80%, 72%)" />
                <stop offset="100%" stopColor="hsl(260, 70%, 60%)" />
              </linearGradient>
            </defs>

            <path
              d="M20 4 L10 18 L6 72 L28 72 L32 52 L36 72 L58 72 L54 18 L44 4 Z"
              fill="url(#suit-grad)"
              opacity="0.9"
            />

            <path
              d="M20 4 L10 18 L18 38 L32 20 Z"
              fill="url(#suit-lapel)"
              opacity="0.7"
            />
            <path
              d="M44 4 L54 18 L46 38 L32 20 Z"
              fill="url(#suit-lapel)"
              opacity="0.7"
            />

            <path
              d="M32 20 L28 28 L32 52 L36 28 Z"
              fill="hsl(220, 70%, 50%)"
              opacity="0.5"
            />

            <line x1="30" y1="28" x2="32" y2="24" stroke="hsl(175, 80%, 55%)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="28" x2="32" y2="24" stroke="hsl(175, 80%, 55%)" strokeWidth="2.5" strokeLinecap="round" />

            <circle cx="32" cy="34" r="1.8" fill="hsl(175, 80%, 55%)" />
            <circle cx="32" cy="42" r="1.8" fill="hsl(175, 80%, 55%)" />

            <path
              d="M20 4 Q24 0 32 0 Q40 0 44 4"
              stroke="hsl(220, 70%, 78%)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>

          {BRAND_SUITE.split("").map((char, i) => (
            <span
              key={`s${i}`}
              ref={(el) => { brandCharsRef.current[BRAND_WEB.length + i] = el; }}
              className="font-black"
              style={{
                display: "inline-block",
                fontSize: "clamp(2rem, 10vw, 7rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                transformStyle: "preserve-3d",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <h1
          ref={titleRef}
          key={lang}
          className="sr-only"
          data-testid="text-hero-title"
        >
          WebSuite
        </h1>

        <p
          ref={subtitleRef}
          className="text-charcoal-light max-w-[90vw] sm:max-w-xl md:max-w-2xl mx-auto mb-5 sm:mb-7 md:mb-8 text-center"
          style={{ opacity: 0, fontSize: "clamp(0.95rem, 2.2vw, 1.25rem)", lineHeight: 1.7 }}
          data-testid="text-hero-subtitle"
        >
          {t("hero.subtitle")}
          <br className="sm:hidden" />
          <span className="font-extrabold text-foreground inline-block mt-1 sm:mt-0 sm:inline" style={{
            background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{" "}{t("hero.subtitle.highlight")}</span>
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto"
          style={{ opacity: 0 }}
        >
          <Link href="/onboarding" className="inline-block w-full sm:w-auto">
            <MagneticButton
              as="span"
              strength={0.25}
              className="inline-block w-full"
            >
              <Button
                size="lg"
                className="text-white font-extrabold text-base px-8 py-3 min-h-[48px] border-0 shadow-lg w-full sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))",
                }}
                data-testid="button-hero-cta"
                data-cursor-hover
              >
                {t("hero.cta")}
              </Button>
            </MagneticButton>
          </Link>
          <MagneticButton
            as="button"
            strength={0.2}
            className="inline-block w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#services")}
              className="font-semibold text-base px-8 py-3 min-h-[48px] border-border text-foreground w-full sm:w-auto"
              data-testid="button-hero-services"
              data-cursor-hover
            >
              {t("hero.services")}
            </Button>
          </MagneticButton>
        </div>

        <div
          ref={statsRef}
          className="flex items-center justify-center gap-12 sm:gap-16 md:gap-20 mt-6 sm:mt-10 md:mt-14"
          style={{ opacity: 0 }}
        >
          {[
            { target: 100, suffix: "+", label: t("hero.stat.projects"), duration: 2.2, delay: 0 },
            { target: 6, suffix: "+", label: t("hero.stat.experience"), duration: 1.5, delay: 0.3 },
            { target: 90, suffix: "%", label: t("hero.stat.retention"), duration: 2, delay: 0.6 },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center flex flex-col items-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{
                background: "linear-gradient(135deg, hsl(220 80% 65%), hsl(170 80% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix} duration={stat.duration} delay={stat.delay} />
              </p>
              <p className="text-[11px] sm:text-xs text-charcoal-light mt-1 whitespace-nowrap">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-40 bg-gradient-to-t from-[hsl(var(--background))] to-transparent pointer-events-none opacity-90" />
    </section>
  );
}
