import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sectionImages = [
  { id: "hero", src: "/images/section-hero.png" },
  { id: "services", src: "/images/section-services.png" },
  { id: "portfolio", src: "/images/section-portfolio.png" },
  { id: "contact", src: "/images/section-contact.png" },
];

export function ScrollBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setParallaxY(scrollY * 0.15);

        const viewportMiddle = scrollY + window.innerHeight * 0.4;
        let newIndex = 0;

        for (let i = sectionImages.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionImages[i].id);
          if (el && el.offsetTop <= viewportMiddle) {
            newIndex = i;
            break;
          }
        }

        setActiveIndex(newIndex);
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <AnimatePresence mode="sync">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${sectionImages[activeIndex].src})`,
              transform: `translateY(${-parallaxY}px) scale(1.1)`,
              willChange: "transform",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-background/85" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
    </div>
  );
}
