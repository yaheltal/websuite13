import { useEffect, useRef } from "react";

export function useLenis() {
  const lenisRef = useRef<unknown>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    let cleanup: (() => void) | null = null;
    let destroyed = false;
    const delay = 0;

    const loadLenis = () => {
      Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]).then(([LenisModule, gsapModule, stModule]) => {
      if (destroyed) return;

      const Lenis = LenisModule.default;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = stModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);
      document.documentElement.style.scrollBehavior = "auto";

      const lenis = new Lenis({
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: isMobile ? 1.8 : 1.5,
        lerp: isMobile ? 0.1 : 0.08,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      const rafCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      cleanup = () => {
        window.removeEventListener("load", onLoad);
        gsap.ticker.remove(rafCallback);
        lenis.destroy();
        document.documentElement.style.scrollBehavior = "";
        ScrollTrigger.refresh();
      };
    });
    };

    if (delay > 0) {
      const t = setTimeout(loadLenis, delay);
      return () => {
        destroyed = true;
        clearTimeout(t);
        cleanup?.();
      };
    }
    loadLenis();
    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return lenisRef;
}
