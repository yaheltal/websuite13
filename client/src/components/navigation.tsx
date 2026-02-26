import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "ראשי", href: "#hero" },
  { label: "שירותים", href: "#services" },
  { label: "תיק עבודות", href: "#portfolio" },
  { label: "צור קשר", href: "#contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        data-testid="navigation-bar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass-panel bg-background/80 border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => scrollToSection("#hero")}
              className="flex items-center gap-2"
              data-testid="link-logo"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-sm md:text-base font-bold text-black">W</span>
              </div>
              <span className="text-lg md:text-xl font-bold tracking-tight">
                Web<span className="text-gradient">Craft</span>
              </span>
            </button>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  data-testid={`link-nav-${item.href.replace("#", "")}`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                size="sm"
                onClick={() => scrollToSection("#contact")}
                className="bg-gradient-to-l from-gold to-gold-dark text-black font-semibold border-0"
                data-testid="button-nav-cta"
              >
                בואו נדבר
              </Button>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 glass-panel pt-20 md:hidden"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className="text-2xl font-medium"
                  data-testid={`link-mobile-${item.href.replace("#", "")}`}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection("#contact")}
                  className="bg-gradient-to-l from-gold to-gold-dark text-black font-semibold border-0 mt-4"
                  data-testid="button-mobile-cta"
                >
                  בואו נדבר
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
