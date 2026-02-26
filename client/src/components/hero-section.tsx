import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

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
      const tl = gsap.timeline({ delay: 0.2 });

      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.7, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" },
          0
        );
      }

      tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: "power3.out",
      }, 0.3);

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
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
    }, section);

    return () => ctx.revert();
  }, []);

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
            background: "radial-gradient(circle, hsla(28, 65%, 55%, 0.08) 0%, hsla(28, 60%, 48%, 0.02) 50%, transparent 70%)",
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
            background: "radial-gradient(circle, hsla(140, 15%, 70%, 0.07) 0%, hsla(140, 12%, 78%, 0.02) 50%, transparent 70%)",
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
            background: "radial-gradient(circle, hsla(28, 50%, 60%, 0.05) 0%, transparent 60%)",
            filter: "blur(40px)",
            animation: "heroFloat 18s ease-in-out infinite 3s",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(hsl(220 15% 18% / 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={logoRef}
          className="flex items-center justify-center gap-3 mb-10"
          style={{ opacity: 0 }}
          data-testid="link-logo"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center shadow-md">
            <span className="text-lg md:text-xl font-extrabold text-white">13</span>
          </div>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal">
            WEB<span className="text-copper">13</span>
          </span>
        </div>

        <h1
          ref={titleRef}
          className="font-extrabold leading-[1.08] mb-6 text-charcoal"
          style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)" }}
          data-testid="text-hero-title"
        >
          <span data-hero-line className="block overflow-hidden">שוברים את השוק:</span>
          <span data-hero-line className="block overflow-hidden text-copper">אתרים בוטיק</span>
          <span data-hero-line className="block overflow-hidden">במחירים שלא מאמינים</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-charcoal-light max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ opacity: 0, fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
          data-testid="text-hero-subtitle"
        >
          איכות של בוטיק פרימיום, מחיר שמפתיע. אנחנו מוכיחים שאתר
          ברמה הכי גבוהה לא חייב לעלות הון — הוא רק חייב להיות שלנו
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-gradient-to-l from-copper to-copper-dark text-white font-extrabold text-base px-8 py-3 min-h-[48px] border-0 shadow-lg w-full sm:w-auto"
              data-testid="button-hero-cta"
            >
              התחילו שאלון התאמה
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("#services")}
            className="font-semibold text-base px-8 py-3 min-h-[48px] border-charcoal/15 text-charcoal w-full sm:w-auto"
            data-testid="button-hero-services"
          >
            גלו את השירותים שלנו
          </Button>
        </div>

        <div
          ref={statsRef}
          className="flex items-center justify-center gap-8 mt-16 md:mt-20"
          style={{ opacity: 0 }}
        >
          {[
            { value: "100+", label: "פרויקטים" },
            { value: "8+", label: "שנות ניסיון" },
            { value: "98%", label: "שביעות רצון" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-copper">{stat.value}</p>
              <p className="text-xs text-charcoal-light mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
    </section>
  );
}
