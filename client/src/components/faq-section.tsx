import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const isOpenRef = useRef(false);
  const contentId = `faq-content-${index}`;
  const buttonId = `faq-button-${index}`;

  const toggle = () => {
    const content = contentRef.current;
    const inner = innerRef.current;
    const icon = iconRef.current;
    if (!content || !inner || !icon) return;

    const nextOpen = !isOpenRef.current;
    isOpenRef.current = nextOpen;
    setIsOpen(nextOpen);

    gsap.killTweensOf(content);
    gsap.killTweensOf(icon);

    if (nextOpen) {
      const targetH = inner.offsetHeight;
      gsap.fromTo(content,
        { height: 0, opacity: 0 },
        { height: targetH, opacity: 1, duration: 0.5, ease: "power3.out", onComplete: () => gsap.set(content, { height: "auto" }) }
      );
      gsap.to(icon, { rotation: 135, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.set(content, { height: content.offsetHeight });
      gsap.to(content, { height: 0, opacity: 0, duration: 0.35, ease: "power2.in" });
      gsap.to(icon, { rotation: 0, duration: 0.4, ease: "power2.out" });
    }
  };

  return (
    <div
      className="faq-item"
      data-testid={`faq-item-${index}`}
    >
      <button
        id={buttonId}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-right transition-colors duration-300 rounded-xl group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        style={{
          background: isOpen
            ? "linear-gradient(145deg, hsla(260, 30%, 14%, 0.92) 0%, hsla(240, 25%, 12%, 0.88) 50%, hsla(220, 20%, 10%, 0.85) 100%)"
            : "linear-gradient(145deg, hsla(260, 30%, 12%, 0.85) 0%, hsla(240, 25%, 10%, 0.82) 50%, hsla(220, 20%, 8%, 0.78) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isOpen ? "1px solid hsla(220, 80%, 65%, 0.25)" : "1px solid hsla(0, 0%, 100%, 0.1)",
        }}
        data-testid={`button-faq-${index}`}
      >
        <span className="text-base sm:text-lg font-bold text-white/90 leading-relaxed flex-1">
          {question}
        </span>
        <span
          ref={iconRef}
          className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xl font-light transition-colors duration-300"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))"
              : "hsla(0, 0%, 100%, 0.08)",
            color: isOpen ? "white" : "hsla(0, 0%, 100%, 0.6)",
          }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        id={contentId}
        ref={contentRef}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div ref={innerRef} className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2">
          <p className="text-white/60 leading-[1.8] text-sm sm:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const { t, dir } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const items = itemsRef.current;
    if (!section || !header || !items) return;

    const faqItems = items.querySelectorAll(".faq-item");

    const ctx = gsap.context(() => {
      header.style.willChange = 'transform, opacity';
      faqItems.forEach((item) => {
        (item as HTMLElement).style.willChange = 'transform, opacity';
      });

      gsap.fromTo(
        header,
        { opacity: 0, y: 50, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onComplete: () => { header.style.willChange = 'auto'; },
        }
      );

      faqItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.7,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            onComplete: () => { (item as HTMLElement).style.willChange = 'auto'; },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      dir={dir}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgb(15, 10, 40) 0%, rgb(10, 8, 30) 50%, rgb(15, 10, 40) 100%)",
      }}
      data-testid="section-faq"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { w: "40vw", h: "40vw", top: "10%", left: "-10%", bg: "radial-gradient(circle, hsla(220,70%,55%,0.12) 0%, transparent 70%)" },
          { w: "35vw", h: "35vw", top: "60%", right: "-5%", bg: "radial-gradient(circle, hsla(260,60%,45%,0.1) 0%, transparent 70%)" },
          { w: "25vw", h: "25vw", top: "30%", left: "50%", bg: "radial-gradient(circle, hsla(170,60%,50%,0.06) 0%, transparent 70%)" },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.w,
              height: orb.h,
              top: orb.top,
              left: orb.left,
              right: (orb as any).right,
              background: orb.bg,
              filter: "blur(60px)",
              animation: `heroFloat ${14 + i * 4}s ease-in-out infinite ${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center mb-12 md:mb-16" style={{ opacity: 0 }}>
          <Badge
            variant="secondary"
            className="mb-4 border-white/15 text-white/70"
            style={{
              background: "hsla(260, 30%, 20%, 0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            <HelpCircle className="w-3 h-3 me-1" />
            {t("faq.badge")}
          </Badge>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-white"
            data-testid="text-faq-title"
          >
            {t("faq.title1")}
            <span
              className="ms-2"
              style={{
                background: "linear-gradient(135deg, hsl(220 80% 65%), hsl(260 70% 60%), hsl(170 80% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("faq.title2")}
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        <div ref={itemsRef} className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
