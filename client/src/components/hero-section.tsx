import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { MouseTrackingElement, FloatingShape } from "@/components/floating-elements";

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sand-light via-background to-background"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(220 15% 18% / 0.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <FloatingShape variant="circle" size="lg" animation="float-slow" className="top-20 right-[10%]" />
      <FloatingShape variant="diamond" size="md" animation="float" className="top-1/3 left-[8%]" />
      <FloatingShape variant="ring" size="lg" animation="float-reverse" className="bottom-1/4 right-[15%]" />
      <FloatingShape variant="square" size="sm" animation="float-slow" className="bottom-1/3 left-[20%]" />
      <FloatingShape variant="circle" size="sm" animation="float" className="top-[15%] left-[40%]" />
      <FloatingShape variant="ring" size="md" animation="float-reverse" className="top-2/3 right-[35%]" />

      <MouseTrackingElement sensitivity={0.015} className="absolute top-1/4 right-[20%] w-48 h-48 rounded-full bg-copper/[0.04] blur-2xl pointer-events-none" />
      <MouseTrackingElement sensitivity={0.02} className="absolute bottom-1/3 left-[25%] w-64 h-64 rounded-full bg-sage/[0.06] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-10"
          data-testid="link-logo"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center shadow-md">
            <span className="text-xl md:text-2xl font-extrabold text-white">W</span>
          </div>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-charcoal">
            Web<span className="text-copper">Craft</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-charcoal"
          data-testid="text-hero-title"
        >
          שוברים את השוק:
          <br />
          <span className="text-copper">אתרים בוטיק</span>
          <br />
          במחירים שלא מאמינים
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-charcoal-light max-w-2xl mx-auto mb-10 leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          איכות של בוטיק פרימיום, מחיר שמפתיע. אנחנו מוכיחים שאתר
          ברמה הכי גבוהה לא חייב לעלות הון — הוא רק חייב להיות שלנו
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => scrollToSection("#contact")}
            className="bg-gradient-to-l from-copper to-copper-dark text-white font-extrabold text-base px-8 border-0 shadow-lg"
            data-testid="button-hero-cta"
          >
            קבלו הצעת מחיר חינם
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("#portfolio")}
            className="font-semibold text-base px-8 border-charcoal/15 text-charcoal"
            data-testid="button-hero-portfolio"
          >
            צפו בעבודות שלנו
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center justify-center gap-8 mt-16 md:mt-20"
        >
          {[
            { value: "100+", label: "פרויקטים" },
            { value: "8+", label: "שנות ניסיון" },
            { value: "98%", label: "שביעות רצון" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-copper">{stat.value}</p>
              <p className="text-xs text-charcoal-light mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-14 md:mt-20"
        >
          <button
            onClick={() => scrollToSection("#services")}
            className="animate-float inline-flex flex-col items-center gap-2 text-charcoal-light transition-colors duration-300 hover:text-charcoal"
            data-testid="button-scroll-down"
          >
            <span className="text-xs font-medium">גלו את השירותים שלנו</span>
            <ArrowDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
