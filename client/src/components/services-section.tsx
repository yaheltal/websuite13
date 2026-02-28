import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { SectionProgressBar } from "@/components/section-progress-bar";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Layout,
  ShoppingCart,
  Check,
  Eye,
  Sparkles,
} from "lucide-react";
import { BrowserPreviewModal } from "@/components/browser-preview-modal";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TiltCard } from "@/components/tilt-card";
import { MagneticButton } from "@/components/magnetic-button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function withAlpha(hsl: string, alpha: number) {
  return hsl.replace("hsl(", "hsla(").replace(")", `, ${alpha})`);
}

export function ServicesSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewService, setPreviewService] = useState<"landing" | "card" | "ecommerce">("landing");
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  const services = [
    {
      id: "landing",
      icon: Layout,
      title: t("services.landing.title"),
      subtitle: t("services.landing.subtitle"),
      description: t("services.landing.description"),
      features: [t("services.landing.f1"), t("services.landing.f2"), t("services.landing.f3"), t("services.landing.f4")],
      price: t("services.landing.price"),
      tag: t("services.landing.tag"),
      serviceType: "landing" as const,
      accent: "hsl(220, 80%, 55%)",
      bentoClass: "",
    },
    {
      id: "card",
      icon: Smartphone,
      title: t("services.card.title"),
      subtitle: t("services.card.subtitle"),
      description: t("services.card.description"),
      features: [t("services.card.f1"), t("services.card.f2"), t("services.card.f3"), t("services.card.f4")],
      price: t("services.card.price"),
      tag: t("services.card.tag"),
      serviceType: "card" as const,
      accent: "hsl(175, 80%, 50%)",
      bentoClass: "",
    },
    {
      id: "ecommerce",
      icon: ShoppingCart,
      title: t("services.ecommerce.title"),
      subtitle: t("services.ecommerce.subtitle"),
      description: t("services.ecommerce.description"),
      features: [t("services.ecommerce.f1"), t("services.ecommerce.f2"), t("services.ecommerce.f3"), t("services.ecommerce.f4")],
      price: t("services.ecommerce.price"),
      tag: t("services.ecommerce.tag"),
      serviceType: "ecommerce" as const,
      accent: "hsl(260, 70%, 55%)",
      bentoClass: "",
    },
  ];

  const openPreview = (serviceType: "landing" | "card" | "ecommerce") => {
    setPreviewService(serviceType);
    setPreviewOpen(true);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="services"
        className="py-24 md:py-32 relative"
        data-testid="section-services"
      >
        <SectionProgressBar
          sectionRef={sectionRef}
          className="left-4 top-24 bottom-24 w-[3px] hidden md:block"
          orientation="vertical"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
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

          {/* Service cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {services.map((service, index) => (
              <ScrollReveal
                key={service.id}
                staggerDelay={index * 0.1}
                use3D
                className={cn("min-h-[320px] md:min-h-0", service.bentoClass)}
              >
                <TiltCard
                  glowColor={withAlpha(service.accent, 0.08)}
                  className="h-full group"
                >
                  <div
                    className="h-full rounded-2xl p-6 md:p-8 flex flex-col border border-gray-200/60 transition-shadow duration-300 hover:shadow-lg"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.97) 50%, rgba(248,250,255,0.96) 100%)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                    data-testid={`card-service-${service.id}`}
                  >
                    <div className="relative space-y-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${withAlpha(service.accent, 0.2)}, ${withAlpha(service.accent, 0.06)})`,
                            border: "1px solid " + withAlpha(service.accent, 0.25),
                          }}
                        >
                          <service.icon className="w-6 h-6" style={{ color: service.accent }} />
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold border px-2 py-0.5"
                          style={{
                            background: withAlpha(service.accent, 0.15),
                            color: service.accent,
                            borderColor: withAlpha(service.accent, 0.35),
                          }}
                        >
                          {service.tag}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-xl font-extrabold mb-1 text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{service.description}</p>

                      <ul className="space-y-2.5">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2.5 text-sm">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: withAlpha(service.accent, 0.15) }}
                            >
                              <Check className="w-3 h-3" style={{ color: service.accent }} />
                            </div>
                            <span className="text-foreground/90">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                        <span
                          className="text-lg font-extrabold"
                          style={{
                            background: `linear-gradient(135deg, ${service.accent}, hsl(175, 80%, 50%))`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {service.price}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          className="flex-1 font-semibold border-border/60 text-foreground/90 hover:bg-white/5"
                          style={{ borderColor: withAlpha(service.accent, 0.4) }}
                          onClick={() => openPreview(service.serviceType)}
                          data-testid={`button-preview-${service.id}`}
                          data-cursor-hover
                        >
                          <Eye className="w-4 h-4 ml-1.5" />
                          {t("services.preview")}
                        </Button>
                        <MagneticButton
                          as="button"
                          strength={0.3}
                          className="flex-1 text-white font-bold border-0 min-h-9 rounded-md px-4 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          style={{
                            background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))",
                          }}
                          onClick={() => {
                            const el = document.querySelector("#contact");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          data-testid={`button-service-${service.id}`}
                          data-cursor-hover
                        >
                          {t("services.cta")}
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
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
