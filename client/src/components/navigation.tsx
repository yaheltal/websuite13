import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, MessageCircle, X, ClipboardList, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { WebSuiteLogo } from "./websuite-logo";
import { MagneticButton } from "./magnetic-button";
import { useI18n } from "@/lib/i18n";

const navKeys = [
  { key: "nav.home", href: "#hero", icon: Home },
  { key: "nav.services", href: "#services", icon: Layers },
  { key: "nav.contact", href: "#contact", icon: MessageCircle },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("#hero");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [edgeHover, setEdgeHover] = useState(false);
  const { t, lang } = useI18n();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nearEdge = e.clientX > window.innerWidth - 60;
      setEdgeHover(nearEdge);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < 100 || currentY < lastScrollY);
      setLastScrollY(currentY);

      const sections = navKeys.map((item) => ({
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
        initial={{ x: 80, opacity: 0 }}
        animate={{
          x: (isVisible || edgeHover) ? 0 : 80,
          opacity: (isVisible || edgeHover) ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
      >
        <div className="glass-luxury rounded-2xl px-2 py-3 shadow-xl flex flex-col items-center gap-1">
          <button
            onClick={() => scrollToSection("#hero")}
            className="flex items-center justify-center p-2"
            data-testid="link-logo"
          >
            <WebSuiteLogo size={28} gradientId="nav" />
          </button>

          <div className="h-px w-6 bg-border/60 my-1" />

          {navKeys.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <MagneticButton
                key={item.href}
                as="button"
                strength={0.15}
                onClick={() => scrollToSection(item.href)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={isActive ? { background: "hsl(var(--primary) / 0.15)" } : undefined}
                data-testid={`link-nav-${item.href.replace("#", "")}`}
                title={t(item.key)}
              >
                <item.icon className="w-4 h-4" />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl border border-primary/30 pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </MagneticButton>
            );
          })}

          <div className="h-px w-6 bg-border/60 my-1" />

          <Link href="/onboarding">
            <MagneticButton
              as="span"
              strength={0.2}
              className="block"
            >
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-xl text-white transition-all duration-300 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))" }}
                data-testid="button-nav-questionnaire"
                title={t("nav.questionnaire")}
              >
                <ClipboardList className="w-4 h-4" />
              </button>
            </MagneticButton>
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
              style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <AnimatePresence mode="wait">
          {isMobileExpanded ? (
            <motion.div
              key="expanded"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-luxury rounded-2xl p-4 shadow-xl min-w-[260px]"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <WebSuiteLogo size={28} gradientId="mob" />
                  <span dir="ltr" className="text-sm font-extrabold tracking-tight" style={{ background: "linear-gradient(135deg, hsl(220 80% 60%), hsl(260 70% 60%), hsl(170 80% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", unicodeBidi: "bidi-override", direction: "ltr" }}>
                    WebSuite
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileExpanded(false)}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center"
                  data-testid="button-mobile-close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-1">
                {navKeys.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                      style={isActive ? { background: "hsl(var(--primary) / 0.15)" } : undefined}
                      data-testid={`link-mobile-${item.href.replace("#", "")}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {t(item.key)}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-border/40">
                <Link href="/onboarding">
                  <button
                    className="w-full text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
                    style={{ background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))" }}
                    data-testid="button-mobile-questionnaire"
                  >
                    <ClipboardList className="w-4 h-4" />
                    {t("nav.questionnaire")}
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
              className="flex items-center gap-2"
            >
              <a
                href="https://wa.me/972547966616?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%A4%D7%95%D7%A0%D7%94%20%D7%93%D7%A8%D7%9A%20%D7%90%D7%AA%D7%A8%20WebSuite%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D%20%D7%A9%D7%9C%D7%9B%D7%9D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full px-5 py-3 shadow-lg text-white font-bold text-sm transition-all duration-300 hover:shadow-xl active:scale-95"
                style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
                data-testid="button-mobile-whatsapp"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === "he" ? "דברו איתנו בוואטסאפ!" : "Chat on WhatsApp!"}</span>
              </a>

              <div className="glass-luxury rounded-full shadow-lg flex items-center gap-1 p-1.5">
                {navKeys.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                      style={isActive ? { background: "hsl(var(--primary) / 0.15)" } : undefined}
                      data-testid={`link-mobile-icon-${item.href.replace("#", "")}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {isActive && (
                        <motion.div
                          layoutId="mobile-nav-indicator"
                          className="absolute inset-0 rounded-full border border-primary/30"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => setIsMobileExpanded(true)}
                  className="w-11 h-11 rounded-full flex items-center justify-center p-1"
                  data-testid="button-mobile-menu"
                >
                  <WebSuiteLogo size={32} gradientId="mobc" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
