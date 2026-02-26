import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Layout,
  ShoppingCart,
  Check,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Globe,
  Star,
  Filter,
  Heart,
  Search,
} from "lucide-react";

const services = [
  {
    id: "business-card",
    icon: Smartphone,
    title: "כרטיס ביקור דיגיטלי",
    subtitle: "הרושם הראשון שלכם",
    description: "כרטיס ביקור אינטראקטיבי, מותאם למובייל, שנראה מדהים על כל מכשיר",
    features: ["עיצוב מותאם אישית", "קישורים חכמים", "QR Code", "שיתוף מיידי"],
    price: "החל מ-₪490",
  },
  {
    id: "landing-page",
    icon: Layout,
    title: "דף נחיתה",
    subtitle: "ממיר לידים",
    description: "דפי נחיתה מעוצבים עם מיקוד בהמרה, אופטימיזציה למהירות ו-SEO",
    features: ["עיצוב ממוקד המרה", "מהירות טעינה מעולה", "אופטימיזציית SEO", "מעקב אנליטיקס"],
    price: "החל מ-₪1,490",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "חנות אונליין מלאה",
    subtitle: "פתרון מסחר מלא",
    description: "חנות מקצועית עם מערכת ניהול מוצרים, תשלומים מאובטחים, ומעקב הזמנות",
    features: ["ניהול מוצרים מתקדם", "תשלומים מאובטחים", "מעקב הזמנות", "דוחות ואנליטיקס"],
    price: "החל מ-₪4,990",
  },
];

function BusinessCardPreview() {
  return (
    <div className="relative mx-auto w-64 md:w-72">
      <div className="rounded-2xl bg-gradient-to-b from-card to-background border border-border/60 p-6 space-y-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-black font-bold text-xl">
            DS
          </div>
          <div>
            <p className="font-bold text-sm">דניאל שפירא</p>
            <p className="text-xs text-muted-foreground">מנהל שיווק דיגיטלי</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="w-3 h-3 text-gold" />
            <span>054-1234567</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3 text-gold" />
            <span>daniel@example.com</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-gold" />
            <span>תל אביב, ישראל</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3 h-3 text-gold" />
            <span>www.example.co.il</span>
          </div>
        </div>
        <Button size="sm" className="w-full bg-gradient-to-l from-gold to-gold-dark text-black font-semibold text-xs border-0">
          שמור איש קשר
        </Button>
      </div>
    </div>
  );
}

function LandingPagePreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-xl bg-gradient-to-b from-card to-background border border-border/60 overflow-visible">
        <div className="p-4 bg-gradient-to-l from-electric-dark/20 to-electric/10 rounded-t-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-gold/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-bold text-sm">הגדילו את המכירות ב-300%</p>
            <p className="text-[10px] text-muted-foreground">הצטרפו לאלפי עסקים מצליחים</p>
            <div className="pt-1">
              <Badge variant="secondary" className="text-[10px]">התחילו עכשיו</Badge>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-full h-1.5 rounded-full bg-gold/30" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-md bg-muted/50 flex items-center justify-center">
                <Star className="w-3 h-3 text-gold/50" />
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-muted/30 w-3/4 mx-auto" />
          <div className="h-2 rounded-full bg-muted/30 w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  );
}

function EcommercePreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-xl bg-gradient-to-b from-card to-background border border-border/60 overflow-visible">
        <div className="p-3 border-b border-border/40">
          <div className="flex items-center justify-between gap-2">
            <Search className="w-3 h-3 text-muted-foreground" />
            <div className="flex-1 h-6 rounded-md bg-muted/30 text-[9px] flex items-center px-2 text-muted-foreground">
              חיפוש מוצרים...
            </div>
            <Filter className="w-3 h-3 text-muted-foreground" />
            <ShoppingCart className="w-3 h-3 text-gold" />
          </div>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "שעון יוקרה", price: "₪2,490" },
              { name: "תיק עור", price: "₪890" },
              { name: "משקפי שמש", price: "₪590" },
              { name: "צמיד זהב", price: "₪1,290" },
            ].map((product, i) => (
              <div
                key={i}
                className="rounded-md bg-muted/20 p-2 space-y-1.5"
              >
                <div className="aspect-square rounded-sm bg-gradient-to-br from-muted/40 to-muted/20 flex items-center justify-center relative">
                  <ShoppingCart className="w-4 h-4 text-muted-foreground/40" />
                  <Heart className="w-3 h-3 text-muted-foreground/30 absolute top-1 left-1" />
                </div>
                <p className="text-[9px] font-medium truncate">{product.name}</p>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-bold text-gold">{product.price}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-1.5 h-1.5 text-gold/60 fill-gold/60" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const previews: Record<string, () => JSX.Element> = {
  "business-card": BusinessCardPreview,
  "landing-page": LandingPagePreview,
  "ecommerce": EcommercePreview,
};

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 relative" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <Badge variant="secondary" className="mb-4">השירותים שלנו</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-services-title">
            כל מה שהעסק שלכם
            <br />
            <span className="text-gradient">צריך כדי לצמוח</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            שלושה פתרונות מקצועיים שמכסים את כל הצרכים הדיגיטליים של העסק
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const PreviewComponent = previews[service.id];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card
                  className="group relative bg-card border-border/50 p-6 md:p-8 transition-all duration-500 hover:border-gold/30 hover-elevate"
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative space-y-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 rounded-md bg-gold/10 flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-gold" />
                      </div>
                      <span className="text-sm font-bold text-gold">{service.price}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>

                    <div className="py-4">
                      <PreviewComponent />
                    </div>

                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant="outline"
                      className="w-full group/btn"
                      onClick={() => {
                        const el = document.querySelector("#contact");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      data-testid={`button-service-${service.id}`}
                    >
                      <span>פרטים נוספים</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
