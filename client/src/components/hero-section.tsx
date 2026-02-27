import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { CodeRainBg } from "./code-rain-bg";

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

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const brand = brandRef.current;
    if (!section || !title || !brand) return;

    const bChars = brandCharsRef.current.filter(Boolean) as HTMLSpanElement[];

    const lines = title.querySelectorAll("[data-hero-line]");
    const chars: HTMLSpanElement[] = [];
    lines.forEach((line) => {
      const text = line.textContent || "";
      line.textContent = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(100%)";
        line.appendChild(span);
        chars.push(span);
      });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      gsap.set(brand, { opacity: 1 });

      const suitIcon = suitIconRef.current;
      if (suitIcon) {
        gsap.set(suitIcon, { opacity: 0, scale: 0, rotateZ: -20 });
      }

      tl.fromTo(bChars,
        {
          opacity: 0,
          y: 80,
          rotateX: -90,
          rotateZ: () => gsap.utils.random(-15, 15),
          scale: 0.3,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: "back.out(1.4)",
        },
        0
      );

      if (suitIcon) {
        tl.to(suitIcon, {
          opacity: 1,
          scale: 1,
          rotateZ: 0,
          duration: 0.7,
          ease: "back.out(2.5)",
        }, 0.2);
      }

      tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: "power3.out",
      }, 0.55);

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "-=0.2"
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "-=0.4"
        );
      }

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        );
      }

      const runShimmer = () => {
        const stl = gsap.timeline({
          onComplete: () => {
            shimmerRef.current = gsap.delayedCall(4, runShimmer);
          },
        });

        bChars.forEach((c, i) => {
          stl.to(c, {
            backgroundImage: "linear-gradient(135deg, hsl(175 90% 65%), hsl(220 90% 80%), hsl(260 80% 75%))",
            textShadow: "0 0 40px hsla(220, 80%, 60%, 0.5), 0 0 80px hsla(260, 70%, 55%, 0.2)",
            y: -4,
            duration: 0.15,
            ease: "power1.in",
          }, i * 0.05);
          stl.to(c, {
            backgroundImage: "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))",
            textShadow: "0 0 20px hsla(220, 80%, 60%, 0.15), 0 0 0px hsla(260, 70%, 55%, 0)",
            y: 0,
            duration: 0.25,
            ease: "power1.out",
          }, i * 0.05 + 0.15);
        });
      };

      tl.call(() => {
        shimmerRef.current = gsap.delayedCall(2, runShimmer);
      });

      gsap.to(brand, {
        y: "6px",
        duration: 3,
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
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "100dvh", minHeight: "600px" }}
      data-testid="section-hero"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "min(700px, 80vw)",
            height: "min(700px, 80vw)",
            top: "10%",
            right: "-10%",
            background: "radial-gradient(circle, hsla(220, 70%, 55%, 0.08) 0%, hsla(260, 60%, 48%, 0.02) 50%, transparent 70%)",
            filter: "blur(60px)",
            animation: "heroFloat 12s ease-in-out infinite",
          }}
        />
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "min(500px, 60vw)",
            height: "min(500px, 60vw)",
            bottom: "5%",
            left: "-5%",
            background: "radial-gradient(circle, hsla(170, 60%, 50%, 0.06) 0%, hsla(170, 50%, 60%, 0.02) 50%, transparent 70%)",
            filter: "blur(50px)",
            animation: "heroFloat 15s ease-in-out infinite reverse",
          }}
        />
        <div
          className="hero-orb absolute rounded-full"
          style={{
            width: "min(350px, 45vw)",
            height: "min(350px, 45vw)",
            top: "40%",
            left: "30%",
            background: "radial-gradient(circle, hsla(260, 50%, 60%, 0.05) 0%, transparent 60%)",
            filter: "blur(40px)",
            animation: "heroFloat 18s ease-in-out infinite 3s",
          }}
        />
      </div>

      <CodeRainBg />

      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(hsl(220 15% 18% / 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={brandRef}
          dir="ltr"
          className="mb-4 sm:mb-5 mt-6 sm:mt-8 inline-flex items-end justify-center select-none"
          style={{
            opacity: 0,
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
          data-testid="text-hero-brand"
        >
          {BRAND_WEB.split("").map((char, i) => (
            <span
              key={`w${i}`}
              ref={(el) => { brandCharsRef.current[i] = el; }}
              className="font-black"
              style={{
                display: "inline-block",
                fontSize: "clamp(3rem, 10vw, 7rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))",
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
              willChange: "transform, opacity",
              filter: "drop-shadow(0 0 12px hsla(220, 80%, 60%, 0.2))",
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
                fontSize: "clamp(3rem, 10vw, 7rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, hsl(220 80% 68%), hsl(260 72% 65%), hsl(175 80% 55%))",
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
        </div>

        <h1
          ref={titleRef}
          key={lang}
          className="font-extrabold leading-[1.08] mb-6 text-charcoal"
          style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)" }}
          data-testid="text-hero-title"
        >
          <span data-hero-line className="block overflow-hidden" style={{
            background: "linear-gradient(135deg, hsl(220 80% 65%), hsl(260 70% 60%), hsl(170 80% 50%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{t("hero.line1")}</span>
          <span data-hero-line className="overflow-hidden inline">{t("hero.line2")}</span>{" "}
          <span data-hero-line className="overflow-hidden inline">{t("hero.line3")}</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-charcoal-light max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ opacity: 0, fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
          data-testid="text-hero-subtitle"
        >
          {t("hero.subtitle")}
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <Link href="/onboarding">
            <Button
              size="lg"
              className="text-white font-extrabold text-base px-8 py-3 min-h-[48px] border-0 shadow-lg w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))",
              }}
              data-testid="button-hero-cta"
            >
              {t("hero.cta")}
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("#services")}
            className="font-semibold text-base px-8 py-3 min-h-[48px] border-charcoal/15 text-charcoal w-full sm:w-auto"
            data-testid="button-hero-services"
          >
            {t("hero.services")}
          </Button>
        </div>

        <div
          ref={statsRef}
          className="flex items-center justify-center gap-8 mt-16 md:mt-20"
          style={{ opacity: 0 }}
        >
          {[
            { value: "100+", label: t("hero.stat.projects") },
            { value: "8+", label: t("hero.stat.experience") },
            { value: "98%", label: t("hero.stat.satisfaction") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold" style={{
                background: "linear-gradient(135deg, hsl(220 80% 65%), hsl(170 80% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{stat.value}</p>
              <p className="text-xs text-charcoal-light mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
    </section>
  );
}
