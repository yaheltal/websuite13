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

const services = [
  {
    id: "landing",
    icon: Layout,
    title: "דף נחיתה",
    subtitle: "ממיר לידים ומכירות",
    description: "דפי נחיתה מעוצבים עם מיקוד בהמרה גבוהה, מותאמים לכל מכשיר ומהירים ברמה שגוגל אוהב",
    features: ["עיצוב ממוקד המרה", "מהירות טעינה מושלמת", "אופטימיזציית SEO מלאה", "מעקב ואנליטיקס"],
    price: "החל מ-₪1,490",
    tag: "הכי פופולרי",
    serviceType: "landing" as const,
  },
  {
    id: "card",
    icon: Smartphone,
    title: "כרטיס ביקור דיגיטלי",
    subtitle: "הרושם הראשוני המושלם",
    description: "כרטיס ביקור אינטראקטיבי ויוקרתי, מותאם למובייל עם שמירת איש קשר בקליק אחד",
    features: ["עיצוב בוטיק מותאם", "שמירת איש קשר מיידית", "QR Code חכם", "שיתוף בכל הפלטפורמות"],
    price: "החל מ-₪490",
    tag: "מחיר השקה",
    serviceType: "card" as const,
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "חנות אונליין מלאה",
    subtitle: "פתרון מסחר ברמה הכי גבוהה",
    description: "חנות מקצועית עם ניהול מוצרים, סליקת אשראי מאובטחת, ומערכת ניהול הזמנות חכמה",
    features: ["ניהול מוצרים מתקדם", "סליקה מאובטחת", "מעקב הזמנות אוטומטי", "דוחות מכירות ואנליטיקס"],
    price: "החל מ-₪4,990",
    tag: "Premium",
    serviceType: "ecommerce" as const,
  },
];

export function ServicesSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewService, setPreviewService] = useState<"landing" | "card" | "ecommerce">("landing");

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
            <Badge variant="secondary" className="mb-4 bg-copper/8 text-copper-dark border-copper/15">
              <Sparkles className="w-3 h-3 ml-1" />
              השירותים שלנו
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-charcoal" data-testid="text-services-title">
              שלושה פתרונות,
              <br />
              <span className="text-copper">אינסוף אפשרויות</span>
            </h2>
            <p className="text-charcoal-light text-lg max-w-xl mx-auto">
              כל שירות מותאם אישית לעסק שלכם — מהעיצוב ועד השורה האחרונה בקוד
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
                    className="group relative bg-card border-border/50 p-6 md:p-8 transition-all duration-500 hover:border-copper/25 hover-elevate"
                    data-testid={`card-service-${service.id}`}
                  >
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-copper/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative space-y-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-copper/10 to-copper/5 flex items-center justify-center">
                          <service.icon className="w-6 h-6 text-copper" />
                        </div>
                        <Badge variant="secondary" className="bg-copper/8 text-copper-dark border-copper/15 text-[10px]">
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
                            <div className="w-5 h-5 rounded-full bg-sage/30 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-sage-dark" />
                            </div>
                            <span className="text-charcoal">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                        <span className="text-lg font-extrabold text-copper">{service.price}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-copper/20 text-copper font-semibold"
                          onClick={() => openPreview(service.serviceType)}
                          data-testid={`button-preview-${service.id}`}
                        >
                          <Eye className="w-4 h-4 ml-1.5" />
                          צפו בדוגמה
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-l from-copper to-copper-dark text-white font-bold border-0"
                          onClick={() => {
                            const el = document.querySelector("#contact");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          data-testid={`button-service-${service.id}`}
                        >
                          אני רוצה
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
