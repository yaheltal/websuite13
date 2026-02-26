import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Layout, Smartphone, ShoppingCart } from "lucide-react";

const categories = [
  { id: "all", label: "הכל" },
  { id: "landing", label: "דפי נחיתה" },
  { id: "card", label: "כרטיסי ביקור" },
  { id: "ecommerce", label: "חנויות" },
];

const projects = [
  {
    id: 1,
    title: "LuxeWatch",
    category: "ecommerce",
    description: "חנות אונליין יוקרתית לשעונים עם חווית קנייה מתקדמת",
    icon: ShoppingCart,
    gradient: "from-blue-500/20 to-indigo-500/10",
    tags: ["React", "Node.js", "Stripe"],
  },
  {
    id: 2,
    title: "StartUp Pro",
    category: "landing",
    description: "דף נחיתה ממיר לחברת סטארטאפ בתחום הפינטק",
    icon: Layout,
    gradient: "from-emerald-500/20 to-teal-500/10",
    tags: ["Next.js", "Tailwind", "Motion"],
  },
  {
    id: 3,
    title: "דניאל כהן",
    category: "card",
    description: "כרטיס ביקור דיגיטלי מעוצב לעורך דין מוביל",
    icon: Smartphone,
    gradient: "from-amber-500/20 to-orange-500/10",
    tags: ["React", "PWA", "vCard"],
  },
  {
    id: 4,
    title: "ModaStore",
    category: "ecommerce",
    description: "חנות אופנה עם מערכת מידות חכמה ותשלום מאובטח",
    icon: ShoppingCart,
    gradient: "from-pink-500/20 to-rose-500/10",
    tags: ["React", "PostgreSQL", "PayPlus"],
  },
  {
    id: 5,
    title: "CryptoHub",
    category: "landing",
    description: "דף נחיתה לפלטפורמת מסחר קריפטו עם אנימציות מתקדמות",
    icon: Layout,
    gradient: "from-violet-500/20 to-purple-500/10",
    tags: ["React", "GSAP", "WebGL"],
  },
  {
    id: 6,
    title: "שרה לוי",
    category: "card",
    description: "כרטיס ביקור דיגיטלי למעצבת פנים עם גלריית עבודות",
    icon: Smartphone,
    gradient: "from-cyan-500/20 to-sky-500/10",
    tags: ["React", "Cloudinary", "PWA"],
  },
];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 md:py-32 relative" data-testid="section-portfolio">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="secondary" className="mb-4">תיק עבודות</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-portfolio-title">
            פרויקטים שאנחנו
            <br />
            <span className="text-gradient">גאים בהם</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            מבחר מתוך הפרויקטים שפיתחנו עבור לקוחותינו
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
              className={activeCategory === cat.id ? "bg-gradient-to-l from-gold to-gold-dark text-black border-0" : ""}
              data-testid={`button-filter-${cat.id}`}
            >
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
                  className="group relative rounded-lg border border-border/50 bg-card transition-all duration-500 hover:border-gold/30 hover-elevate"
                  data-testid={`card-project-${project.id}`}
                >
                  <div className={`h-48 rounded-t-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center relative`}>
                    <project.icon className="w-12 h-12 text-foreground/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-40" />
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" variant="secondary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg" data-testid={`text-project-title-${project.id}`}>{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
