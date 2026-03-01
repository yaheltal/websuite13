import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionProgressBar } from "@/components/section-progress-bar";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Globe,
  ShoppingCart,
  Check,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BrowserPreviewModal } from "@/components/browser-preview-modal";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useI18n } from "@/lib/i18n";

const AUTO_INTERVAL = 5500;

export function ServicesSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewService, setPreviewService] = useState<"landing" | "card" | "ecommerce">("landing");
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  const services = [
    {
      id: "card",
      icon: Smartphone,
      title: t("services.card.title"),
      subtitle: t("services.card.subtitle"),
      description: t("services.card.description"),
      features: [t("services.card.f1"), t("services.card.f2"), t("services.card.f3"), t("services.card.f4")],
      tag: t("services.card.tag"),
      serviceType: "card" as const,
      gradient: "linear-gradient(135deg, #0ea5a0, #2dd4bf)",
      accentColor: "#0d9488",
      lightBg: "linear-gradient(145deg, #f0fdfa 0%, #e6faf6 50%, #f0fdfa 100%)",
      previewImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=400&fit=crop&crop=face",
      previewLabel: "Noa Dahan — Digital Card",
    },
    {
      id: "landing",
      icon: Globe,
      title: t("services.landing.title"),
      subtitle: t("services.landing.subtitle"),
      description: t("services.landing.description"),
      features: [t("services.landing.f1"), t("services.landing.f2"), t("services.landing.f3"), t("services.landing.f4")],
      tag: t("services.landing.tag"),
      serviceType: "landing" as const,
      gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
      accentColor: "#4f46e5",
      lightBg: "linear-gradient(145deg, #eef2ff 0%, #e8ecff 50%, #eef2ff 100%)",
      previewImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
      previewLabel: "Maya Pilates — Studio",
    },
    {
      id: "ecommerce",
      icon: ShoppingCart,
      title: t("services.ecommerce.title"),
      subtitle: t("services.ecommerce.subtitle"),
      description: t("services.ecommerce.description"),
      features: [t("services.ecommerce.f1"), t("services.ecommerce.f2"), t("services.ecommerce.f3"), t("services.ecommerce.f4")],
      tag: t("services.ecommerce.tag"),
      serviceType: "ecommerce" as const,
      gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
      accentColor: "#7c3aed",
      lightBg: "linear-gradient(145deg, #f5f3ff 0%, #ede9fe 50%, #f5f3ff 100%)",
      previewImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=400&fit=crop",
      previewLabel: "MOMENTUM — Sport Store",
    },
  ];

  const openPreview = (serviceType: "landing" | "card" | "ecommerce") => {
    setPreviewService(serviceType);
    setPreviewOpen(true);
  };

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % 3);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + 3) % 3);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % 3);
    }, AUTO_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, activeIndex]);

  const active = services[activeIndex];
  const Icon = active.icon;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0, scale: 0.97 }),
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="services"
        className="py-24 md:py-32 relative"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 900px" }}
        data-testid="section-services"
      >
        <SectionProgressBar
          sectionRef={sectionRef}
          className="left-4 top-24 bottom-24 w-[3px] hidden md:block"
          orientation="vertical"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-18">
            <ScrollReveal staggerDelay={0}>
              <Badge
                variant="secondary"
                className="mb-4 border px-3 py-1"
                style={{
                  color: "hsl(220, 75%, 50%)",
                  borderColor: "rgba(200,210,230,0.5)",
                  background: "rgba(255,255,255,0.7)",
                }}
              >
                <Sparkles className="w-3 h-3 ml-1" />
                {t("services.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-foreground" data-testid="text-services-title">
                {t("services.title1")}
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, hsl(220, 80%, 65%), hsl(260, 70%, 60%), hsl(175, 80%, 55%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {t("services.title2")}
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                {t("services.subtitle")}
              </p>
            </ScrollReveal>
          </div>

          {/* ── Showcase Carousel ── */}
          <ScrollReveal>
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Auto-progress bar */}
              <div className="flex gap-2 mb-6">
                {services.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className="flex-1 h-1 rounded-full overflow-hidden relative"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                    data-cursor-hover
                  >
                    <motion.div
                      className="absolute inset-y-0 right-0 rounded-full"
                      style={{ background: services[i].gradient }}
                      initial={{ width: "0%" }}
                      animate={{
                        width: i === activeIndex ? "100%" : i < activeIndex ? "100%" : "0%",
                      }}
                      transition={{
                        duration: i === activeIndex ? AUTO_INTERVAL / 1000 : 0.3,
                        ease: i === activeIndex ? "linear" : "easeOut",
                      }}
                    />
                  </button>
                ))}
              </div>

              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={active.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="rounded-3xl overflow-hidden border"
                    style={{
                      background: "#fff",
                      borderColor: "rgba(0,0,0,0.05)",
                      boxShadow: "0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.02)",
                    }}
                    data-testid={`card-service-${active.id}`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* ── Visual Side — Preview Image ── */}
                      <div
                        className="relative md:w-[42%] overflow-hidden cursor-pointer group"
                        style={{ minHeight: "280px" }}
                        onClick={() => openPreview(active.serviceType)}
                        data-cursor-hover
                      >
                        {/* Preview image */}
                        <motion.img
                          key={active.id + "-img"}
                          src={active.previewImage}
                          alt={active.previewLabel}
                          className="absolute inset-0 w-full h-full object-cover"
                          initial={{ scale: 1.05, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />

                        {/* Gradient overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${active.accentColor}dd 0%, ${active.accentColor}40 40%, transparent 70%)`,
                          }}
                        />

                        {/* Icon badge — top left */}
                        <div className="absolute top-4 left-4 z-10">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              border: "1px solid rgba(255,255,255,0.3)",
                            }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {/* Tag — top right */}
                        <div className="absolute top-4 right-4 z-10">
                          <Badge
                            className="text-xs font-bold border-0 px-2.5 py-0.5 backdrop-blur-sm"
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              color: "#fff",
                              border: "1px solid rgba(255,255,255,0.25)",
                            }}
                          >
                            {active.tag}
                          </Badge>
                        </div>

                        {/* Bottom label */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                                  style={{
                                    background: "rgba(255,255,255,0.2)",
                                    color: "#fff",
                                  }}
                                >
                                  DEMO
                                </span>
                              </div>
                              <p className="text-white text-sm font-semibold">{active.previewLabel}</p>
                            </div>
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: "rgba(255,255,255,0.25)" }}
                            >
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Step number */}
                        <div className="absolute bottom-4 right-5 z-10">
                          <span className="text-5xl md:text-6xl font-black text-white/[0.08]">
                            0{activeIndex + 1}
                          </span>
                        </div>
                      </div>

                      {/* ── Content Side ── */}
                      <div className="flex-1 p-7 md:p-10 lg:p-12 flex flex-col justify-center">
                        <motion.div
                          key={active.id + "-content"}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                        >
                          <div className="mb-5">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1.5">{active.title}</h3>
                            <p className="text-base md:text-lg font-medium" style={{ color: active.accentColor }}>{active.subtitle}</p>
                          </div>

                          <p className="text-muted-foreground leading-relaxed mb-7 text-[15px]">{active.description}</p>

                          {/* Features — 2-column */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                            {active.features.map((feature, i) => (
                              <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.06 }}
                                className="flex items-center gap-2.5"
                              >
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ background: active.accentColor + "12" }}
                                >
                                  <Check className="w-3.5 h-3.5" style={{ color: active.accentColor }} />
                                </div>
                                <span className="text-sm text-foreground/85">{feature}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-3 flex-wrap">
                            <Button
                              variant="outline"
                              className="font-semibold text-foreground/80 hover:text-foreground px-6 transition-colors"
                              style={{ borderColor: "rgba(0,0,0,0.1)" }}
                              onClick={() => openPreview(active.serviceType)}
                              data-testid={`button-preview-${active.id}`}
                              data-cursor-hover
                            >
                              <Eye className="w-4 h-4 ml-1.5" />
                              {t("services.preview")}
                            </Button>
                            <Button
                              className="font-bold text-white border-0 px-6 transition-opacity hover:opacity-90"
                              style={{ background: active.gradient }}
                              onClick={() => {
                                const el = document.querySelector("#contact");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                              }}
                              data-testid={`button-service-${active.id}`}
                              data-cursor-hover
                            >
                              {t("services.cta")}
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ── Bottom Navigation ── */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200/60 shadow-sm hover:shadow transition-shadow"
                  data-cursor-hover
                >
                  <ChevronRight className="w-5 h-5 text-foreground/60" />
                </button>

                <div className="flex items-center gap-5 md:gap-8">
                  {services.map((s, i) => {
                    const SIcon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => goTo(i)}
                        className="flex items-center gap-2 group transition-opacity duration-200"
                        style={{ opacity: i === activeIndex ? 1 : 0.45 }}
                        data-cursor-hover
                      >
                        <SIcon
                          className="w-4 h-4 transition-colors"
                          style={{ color: i === activeIndex ? services[i].accentColor : "hsl(220, 10%, 55%)" }}
                        />
                        <span
                          className="text-sm font-semibold hidden sm:inline transition-colors"
                          style={{ color: i === activeIndex ? services[i].accentColor : "hsl(220, 10%, 55%)" }}
                        >
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goNext}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200/60 shadow-sm hover:shadow transition-shadow"
                  data-cursor-hover
                >
                  <ChevronLeft className="w-5 h-5 text-foreground/60" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <BrowserPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        serviceType={previewService}
      />
    </>
  );
}
