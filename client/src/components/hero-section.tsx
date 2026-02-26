import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-electric/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 md:w-80 md:h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-gold">סטודיו לפיתוח אתרים פרימיום</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          data-testid="text-hero-title"
        >
          אנחנו בונים
          <br />
          <span className="text-gradient">חוויות דיגיטליות</span>
          <br />
          שמניעות תוצאות
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          מדפי נחיתה ממירים ועד חנויות אונליין מלאות — אנחנו מעצבים ומפתחים
          פתרונות דיגיטליים שמביאים לעסק שלכם לקוחות חדשים
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => scrollToSection("#contact")}
            className="bg-gradient-to-l from-gold to-gold-dark text-black font-bold text-base px-8 border-0"
            data-testid="button-hero-cta"
          >
            קבלו הצעת מחיר
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("#portfolio")}
            className="font-semibold text-base px-8"
            data-testid="button-hero-portfolio"
          >
            צפו בעבודות שלנו
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 md:mt-24"
        >
          <button
            onClick={() => scrollToSection("#services")}
            className="animate-float inline-flex flex-col items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
            data-testid="button-scroll-down"
          >
            <span className="text-xs font-medium">גלו את השירותים שלנו</span>
            <ArrowDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
