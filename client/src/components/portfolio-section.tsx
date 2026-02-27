import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Layout, Smartphone, ShoppingCart, Briefcase } from "lucide-react";
import { BrowserPreviewModal } from "@/components/browser-preview-modal";

const categories = [
  { id: "all", label: "הכל", icon: Briefcase },
  { id: "landing", label: "דפי נחיתה", icon: Layout },
  { id: "card", label: "כרטיסי ביקור", icon: Smartphone },
  { id: "ecommerce", label: "חנויות", icon: ShoppingCart },
];

const projects = [
  {
    id: 1,
    title: "StartUp Pro",
    category: "landing",
    description: "דף נחיתה ממיר לחברת סטארטאפ בתחום הפינטק, עם אנימציות מרהיבות ושיעור המרה של 12%",
    icon: Layout,
    gradient: "from-blue-500/15 to-purple-500/10",
    tags: ["React", "Tailwind", "Motion"],
    serviceType: "landing" as const,
  },
  {
    id: 2,
    title: "דניאל כהן, עו״ד",
    category: "card",
    description: "כרטיס ביקור דיגיטלי בוטיק לעורך דין מוביל, עם שמירת איש קשר ושיתוף מיידי",
    icon: Smartphone,
    gradient: "from-purple-500/15 to-blue-500/10",
    tags: ["React", "PWA", "vCard"],
    serviceType: "card" as const,
  },
  {
    id: 3,
    title: "LuxeFashion",
    category: "ecommerce",
    description: "חנות אופנה יוקרתית עם מערכת סינון חכמה, עגלת קניות ותשלום מאובטח",
    icon: ShoppingCart,
    gradient: "from-cyan-500/12 to-blue-500/15",
    tags: ["React", "PostgreSQL", "Stripe"],
    serviceType: "ecommerce" as const,
  },
  {
    id: 4,
    title: "HealthTech",
    category: "landing",
    description: "דף נחיתה לאפליקציית בריאות חכמה עם הרשמה ומעקב משתמשים",
    icon: Layout,
    gradient: "from-blue-500/20 to-cyan-500/8",
    tags: ["Next.js", "Tailwind", "GSAP"],
    serviceType: "landing" as const,
  },
  {
    id: 5,
    title: "שרה לוי, מעצבת",
    category: "card",
    description: "כרטיס ביקור דיגיטלי למעצבת פנים מובילה עם גלריית עבודות מרהיבה",
    icon: Smartphone,
    gradient: "from-purple-500/10 to-cyan-500/15",
    tags: ["React", "Cloudinary", "PWA"],
    serviceType: "card" as const,
  },
  {
    id: 6,
    title: "GourmetBox",
    category: "ecommerce",
    description: "חנות מזון גורמה עם מנויים, משלוחים ומערכת ניהול מלאי אוטומטית",
    icon: ShoppingCart,
    gradient: "from-blue-500/12 to-purple-500/12",
    tags: ["React", "Node.js", "PayPlus"],
    serviceType: "ecommerce" as const,
  },
];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewService, setPreviewService] = useState<"landing" | "card" | "ecommerce">("landing");

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const openPreview = (serviceType: "landing" | "card" | "ecommerce") => {
    setPreviewService(serviceType);
    setPreviewOpen(true);
  };

  return (
    <>
      <section id="portfolio" className="py-20 md:py-32 relative" data-testid="section-portfolio">
        <div className="absolute inset-0 bg-background/30 rounded-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <Badge variant="secondary" className="mb-4 bg-sage/20 text-sage-dark border-sage/30">
              תיק עבודות
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-charcoal" data-testid="text-portfolio-title">
              פרויקטים שאנחנו
              <br />
              <span className="text-copper">גאים בהם</span>
            </h2>
            <p className="text-charcoal-light text-lg max-w-xl mx-auto">
              לחצו על "צפו בדוגמה" לצפייה בגרסת הדפדפן המלאה
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-10 md:mb-14"
          >
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={
                  activeCategory === cat.id
                    ? "bg-gradient-to-l from-copper to-copper-dark text-white border-0"
                    : "border-charcoal/10 text-charcoal"
                }
                data-testid={`button-filter-${cat.id}`}
              >
                <cat.icon className="w-3.5 h-3.5 ml-1" />
                {cat.label}
              </Button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="group relative rounded-lg border border-border/50 bg-card transition-all duration-500 hover:border-copper/25 hover-elevate"
                    data-testid={`card-project-${project.id}`}
                  >
                    <div className={`h-48 rounded-t-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center relative`}>
                      <project.icon className="w-12 h-12 text-charcoal/10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => openPreview(project.serviceType)}
                          data-testid={`button-view-project-${project.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-lg text-charcoal" data-testid={`text-project-title-${project.id}`}>{project.title}</h3>
                      <p className="text-sm text-charcoal-light leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] bg-sand-dark/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 border-copper/20 text-copper font-semibold"
                        onClick={() => openPreview(project.serviceType)}
                        data-testid={`button-preview-project-${project.id}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        צפו בדוגמה
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
