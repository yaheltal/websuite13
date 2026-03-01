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
        { height: targetH, opacity: 1, duration: 0.5, ease: "power3.out", onComplete: () => { gsap.set(content, { height: "auto" }); } }
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
            ? "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.85) 50%, rgba(240,244,255,0.8) 100%)"
            : "linear-gradient(145deg, rgba(255,255,255,0.75) 0%, rgba(250,252,255,0.7) 50%, rgba(245,248,255,0.65) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isOpen ? "1px solid rgba(100,140,220,0.25)" : "1px solid rgba(200,210,230,0.4)",
          boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.03)",
        }}
        data-testid={`button-faq-${index}`}
      >
        <span className="text-base sm:text-lg font-bold text-charcoal leading-relaxed flex-1">
          {question}
        </span>
        <span
          ref={iconRef}
          className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xl font-light transition-colors duration-300"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))"
              : "rgba(0, 0, 0, 0.06)",
            color: isOpen ? "white" : "hsl(220 15% 40%)",
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
          <p className="text-charcoal-light leading-[1.8] text-sm sm:text-base">
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
      data-testid="section-faq"
    >
      {/* background handled globally by ScrollBackground */}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center mb-12 md:mb-16" style={{ opacity: 0 }}>
          <Badge
            variant="secondary"
            className="mb-4 border-gray-200/60 text-charcoal-light"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            <HelpCircle className="w-3 h-3 me-1" />
            {t("faq.badge")}
          </Badge>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-charcoal"
            data-testid="text-faq-title"
          >
            {t("faq.title1")}
            <span
              className="ms-2"
              style={{
                background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 50%), hsl(170 80% 40%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("faq.title2")}
            </span>
          </h2>
          <p className="text-charcoal-light text-lg max-w-xl mx-auto">
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
