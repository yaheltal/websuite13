import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ParallaxSection } from "@/components/floating-elements";
import { useI18n } from "@/lib/i18n";

export function ServicesSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewService, setPreviewService] = useState<"landing" | "card" | "ecommerce">("landing");
  const { t } = useI18n();

  const services = [
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
    },
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
    },
  ];

  const openPreview = (serviceType: "landing" | "card" | "ecommerce") => {
    setPreviewService(serviceType);
    setPreviewOpen(true);
  };

  return (
    <>
      <section id="services" className="py-20 md:py-32 relative" data-testid="section-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <Badge variant="secondary" className="mb-4 border" style={{
              background: "hsla(220, 80%, 55%, 0.08)",
              color: "hsl(220, 80%, 45%)",
              borderColor: "hsla(220, 80%, 55%, 0.15)",
            }}>
              <Sparkles className="w-3 h-3 ml-1" />
              {t("services.badge")}
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-charcoal" data-testid="text-services-title">
              {t("services.title1")}
              <br />
              <span style={{
                background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%), hsl(175, 80%, 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{t("services.title2")}</span>
            </h2>
            <p className="text-charcoal-light text-lg max-w-xl mx-auto">
              {t("services.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ParallaxSection key={service.id} speed={0.02 * (index + 1)}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Card
                    className="group relative bg-card border-border/50 p-6 md:p-8 transition-all duration-500 hover-elevate"
                    style={{ ["--hover-border" as string]: `${service.accent}40` }}
                    data-testid={`card-service-${service.id}`}
                  >
                    <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                      background: `linear-gradient(to bottom, ${service.accent}08, transparent)`,
                    }} />

                    <div className="relative space-y-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                          background: `linear-gradient(135deg, ${service.accent}18, ${service.accent}08)`,
                        }}>
                          <service.icon className="w-6 h-6" style={{ color: service.accent }} />
                        </div>
                        <Badge variant="secondary" className="text-[10px] border" style={{
                          background: `${service.accent}10`,
                          color: service.accent,
                          borderColor: `${service.accent}20`,
                        }}>
                          {service.tag}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-xl font-extrabold mb-1 text-charcoal">{service.title}</h3>
                        <p className="text-sm text-charcoal-light">{service.subtitle}</p>
                      </div>

                      <p className="text-sm text-charcoal-light leading-relaxed">{service.description}</p>

                      <ul className="space-y-2.5">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2.5 text-sm">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                              background: `${service.accent}15`,
                            }}>
                              <Check className="w-3 h-3" style={{ color: service.accent }} />
                            </div>
                            <span className="text-charcoal">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                        <span className="text-lg font-extrabold" style={{
                          background: `linear-gradient(135deg, ${service.accent}, hsl(175, 80%, 50%))`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>{service.price}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 font-semibold"
                          style={{
                            borderColor: `${service.accent}30`,
                            color: service.accent,
                          }}
                          onClick={() => openPreview(service.serviceType)}
                          data-testid={`button-preview-${service.id}`}
                        >
                          <Eye className="w-4 h-4 ml-1.5" />
                          {t("services.preview")}
                        </Button>
                        <Button
                          className="flex-1 text-white font-bold border-0"
                          style={{
                            background: `linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))`,
                          }}
                          onClick={() => {
                            const el = document.querySelector("#contact");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          data-testid={`button-service-${service.id}`}
                        >
                          {t("services.cta")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </ParallaxSection>
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
