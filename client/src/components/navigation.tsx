import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, Briefcase, MessageCircle, X, ClipboardList } from "lucide-react";
import { Link } from "wouter";

const navItems = [
  { label: "ראשי", href: "#hero", icon: Home },
  { label: "שירותים", href: "#services", icon: Layers },
  { label: "עבודות", href: "#portfolio", icon: Briefcase },
  { label: "צור קשר", href: "#contact", icon: MessageCircle },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("#hero");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < 100 || currentY < lastScrollY);
      setLastScrollY(currentY);

      const sections = navItems.map((item) => ({
        id: item.href,
        el: document.querySelector(item.href),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileExpanded(false);
  };

  return (
    <>
      <motion.nav
        data-testid="navigation-bar"
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <div className="glass-panel bg-card/90 border border-border/60 rounded-full px-2 py-2 shadow-lg flex items-center gap-1">
          <button
            onClick={() => scrollToSection("#hero")}
            className="flex items-center gap-1.5 pl-3 pr-1"
            data-testid="link-logo"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center">
              <span className="text-xs font-extrabold text-white">W</span>
            </div>
          </button>

          <div className="w-px h-6 bg-border/60 mx-1" />

          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-copper/10 text-copper"
                    : "text-charcoal-light hover:text-charcoal"
                }`}
                data-testid={`link-nav-${item.href.replace("#", "")}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full border border-copper/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}

          <div className="w-px h-6 bg-border/60 mx-1" />

          <Link href="/onboarding">
            <button
              className="flex items-center gap-2 bg-gradient-to-l from-copper to-copper-dark text-white font-bold text-sm px-5 py-2 rounded-full transition-all duration-300 hover:shadow-lg"
              data-testid="button-nav-questionnaire"
            >
              <ClipboardList className="w-4 h-4" />
              שאלון התאמה
            </button>
          </Link>
        </div>
      </motion.nav>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden"
      >
        <AnimatePresence mode="wait">
          {isMobileExpanded ? (
            <motion.div
              key="expanded"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-panel bg-card/95 border border-border/60 rounded-2xl p-4 shadow-xl min-w-[260px]"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center">
                    <span className="text-xs font-extrabold text-white">W</span>
                  </div>
                  <span className="text-sm font-extrabold text-charcoal">
                    Web<span className="text-copper">Craft</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileExpanded(false)}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center"
                  data-testid="button-mobile-close"
                >
                  <X className="w-4 h-4 text-charcoal-light" />
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-copper/10 text-copper"
                          : "text-charcoal-light"
                      }`}
                      data-testid={`link-mobile-${item.href.replace("#", "")}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-border/40">
                <Link href="/onboarding">
                  <button
                    className="w-full bg-gradient-to-l from-copper to-copper-dark text-white font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2"
                    data-testid="button-mobile-questionnaire"
                  >
                    <ClipboardList className="w-4 h-4" />
                    שאלון התאמה
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-panel bg-card/90 border border-border/60 rounded-full shadow-lg flex items-center gap-1 p-1.5"
            >
              {navItems.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? "bg-copper/10 text-copper" : "text-charcoal-light"
                    }`}
                    data-testid={`link-mobile-icon-${item.href.replace("#", "")}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 rounded-full border border-copper/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setIsMobileExpanded(true)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center"
                data-testid="button-mobile-menu"
              >
                <span className="text-xs font-extrabold text-white">W</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
