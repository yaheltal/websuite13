import { useEffect, useRef } from "react";

export function useLenis() {
  const lenisRef = useRef<unknown>(null);

  useEffect(() => {
    // Force scroll to top on page load/refresh
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    let cleanup: (() => void) | null = null;
    let destroyed = false;

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
        touchMultiplier: 1.5,
        lerp: 0.08,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      const rafCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.normalizeScroll(true);
      ScrollTrigger.refresh();

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      cleanup = () => {
        window.removeEventListener("load", onLoad);
        ScrollTrigger.normalizeScroll(false);
        gsap.ticker.remove(rafCallback);
        lenis.destroy();
        document.documentElement.style.scrollBehavior = "";
        ScrollTrigger.refresh();
      };
    });

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return lenisRef;
}
